import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const BrandingPackages: CollectionConfig = {
  slug: 'branding-packages',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'row',
      fields: [{ name: 'name', type: 'text', required: true }, slugField({ fieldToUse: 'name' })],
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
                width: '20%',
              },
            },
            {
              name: 'backgroundColorText',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Default background color',
                width: '20%',
              },
            },
            {
              name: 'direction',
              type: 'select',
              options: ['ltr', 'rtl'],
              defaultValue: 'ltr',
              admin: {
                description: 'Text direction',
                width: '20%',
              },
            },
            {
              name: 'messageWidth',
              type: 'number',
              defaultValue: 500,
              admin: {
                description: 'Message width in pixels',
                width: '20%',
              },
            },
            {
              name: 'titleAlign',
              type: 'select',
              options: ['left', 'center', 'right'],
              defaultValue: 'left',
              admin: {
                description: 'Title alignment',
                width: '20%',
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
                width: '25%',
              },
            },
            {
              name: 'bgColor',
              type: 'text',
              defaultValue: '#3b82f6',
              admin: {
                description: 'Button background color',
                width: '25%',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Button text color',
                width: '25%',
              },
            },
            {
              name: 'align',
              type: 'select',
              options: ['left', 'center', 'right'],
              defaultValue: 'left',
              admin: {
                description: 'Buttons alignment',
                width: '25%',
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
              admin: { width: '50%' },
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
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'assets',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'themeTokens',
      type: 'json',
      admin: {
        description:
          'Design tokens exported from your theme generator (colors, spacing, radii, typography, semantic states, light/dark variants).',
      },
    },
    {
      name: 'cssAllowlist',
      type: 'json',
      admin: { description: 'Optional allowlist of CSS tokens/styles permitted for branding.' },
    },
  ],
}

export default BrandingPackages
