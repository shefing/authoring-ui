import type { CollectionConfig } from 'payload'
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
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, required: true },
    { name: 'type', type: 'select', options: ['notification', 'action'], required: true },
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
            //TODO
            // inlineBlocks: [
            //   {
            //     slug: 'var',
            //     fields: [
            //       {
            //         name: 'variable',
            //         type: 'relationship',
            //         relationTo: 'variables',
            //         required: true,
            //       },
            //     ],
            //   },
            //   {
            //     slug: 'cta',
            //     fields: [
            //       {
            //         name: 'kind',
            //         type: 'select',
            //         options: ['approve', 'dismiss', 'snooze', 'openSelfService'],
            //         required: true,
            //       },
            //       { name: 'label', type: 'text' },
            //     ],
            //   },
            // ],
          }), // array of block configs
        ],
      }),
    },
    {
      type: 'row',
      fields: [
        { name: 'brandingRef', type: 'relationship', relationTo: 'branding-packages' },
        { name: 'policyRefs', type: 'relationship', relationTo: 'policies', hasMany: true },
      ],
    },
    {
      name: 'channels',
      type: 'group',
      admin: {
        hidden: true,
      },
      fields: [
        { name: 'device', type: 'json' },
        { name: 'teams', type: 'json' },
      ],
    },
  ],
}

export default Templates
