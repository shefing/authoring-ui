'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FieldDescriptionProps {
  description?: string
  className?: string
}

export const FieldDescription: React.FC<FieldDescriptionProps> = ({
  description,
  className,
}) => {
  if (!description) return null

  return (
    <p
      className={cn(
        'useTw text-sm text-muted-foreground mt-1',
        className
      )}
    >
      {description}
    </p>
  )
}

export default FieldDescription
