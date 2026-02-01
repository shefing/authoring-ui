'use client'

import React, { useCallback, useId } from 'react'
import { useField } from '@payloadcms/ui'
import type { CheckboxFieldClientProps } from 'payload'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FieldError } from './shared/FieldError'
import { FieldDescription } from './shared/FieldDescription'

/**
 * CheckboxField Component
 * 
 * A custom Payload field component for checkbox inputs using the Riverbed Design System.
 * Uses Radix UI Checkbox primitive styled with Tailwind CSS.
 * 
 * Features:
 * - Data binding via useField hook from @payloadcms/ui
 * - Visual states: Default, Checked, Focus, Error, Disabled
 * - Accessibility: proper labeling, keyboard navigation
 */

export const CheckboxField: React.FC<CheckboxFieldClientProps> = (props) => {
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
    className: adminClassName,
  } = admin || {}

  // Get field state from Payload's useField hook
  const {
    value,
    setValue,
    showError,
    errorMessage,
  } = useField<boolean>({
    path,
  })

  // Generate unique ID for accessibility
  const uniqueId = useId()
  const fieldId = `field-${path.replace(/\./g, '-')}-${uniqueId}`

  // Handle checkbox change
  const handleCheckedChange = useCallback(
    (checked: boolean | 'indeterminate') => {
      setValue(checked === true)
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

  return (
    <div
      className={cn(
        'useTw field-type field-type-checkbox mb-6',
        showError && 'field-type--has-error',
        typeof adminClassName === 'string' ? adminClassName : undefined
      )}
    >
      <div className="flex items-start gap-3">
        <CheckboxPrimitive.Root
          id={fieldId}
          checked={value || false}
          onCheckedChange={handleCheckedChange}
          disabled={readOnly}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${fieldId}-error` : undefined}
          className={cn(
            // Base styles
            'useTw peer h-5 w-5 shrink-0 rounded border-2',
            // Background and border
            'border-[var(--input)] bg-[var(--input-background)]',
            // Transitions
            'transition-all duration-200',
            // Focus state
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
            // Checked state
            'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
            // Error state
            showError && 'border-destructive focus-visible:ring-destructive/20',
            // Disabled state
            readOnly && 'opacity-50 cursor-not-allowed'
          )}
        >
          <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        <div className="flex flex-col gap-1">
          {labelString && (
            <label
              htmlFor={fieldId}
              className={cn(
                'text-base font-medium text-foreground cursor-pointer',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              )}
            >
              {labelString}
              {required && (
                <span className="text-destructive ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          <FieldDescription description={descriptionString} />
        </div>
      </div>
      <FieldError showError={showError} message={errorMessage} />
    </div>
  )
}

export default CheckboxField
