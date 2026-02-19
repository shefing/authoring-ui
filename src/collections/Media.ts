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
  upload: true,
}
