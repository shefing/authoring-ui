import type {CollectionConfig} from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: '🖼️ Media',
    plural: '🖼️ Media',
  },
  enableQueryPresets: true,
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'webp',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'thumbnail',
        width: 250,
        formatOptions: { format: 'webp' },

      },
      {
        name: 'logo-xsmall',
        width: 50,
        formatOptions: { format: 'webp' },
      },
      {
        name: 'logo-small',
        width: 200,
        formatOptions: { format: 'webp' },
      },
      {
        name: 'logo-medium',
        width: 400,
        formatOptions: { format: 'webp' },
      },
      {
        name: 'medium',
        width: 800,
        formatOptions: { format: 'webp', options: { quality: 90 } },
      },
      {
        name: 'large',
        width: 1200,
        formatOptions: { format: 'webp' },
      },
    ],
  },
}
