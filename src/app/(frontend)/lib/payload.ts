const API_URL =
  process.env.PAYLOAD_API_URL ||
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
  '' // empty → use same-origin relative requests
const API_TOKEN = process.env.PAYLOAD_API_TOKEN

if (
  !process.env.PAYLOAD_API_URL &&
  !process.env.NEXT_PUBLIC_PAYLOAD_API_URL
) {
  // Same-origin fallback. This is fine for the co-located frontend.
  // Set one of the *_PAYLOAD_API_URL envs to override.
  console.info('PAYLOAD API URL not set; using same-origin relative requests for Payload API')
}

export async function payloadGet(path: string, init?: RequestInit) {
  const url = API_URL ? `${API_URL}${path}` : path
  console.log('url', url)
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Payload GET ${url} failed: ${res.status} ${text}`)
  }
  const results = await res.json()
  console.log('res', results)

  return results
}

export async function payloadPost(path: string, body: any, init?: RequestInit) {
  const url = API_URL ? `${API_URL}${path}` : path
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Payload POST ${url} failed: ${res.status} ${text}`)
  }
  return res.json()
}

export type TemplateSummary = { id: string; name: string; slug: string; _status?: string | null }

export async function listPublishedTemplates(): Promise<TemplateSummary[]> {
  const data = await payloadGet(`/api/templates?limit=100`)
  return data?.docs || []
}

export async function getTemplateById(id: string, opts?: { draft?: boolean }) {
  const qs = opts?.draft ? '?draft=true&depth=2' : '?depth=2'
  return payloadGet(`/api/templates/${id}${qs}`)
}
