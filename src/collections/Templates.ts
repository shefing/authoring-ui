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
    FixedToolbarFeature
} from '@payloadcms/richtext-lexical'
// import { VariableInlineField } from '@/components/TextToDisplayInVars'

export const Templates: CollectionConfig = {
  slug: 'templates',
  versions: { drafts: true, maxPerDoc: 50 },
  access: {
    // Allow read access for preview UI (published/draft). In production, tighten to published-only.
    read: () => true,
    create: () => false,
    update: () => false,
    delete: () => false,
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
        slugField({ fieldToUse: 'name' }),
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'messageType',
          label: 'Type',
          type: 'select',
          options: [
            { label: 'Notification', value: 'notification' },
          ],
          required: true,
        },
        {
          name: 'usage',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Number of messages using this template',
          },
          hooks: {
            afterRead: [
              async ({ data, req }) => {
                if (!data?.id) return 0
                const messages = await req.payload.find({
                  collection: 'messages',
                  where: {
                    template: {
                      equals: data.id,
                    },
                  },
                  limit: 0,
                })
                return messages.totalDocs
              },
            ],
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'branding',
          type: 'relationship',
          relationTo: 'branding',
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({
        features: () => [
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          LinkFeature(),
          BlockquoteFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          FixedToolbarFeature(),
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
                ],
              },
            ],
          }),
        ],
      }),
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default Templates
