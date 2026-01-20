import {getPayload} from 'payload'
import {seed} from '@/seed'
import config from '@/payload.config'
import {headers} from 'next/headers'

export const maxDuration = 60

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()


  try {
    await seed(payload)
    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })
    return new Response('Error seeding data.', { status: 500 })
  }
}
