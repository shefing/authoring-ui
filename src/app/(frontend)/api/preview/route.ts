import {NextRequest} from 'next/server'
import {getMessageByIdServer, getTemplateByIdServer} from '../../lib/payload-server'
import {buildPreview} from '../../lib/render'
import { Template } from '@/payload-types'

// Simple in-memory rate limiter per process (IP → {count, reset})
const RATE_WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const RATE_LIMIT = 60 // max requests per window
const buckets: Map<string, { count: number; reset: number }> = new Map()

function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const b = buckets.get(ip)
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS })
    return true
  }
  if (b.count < RATE_LIMIT) {
    b.count += 1
    return true
  }
  return false
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  ) as string
}

export async function POST(req: NextRequest) {
  try {
      console.log("/api/preview")
    // Optional shared-secret protection
    const token = process.env.FRONTEND_PREVIEW_TOKEN
    if (token) {
      const provided = req.headers.get('x-preview-token')
      if (provided !== token) {
        return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
      }
    }

    // Basic rate limiting
    const ip = getIp(req)
    if (!rateLimitOk(ip)) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 })
    }

    const body = await req.json().catch(() => ({}))
    const { templateId, messageId, draft, variables } = body || {}

    // Input validation
    if (!templateId && !messageId) {
      return new Response(JSON.stringify({ error: 'templateId or messageId is required' }), { status: 400 })
    }
    if (draft != null && typeof draft !== 'boolean') {
      return new Response(JSON.stringify({ error: 'draft must be boolean when provided' }), { status: 400 })
    }
    if (variables != null && (typeof variables !== 'object' || Array.isArray(variables))) {
      return new Response(JSON.stringify({ error: 'variables must be an object map' }), { status: 400 })
    }

    // Fetch template/message and build preview
    let tpl: Template
    let msg: any = null
    try {
      if (messageId) {
        msg = await getMessageByIdServer(messageId, { draft: !!draft })
        if (!msg) throw new Error('message not found')
        tpl = msg.template as unknown as Template
      } else {
        tpl = (await getTemplateByIdServer(templateId, { draft: !!draft })) as unknown as Template
      }
    } catch (e: unknown) {
      const msgError = e instanceof Error ? e.message : String(e)
      const status = /\b404\b/.test(msgError) ? 404 : 502
      return new Response(JSON.stringify({ error: 'fetch_failed', detail: msgError }), { status })
    }

    const preview = buildPreview({ template: tpl, variables: variables || {}, message: msg })
    return new Response(JSON.stringify({ templateId, preview }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'preview failed'
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}

// Convenience GET handler to avoid confusion when hitting the endpoint in a browser.
// Returns usage info instead of a 404 when GET is used.
export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      usage: 'POST /api/preview with JSON body { templateId?: string, messageId?: string, draft?: boolean, variables?: Record<string, any> }',
      note: 'This route is meant for POST requests from the Operator UI.',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
