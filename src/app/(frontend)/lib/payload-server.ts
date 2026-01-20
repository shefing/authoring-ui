import {getPayload} from 'payload'
import config from '@/payload.config'

export const getPayloadInstance = async () => {
  return await getPayload({ config })
}

export async function listPublishedTemplatesServer() {
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
    slug: doc.slug,
    _status: doc._status
  }))
}

export async function getTemplateByIdServer(id: string, opts?: { draft?: boolean }) {
  const payload = await getPayloadInstance()
  return await payload.findByID({
    collection: 'templates',
    id,
    draft: opts?.draft,
    depth: 2,
  })
}
