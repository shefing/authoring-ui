import { notFound } from 'next/navigation'
import { getMessageByIdServer } from '../../lib/payload-server'
import { MessagePreviewPage } from './MessagePreviewPage'
import { Message } from '@/payload-types'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; draft?: string }>
}) {
  const { id, draft } = await searchParams

  if (!id) return notFound()

  try {
    const initialData = await getMessageByIdServer(id, {
      draft: draft === 'true' || draft === '1',
    })

    if (!initialData) return notFound()

    return <MessagePreviewPage initialData={initialData as unknown as Message} />
  } catch (error) {
    console.error('Error fetching message for preview:', error)
    return notFound()
  }
}
