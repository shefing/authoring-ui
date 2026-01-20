import { notFound } from 'next/navigation'
import { getBrandingByIdServer } from '../../lib/payload-server'
import { BrandingPreview } from './BrandingPreview'
import { Branding } from '@/payload-types'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; draft?: string }>
}) {
  const { id, draft } = await searchParams

  if (!id) return notFound()

  try {
    const initialData = await getBrandingByIdServer(id, {
      draft: draft === 'true' || draft === '1',
    })

    if (!initialData) return notFound()

    return <BrandingPreview initialData={initialData as unknown as Branding} />
  } catch (error) {
    console.error('Error fetching branding for preview:', error)
    return notFound()
  }
}
