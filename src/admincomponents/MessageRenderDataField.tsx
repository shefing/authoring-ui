'use client'

import React from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'
import { JSONFieldClientProps } from 'payload'

type RenderDataItem = {
  type: 'variable' | 'button'
  label: string
  value: string
  key?: string
}

const MessageRenderDataField: React.FC<JSONFieldClientProps> = ({ path, field }) => {
  const { value, setValue } = useField<RenderDataItem[]>({ path })

  const items = Array.isArray(value) ? value : []
  const variables = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item?.type === 'variable')
  const buttons = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item?.type === 'button')

  const updateItem = (index: number, patch: Partial<RenderDataItem>) => {
    const updated = items.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    setValue(updated)
  }

  return (
    <div className="field-type">
      <FieldLabel htmlFor={`field-${path?.replace(/\./gi, '__')}`} label={field?.label || 'Render Data'} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
        <div>
          <strong>Variables</strong>
          {variables.length === 0 && <p style={{ margin: '6px 0 0', fontSize: '12px' }}>No variables found.</p>}
          {variables.map(({ item, index }) => (
            <div
              key={`variable-${item.label}-${index}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center', marginTop: '8px' }}
            >
              <div>
                <div>{item.label}</div>
                {item.key && item.key !== item.label && (
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Key: {item.key}</div>
                )}
              </div>
              <input
                type="text"
                value={item.value || ''}
                onChange={(event) => updateItem(index, { value: event.target.value })}
                style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
          ))}
        </div>
        <div>
          <strong>Button Text</strong>
          {buttons.length === 0 && <p style={{ margin: '6px 0 0', fontSize: '12px' }}>No buttons found.</p>}
          {buttons.map(({ item, index }) => (
            <div
              key={`button-${item.label}-${index}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center', marginTop: '8px' }}
            >
              <div>{item.label}</div>
              <input
                type="text"
                value={item.value || ''}
                onChange={(event) => updateItem(index, { value: event.target.value })}
                style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MessageRenderDataField