'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

const CustomInlineBlockLabel: React.FC = () => {
  const textToDisplay: string = useFormFields(([fields]) => {
    const td = fields.textToDisplay
    if (!td?.value) return '-'
    return td.value
  }) as string

  return <div>{textToDisplay}</div>
}

export default CustomInlineBlockLabel
