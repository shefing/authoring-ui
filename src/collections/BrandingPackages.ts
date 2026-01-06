import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import {colorPickerField} from '@innovixx/payload-color-picker-field'
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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              name: 'themeDesigner',
              type: 'group',
              label: 'Theme Designer',
              fields: [
                {
                  type: 'row',
                  fields: [
                    colorPickerField({ name: 'primaryColor', label: 'Primary Color' }),
                    colorPickerField({ name: 'secondaryColor', label: 'Secondary Color' }),
                    colorPickerField({ name: 'backgroundColor', label: 'Background Color' }),
                    colorPickerField({ name: 'textColor', label: 'Text Color' }),
                  ],
                },
                {
                  name: 'scope',
                  type: 'select',
                  options: [
                    { label: 'All Messages', value: 'all' },
                    { label: 'Survey Messages', value: 'survey' },
                    { label: 'Confirmation Messages', value: 'confirmation' },
                    { label: 'Notification Messages', value: 'notification' },
                    { label: 'Reminder Messages', value: 'reminder' },
                    { label: 'Self-Service Messages', value: 'self-service' },
                    { label: 'Urgent Messages', value: 'urgent' },
                    { label: 'Corporate Division', value: 'corporate' },
                    { label: 'IT Operations Division', value: 'it-operations' },
                    { label: 'Engineering Division', value: 'engineering' },
                    { label: 'Support Division', value: 'support' },
                    { label: 'Sales Division', value: 'sales' },
                    { label: 'Finance Division', value: 'finance' },
                    { label: 'Marketing Division', value: 'marketing' },
                  ],
                  defaultValue: 'all',
                },
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
                      name: 'direction',
                      type: 'select',
                      options: ['ltr', 'rtl'],
                      defaultValue: 'ltr',
                      admin: {
                        description: 'Text direction',
                        width: '33%',
                      },
                    },
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
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              name: 'assets',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description: 'Assets used as part of the theme, such as custom icons for buttons, background images, or specialized fonts.',
              },
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
              admin: {
                description: 'Optional allowlist of CSS tokens/styles permitted for branding to prevent arbitrary or unsafe CSS injection.',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default BrandingPackages
