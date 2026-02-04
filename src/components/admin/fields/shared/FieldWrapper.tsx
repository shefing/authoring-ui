'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FieldLabel } from './FieldLabel'
import { FieldError } from './FieldError'
import { FieldDescription } from './FieldDescription'

interface FieldWrapperProps {
  children: React.ReactNode
  path: string
  label?: string | false
  required?: boolean
  description?: string
  showError?: boolean
  errorMessage?: string
  className?: string
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  children,
  path,
  label,
  required,
  description,
  showError,
  errorMessage,
  className,
}) => {
  const fieldId = `field-${path.replace(/\./g, '-')}`

  return (
    <div
      className={cn(
        'twp field-type mb-6',
        showError && 'field-type--has-error',
        className
      )}
    >
      <FieldLabel
        htmlFor={fieldId}
        label={label}
        required={required}
      />
      {children}
      <FieldDescription description={description} />
      <FieldError showError={showError} message={errorMessage} />
    </div>
  )
}

export default FieldWrapper
