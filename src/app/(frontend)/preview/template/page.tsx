import { notFound } from 'next/navigation'
import { getTemplateByIdServer } from '../../lib/payload-server'
import { TemplatePreview } from './TemplatePreview'
import { Template } from '@/payload-types'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; draft?: string }>
}) {
  const { id, draft } = await searchParams

  if (!id) return notFound()

  try {
    const initialData = await getTemplateByIdServer(id, {
      draft: draft === 'true' || draft === '1',
    })

    if (!initialData) return notFound()

    return <TemplatePreview initialData={initialData as unknown as Template} />
  } catch (error) {
    console.error('Error fetching template for preview:', error)
    return notFound()
  }
}
