'use client'

import React, { useCallback, useId } from 'react'
import { useField } from '@payloadcms/ui'
import type { SelectFieldClientProps } from 'payload'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FieldWrapper } from './shared/FieldWrapper'

/**
 * SelectField Component
 * 
 * A custom Payload field component for select inputs using the Riverbed Design System.
 * Uses Radix UI Select primitive styled with Tailwind CSS.
 * 
 * Features:
 * - Data binding via useField hook from @payloadcms/ui
 * - Visual states: Default, Open, Focus, Error, Disabled
 * - Accessibility: proper labeling, keyboard navigation
 * - Supports single selection (hasMany=false)
 */

export const SelectField: React.FC<SelectFieldClientProps> = (props) => {
  const {
    path,
    field,
    readOnly,
  } = props

  const {
    label,
    required,
    admin,
    options = [],
  } = field

  const {
    description,
    className: adminClassName,
  } = admin || {}

  // Get isClearable with proper typing
  const isClearable = (admin as { isClearable?: boolean } | undefined)?.isClearable ?? true

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

  // Handle select change
  const handleValueChange = useCallback(
    (newValue: string) => {
      // Handle clear option
      if (newValue === '__clear__' && isClearable) {
        setValue(null)
      } else {
        setValue(newValue)
      }
    },
    [setValue, isClearable]
  )

  // Normalize options to array of { label, value }
  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option }
    }
    // Handle i18n labels
    const optionLabel = typeof option.label === 'object' && option.label !== null
      ? (option.label as Record<string, string>)['en'] || Object.values(option.label)[0] || option.value
      : typeof option.label === 'string' ? option.label : option.value
    return { label: optionLabel, value: option.value }
  })

  // Get label as string
  const labelString = typeof label === 'object' && label !== null 
    ? (label as Record<string, string>)['en'] || Object.values(label)[0] || ''
    : typeof label === 'string' ? label : undefined

  // Get description as string
  const descriptionString = typeof description === 'object' && description !== null
    ? (description as Record<string, string>)['en'] || Object.values(description)[0] || ''
    : typeof description === 'string' ? description : undefined

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
      <SelectPrimitive.Root
        value={value || undefined}
        onValueChange={handleValueChange}
        disabled={readOnly}
      >
        <SelectPrimitive.Trigger
          id={fieldId}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${fieldId}-error` : undefined}
          className={cn(
            // Base styles
            'useTw flex h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-base',
            // Background and border
            'bg-[var(--input-background)] border border-[var(--input)]',
            // Text
            'text-foreground',
            // Placeholder
            'data-[placeholder]:text-muted-foreground',
            // Transitions
            'transition-colors duration-200',
            // Focus state
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            // Error state
            showError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            // Disabled state
            readOnly && 'opacity-50 cursor-not-allowed bg-muted'
          )}
        >
          <SelectPrimitive.Value placeholder="Select an option..." />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              'useTw relative z-50 max-h-96 min-w-[8rem] overflow-hidden',
              'rounded-lg border border-[var(--border)] bg-[var(--card)]',
              'text-foreground shadow-lg',
              // Animation
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.ScrollUpButton
              className="flex cursor-default items-center justify-center py-1"
            >
              <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="p-1">
              {/* Clear option */}
              {isClearable && value && (
                <SelectPrimitive.Item
                  value="__clear__"
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center',
                    'rounded-md py-2 pl-8 pr-2 text-sm outline-none',
                    'text-muted-foreground italic',
                    'focus:bg-accent focus:text-accent-foreground',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <SelectPrimitive.ItemText>Clear selection</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              )}

              {/* Options */}
              {normalizedOptions.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center',
                    'rounded-md py-2 pl-8 pr-2 text-sm outline-none',
                    'focus:bg-accent focus:text-accent-foreground',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4 text-primary" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton
              className="flex cursor-default items-center justify-center py-1"
            >
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </FieldWrapper>
  )
}

export default SelectField
