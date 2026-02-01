import {getPayload} from 'payload'
import config from '@/payload.config'
import type { Branding, Template } from '@/payload-types'

export const getPayloadInstance = async () => {
  return await getPayload({ config })
}

export type TemplateSummary = { id: string; name: string; _status?: string | null }

export async function listPublishedTemplatesServer(): Promise<TemplateSummary[]> {
  const payload = await getPayloadInstance()
  const data = await payload.find({
    collection: 'templates',
    limit: 100,
    depth: 0,
    // Add where clause if only published templates should be listed
    // where: { _status: { equals: 'published' } }
  })
  return data.docs.map(doc => ({
    id: doc.id,
    name: doc.name,
    _status: doc._status || null
  }))
}

export async function getTemplateByIdServer(id: string, opts?: { draft?: boolean }): Promise<Template> {
  const payload = await getPayloadInstance()
  return await payload.findByID({
    collection: 'templates',
    id,
    draft: opts?.draft,
    depth: 2,
  }) as unknown as Template
}

export async function getBrandingByIdServer(id: string, opts?: { draft?: boolean }): Promise<Branding> {
  const payload = await getPayloadInstance()
  return await payload.findByID({
    collection: 'branding',
    id,
    draft: opts?.draft,
    depth: 1,
  }) as unknown as Branding
}

export async function getMessageByIdServer(id: string, opts?: { draft?: boolean }) {
  const payload = await getPayloadInstance()
  return await payload.findByID({
    collection: 'messages',
    id,
    draft: opts?.draft,
    depth: 3, // Depth 3 to get template -> branding
  })
}
