'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FieldErrorProps {
  message?: string
  showError?: boolean
  className?: string
}

export const FieldError: React.FC<FieldErrorProps> = ({
  message,
  showError,
  className,
}) => {
  if (!showError || !message) return null

  return (
    <p
      className={cn(
        'useTw text-sm text-destructive mt-1',
        className
      )}
      role="alert"
    >
      {message}
    </p>
  )
}

export default FieldError
