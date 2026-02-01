'use client'

import React, { useCallback, useId } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import { cn } from '@/lib/utils'
import { FieldWrapper } from './shared/FieldWrapper'

/**
 * TextField Component
 * 
 * A custom Payload field component for text and email inputs using the Riverbed Design System.
 * Uses Radix UI primitives styled with Tailwind CSS.
 * 
 * Features:
 * - Data binding via useField hook from @payloadcms/ui
 * - Visual states: Default, Focus, Error, Disabled
 * - Accessibility: proper labeling, error announcements, keyboard navigation
 */

export const TextField: React.FC<TextFieldClientProps> = (props) => {
  const {
    path,
    field,
    readOnly,
  } = props

  const {
    label,
    required,
    admin,
  } = field

  const {
    description,
    placeholder,
    className: adminClassName,
  } = admin || {}

  // Get field state from Payload's useField hook
  const {
    value,
    setValue,
    showError,
    errorMessage,
  } = useField<string>({
    path,
  })

  // Generate unique ID for accessibility
  const uniqueId = useId()
  const fieldId = `field-${path.replace(/\./g, '-')}-${uniqueId}`

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    [setValue]
  )

  // Get label as string
  const labelString = typeof label === 'object' && label !== null 
    ? (label as Record<string, string>)['en'] || Object.values(label)[0] || ''
    : typeof label === 'string' ? label : undefined

  // Get description as string
  const descriptionString = typeof description === 'object' && description !== null
    ? (description as Record<string, string>)['en'] || Object.values(description)[0] || ''
    : typeof description === 'string' ? description : undefined

  // Get placeholder as string
  const placeholderString = typeof placeholder === 'object' && placeholder !== null
    ? (placeholder as Record<string, string>)['en'] || Object.values(placeholder)[0] || ''
    : typeof placeholder === 'string' ? placeholder : undefined

  return (
    <FieldWrapper
      path={path}
      label={labelString}
      required={required}
      description={descriptionString}
      showError={showError}
      errorMessage={errorMessage}
      className={typeof adminClassName === 'string' ? adminClassName : undefined}
    >
      <input
        id={fieldId}
        type="text"
        value={value || ''}
        onChange={handleChange}
        disabled={readOnly}
        placeholder={placeholderString}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${fieldId}-error` : undefined}
        className={cn(
          // Base styles
          'useTw flex h-10 w-full rounded-lg px-3 py-2 text-base',
          // Background and border
          'bg-[var(--input-background)] border border-[var(--input)]',
          // Text and placeholder
          'text-foreground placeholder:text-muted-foreground',
          // Transitions
          'transition-colors duration-200',
          // Focus state
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          // Error state
          showError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          // Disabled state
          readOnly && 'opacity-50 cursor-not-allowed bg-muted',
          // File input specific
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground'
        )}
      />
    </FieldWrapper>
  )
}

export default TextField
