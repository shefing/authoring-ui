import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ClientComposer from '../preview-client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { listPublishedTemplatesServer, getTemplateByIdServer } from '../lib/payload-server'

export const dynamic = 'force-dynamic'

export default async function OperatorPage({ searchParams }: { searchParams?: any }) {
  // Check if user is authenticated
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  
  if (!user) {
    redirect('/admin')
  }
  const templates = await listPublishedTemplatesServer().catch((err) => {
    console.error('Failed to load templates:', err)
    return []
  })

  // Next.js (newer versions) pass searchParams as an async dynamic API (a Promise).
  // Support both Promise and plain object to be compatible across versions.
  const sp =
    searchParams && typeof searchParams.then === 'function'
      ? await searchParams
      : searchParams || {}

  const templateIdParam = (sp?.templateId as string) || ''
  const draftParam = (sp?.draft as string) || ''
  const initialDraft = draftParam === '1' || draftParam === 'true'

  let initialTemplateData = null
  if (templateIdParam) {
    try {
      initialTemplateData = await getTemplateByIdServer(templateIdParam, { draft: initialDraft })
    } catch (err) {
      console.error('Failed to load initial template:', err)
    }
  }

  return (
    <div className="px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Operator — Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientComposer
            templates={templates}
            initialTemplateId={templateIdParam}
            initialDraft={initialDraft}
            initialTemplateData={initialTemplateData}
          />
        </CardContent>
      </Card>
    </div>
  )
}
