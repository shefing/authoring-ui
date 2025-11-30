import type { CollectionConfig, FieldHook } from 'payload'

const keyPattern = /^[a-zA-Z][a-zA-Z0-9_\-]*$/

const validateKey: FieldHook = async ({ value }) => {
  if (!value || typeof value !== 'string') return 'Key is required'
  if (!keyPattern.test(value)) {
    return 'Use letters/numbers/underscore/dash; must start with a letter'
  }
  return value
}

export const Variables: CollectionConfig = {
  slug: 'variables',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: { useAsTitle: 'key' },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, hooks: { beforeValidate: [validateKey] } },
    { name: 'label', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['string', 'number', 'boolean', 'date', 'dateTime', 'url', 'email', 'enum'],
      defaultValue: 'string',
    },
    {
      name: 'enumOptions',
      type: 'array',
      admin: { condition: ({ siblingData }) => siblingData?.type === 'enum' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text' },
      ],
    },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'description', type: 'textarea' },
    { name: 'formatHint', type: 'text', admin: { description: 'e.g., date: YYYY-MM-DD or number: 0.00' } },
    { name: 'sampleValue', type: 'text', admin: { description: 'Optional example value for previews/tests' } },
  ],
}

export default Variables
