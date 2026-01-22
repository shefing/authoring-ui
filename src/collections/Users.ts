import type {CollectionConfig} from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '👥 User',
    plural: '👥 Users',
  },
  enableQueryPresets: true,
  admin: {
    group: 'Organization',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
