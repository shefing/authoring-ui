import type {CollectionConfig} from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  enableQueryPresets: true,
  admin: {
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
