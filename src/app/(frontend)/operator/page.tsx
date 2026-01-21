import React from 'react'
import {redirect} from 'next/navigation'
import {headers} from 'next/headers'
import {getPayload} from 'payload'
import config from '@/payload.config'
import ClientComposer from '../preview-client'
import {Card, CardContent, CardHeader, CardTitle} from '../components/ui/card'
import {getTemplateByIdServer, listPublishedTemplatesServer} from '../lib/payload-server'
import type { Template } from '@/payload-types'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function OperatorPage({ searchParams }: PageProps) {
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

  const sp = await searchParams

  const templateIdParam = (sp?.templateId as string) || ''
  const draftParam = (sp?.draft as string) || ''
  const initialDraft = draftParam === '1' || draftParam === 'true'

  let initialTemplateData: Template | null = null
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
