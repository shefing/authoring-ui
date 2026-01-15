import { NextRequest } from 'next/server'
import { getTemplateByIdServer } from '../../lib/payload-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') || ''
    const draft = searchParams.get('draft') === '1' || searchParams.get('draft') === 'true'
    if (!id) {
      return new Response(JSON.stringify({ error: 'id is required' }), { status: 400 })
    }
    let tpl: any
    try {
      tpl = await getTemplateByIdServer(id, { draft })
    } catch (e: any) {
      const msg = String(e?.message || '')
      const status = /\b404\b/.test(msg) ? 404 : 502
      return new Response(JSON.stringify({ error: 'template_fetch_failed', detail: msg }), { status })
    }
    return new Response(JSON.stringify(tpl), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'failed' }), { status: 500 })
  }
}
