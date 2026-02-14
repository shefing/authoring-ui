'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

const CustomInlineBlockLabel: React.FC = () => {
  const [displayText, setDisplayText] = useState('-')

  const variableId: string = useFormFields(([fields]) => {
    const td = fields.variable
    if (!td?.value) return ''
    return td.value
  }) as string

  useEffect(() => {
    if (!variableId) {
      setDisplayText('-')
      return
    }

    const fetchVariable = async () => {
      try {
        const response = await fetch(`/api/variables/${variableId}?depth=0`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setDisplayText(data?.key || '-')
      } catch (error) {
        console.error('Error fetching variable details:', error)
        setDisplayText('-')
      }
    }

    fetchVariable()
  }, [variableId])

  return <div>{displayText}</div>
}

export default CustomInlineBlockLabel
