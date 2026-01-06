import { CollectionConfig, slugField } from 'payload'
import {
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'
// import { VariableInlineField } from '@/components/TextToDisplayInVars'

export const Templates: CollectionConfig = {
  slug: 'templates',
  versions: { drafts: true, maxPerDoc: 50 },
  access: {
    // Allow read access for preview UI (published/draft). In production, tighten to published-only.
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    // Opens your portal preview; replace path if needed
    preview: (doc) => {
      // Point to the co-located Operator UI root with query params.
      // We avoid non-existent /operator/preview/template route and undefined version.
      const base = `/operator?templateId=${doc.id}`
      return doc._status === 'draft' ? `${base}&draft=1` : base
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Survey', value: 'survey' },
            { label: 'Confirmation', value: 'confirmation' },
            { label: 'Notification', value: 'notification' },
            { label: 'Reminder', value: 'reminder' },
            { label: 'Self-Service', value: 'self-service' },
          ],
          required: true,
        },
        {
          name: 'division',
          type: 'select',
          options: [
            'Corporate',
            'IT Operations',
            'Engineering',
            'Support',
            'Sales',
            'Finance',
            'Marketing',
          ],
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Pre-defined', value: 'pre-defined' },
            { label: 'System', value: 'system' },
            { label: 'Custom', value: 'custom' },
          ],
          defaultValue: 'custom',
        },
        {
          name: 'priority',
          type: 'select',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Urgent', value: 'urgent' },
          ],
          defaultValue: 'medium',
        },
        slugField({ fieldToUse: 'name' }),
      ],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: () => [
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          LinkFeature(),
          BlockquoteFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          BlocksFeature({
            blocks: [
              {
                slug: 'image',
                fields: [
                  { name: 'asset', type: 'upload', relationTo: 'media', required: true },
                  { name: 'alt', type: 'text' },
                ],
              },
            ],
            inlineBlocks: [
              {
                slug: 'var',
                fields: [
                  {
                    name: 'variable',
                    type: 'relationship',
                    relationTo: 'variables',
                    required: true,
                  },
                  {
                    name: 'textToDisplay',
                    type: 'text',
                    admin: {
                      components: {
                        Field: {
                          path: '/components/TextToDisplayInVars',
                        },
                      },
                    },
                  },
                ],
                admin: {
                  components: {
                    Label: {
                      path: '/components/CustomInlineBlockLabel',
                    },
                  },
                },
              },
              // {
              //   slug: 'cta',
              //   fields: [
              //     {
              //       name: 'kind',
              //       type: 'select',
              //       options: ['approve', 'dismiss', 'snooze', 'openSelfService'],
              //       required: true,
              //     },
              //     { name: 'label', type: 'text' },
              //   ],
              // },
            ],
          }), // array of block configs
        ],
      }),
    },
    {
      type: 'row',
      fields: [
        { name: 'brandingRef', type: 'relationship', relationTo: 'branding-packages' },
        { name: 'policyRefs', type: 'relationship', relationTo: 'policies', hasMany: true },
        { name: 'channelRefs', type: 'relationship', relationTo: 'channels', hasMany: true },
        { name: 'buttonRefs', type: 'relationship', relationTo: 'buttons', hasMany: true },
        {
          name: 'usageCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of active campaigns using this template',
          },
        },
      ],
    },
  ],
}

export default Templates
