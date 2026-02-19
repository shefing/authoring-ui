'use client'
import type { DefaultCellComponentProps, UploadFieldClient } from 'payload'
import React, { useEffect, useState } from 'react'

export const MediaCell: React.FC<DefaultCellComponentProps<UploadFieldClient>> = ({
  cellData,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchMediaData = async (id: string) => {
      try {
        const response = await fetch(`/api/media/${id}/?depth=1&draft=false`)
        const data = await response.json()
        if (data && data.url) {
          setImageUrl(data.url)
        }
      } catch (error) {
        console.error('Error fetching media data:', error)
      }
    }

    if (cellData && typeof cellData === 'string') {
      fetchMediaData(cellData)
    }
  }, [cellData])

  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile Image"
          style={{
            width: '30px',
            height: 'auto',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      ) : (
        'N/A'
      )}
    </div>
  )
}

export default MediaCell