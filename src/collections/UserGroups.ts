import { CollectionConfig } from 'payload'

export const UserGroups: CollectionConfig = {
  slug: 'user-groups',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'criteria',
      type: 'json',
      admin: {
        description: 'Dynamic criteria for user selection',
      },
    },
    {
      name: 'estimatedSize',
      type: 'number',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default UserGroups
