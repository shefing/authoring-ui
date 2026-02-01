import {NextRequest} from 'next/server'
import {getMessageByIdServer} from '../../lib/payload-server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') || ''
    const draft = searchParams.get('draft') === '1' || searchParams.get('draft') === 'true'
    if (!id) {
      return new Response(JSON.stringify({ error: 'id is required' }), { status: 400 })
    }
    
    try {
      const msg = await getMessageByIdServer(id, { draft })
      if (!msg) {
        return new Response(JSON.stringify({ error: 'message_not_found' }), { status: 404 })
      }
      return new Response(JSON.stringify(msg), { status: 200, headers: { 'Content-Type': 'application/json' } })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      const status = /\b404\b/.test(msg) ? 404 : 502
      return new Response(JSON.stringify({ error: 'message_fetch_failed', detail: msg }), { status })
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'failed'
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
