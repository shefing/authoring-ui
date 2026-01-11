import React from 'react'
import ClientComposer from '../preview-client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { listPublishedTemplates } from '../lib/payload'

export const dynamic = 'force-dynamic'

export default async function OperatorPage({ searchParams }: { searchParams?: any }) {
  const templates = await listPublishedTemplates().catch((err) => {
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
  return (
    <div className="px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientComposer
            templates={templates}
            initialTemplateId={templateIdParam}
            initialDraft={initialDraft}
          />
        </CardContent>
      </Card>
    </div>
  )
}
