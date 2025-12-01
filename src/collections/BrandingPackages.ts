import type { CollectionConfig } from 'payload'

export const BrandingPackages: CollectionConfig = {
  slug: 'branding-packages',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    // Basic Information
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          required: true,
          admin: { width: '50%' },
        },
      ],
    },

    // General Styling
    {
      name: 'generalStyling',
      type: 'group',
      label: 'General Styling',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'textColorText',
              type: 'text',
              defaultValue: '#000000',
              admin: {
                description: 'Default text color',
                width: '33%',
              },
            },
            {
              name: 'backgroundColorText',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Default background color',
                width: '33%',
              },
            },
            {
              name: 'direction',
              type: 'select',
              options: ['ltr', 'rtl'],
              defaultValue: 'ltr',
              admin: {
                description: 'Text direction',
                width: '34%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'messageWidth',
              type: 'number',
              defaultValue: 500,
              admin: {
                description: 'Message width in pixels',
                width: '33%',
              },
            },
            {
              name: 'titleAlign',
              type: 'select',
              options: ['left', 'center', 'right'],
              defaultValue: 'left',
              admin: {
                description: 'Title alignment',
                width: '33%',
              },
            },
            {
              name: 'buttonsAlign',
              type: 'select',
              options: ['left', 'center', 'right'],
              defaultValue: 'left',
              admin: {
                description: 'Buttons alignment',
                width: '34%',
              },
            },
          ],
        },
      ],
    },

    // Logo Settings
    {
      name: 'logoSettings',
      type: 'group',
      label: 'Logo Settings',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'logo',
              type: 'relationship',
              relationTo: 'media',
              admin: { width: '50%' },
            },
            {
              name: 'logoPos',
              type: 'select',
              options: [
                { label: 'Left (same row as title)', value: 'left-inline' },
                { label: 'Right (same row as title)', value: 'right-inline' },
                { label: 'Before title (separate row)', value: 'before' },
                { label: 'After title (separate row)', value: 'after' },
                { label: 'Center (separate row)', value: 'center' },
              ],
              defaultValue: 'center',
              admin: {
                description: 'Logo position relative to title',
                width: '50%',
              },
            },
          ],
        },
      ],
    },

    // Approve Button Settings
    {
      name: 'approveBtn',
      type: 'group',
      label: 'Approve Button Settings',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Approve',
              admin: {
                description: 'Text on the approve button',
                width: '33%',
              },
            },
            {
              name: 'bgColor',
              type: 'text',
              defaultValue: '#3b82f6',
              admin: {
                description: 'Button background color',
                width: '33%',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Button text color',
                width: '34%',
              },
            },
          ],
        },
      ],
    },

    // Signature Settings
    {
      name: 'signature',
      type: 'group',
      label: 'Signature Settings',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'text',
              type: 'text',
              admin: { width: '70%' },
            },
            {
              name: 'position',
              type: 'select',
              options: [
                { label: 'Align left', value: 'left' },
                { label: 'Align right', value: 'right' },
                { label: 'Center', value: 'center' },
              ],
              defaultValue: 'center',
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    {
      name: 'themeTokens',
      type: 'json',
      defaultValue: {
        colors: {
          primary: '#3b82f6',
          background: '#ffffff',
          text: '#000000',
          border: '#e5e7eb',
          buttonText: '#ffffff',
          textMuted: '#6b7280',
        },
        spacing: { xsmall: '8px', small: '12px', medium: '16px', large: '24px' },
        radii: { small: '4px', medium: '8px', large: '12px' },
      },
      admin: { hidden: true },
    },
    { name: 'cssAllowlist', type: 'json', admin: { hidden: true } },
    {
      name: 'assets',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: { hidden: true },
    },
  ],
}

export default BrandingPackages
