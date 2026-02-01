'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FieldLabelProps {
  htmlFor?: string
  label?: string | false
  required?: boolean
  className?: string
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  htmlFor,
  label,
  required,
  className,
}) => {
  if (label === false || !label) return null

  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'useTw block text-base font-medium text-foreground mb-2',
        className
      )}
    >
      {label}
      {required && (
        <span className="text-destructive ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

export default FieldLabel
