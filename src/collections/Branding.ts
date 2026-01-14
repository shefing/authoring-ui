import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { createBackgroundColorField, createColorField } from '@/components/color-picker/index'

export const Branding: CollectionConfig = {
  slug: 'branding',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        slugField({ fieldToUse: 'name' }),
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Design',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'scope',
                  type: 'select',
                  options: [
                    { label: 'All Messages', value: 'all' },
                    { label: 'Urgent Messages', value: 'urgent' },
                    { label: 'Division-specific', value: 'division' },
                    { label: 'Message-Type specific', value: 'message-type' },
                  ],
                  defaultValue: 'all',
                },
                {
                  name: 'scopeType',
                  type: 'select',
                  options: [
                    { label: 'Global', value: 'global' },
                    { label: 'Urgency', value: 'urgency' },
                    { label: 'Division', value: 'division' },
                    { label: 'Message-Type', value: 'message-type' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'division',
                  type: 'relationship',
                  relationTo: 'divisions',
                  admin: {
                    condition: (data) => data.scope === 'division' || data.scopeType === 'division',
                  },
                },
                {
                  name: 'messageType',
                  type: 'select',
                  options: [
                    { label: 'Survey', value: 'survey' },
                    { label: 'Confirmation', value: 'confirmation' },
                    { label: 'Notification', value: 'notification' },
                    { label: 'Reminder', value: 'reminder' },
                    { label: 'Self-Service', value: 'self-service' },
                  ],
                  admin: {
                    condition: (data) => data.scope === 'message-type' || data.scopeType === 'message-type',
                  },
                },
              ],
            },
            {
              name: 'colors',
              type: 'group',
              label: 'Brand Colors',
              fields: [
                {
                  type: 'row',
                  fields: [
                      createColorField({ name: 'primaryColor', label: 'Primary Color' }),
                      createColorField({ name: 'secondaryColor', label: 'Secondary Color' }),
                      createBackgroundColorField({ name: 'backgroundColor', label: 'Background Color' }),
                      createColorField({ name: 'textColor', label: 'Text Color' }),
                  ],
                },
              ],
            },
            {
              name: 'fonts',
              type: 'group',
              label: 'Typography',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'fontFamily',
                      type: 'text',
                    },
                    {
                      name: 'fontSize',
                      type: 'text',
                    },
                    {
                      name: 'fontWeight',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Assets & CSS',
          fields: [
            {
              name: 'logos',
              type: 'array',
              label: 'Theme Logos',
              fields: [
                {
                  name: 'logo',
                  type: 'relationship',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'customCSS',
              type: 'code',
              admin: {
                language: 'css',
                description: 'Advanced CSS customization',
              },
            },
          ],
        },
        {
          label: 'Status',
          fields: [
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
}

export default Branding
