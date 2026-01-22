import {CollectionConfig} from 'payload'

export const UserGroups: CollectionConfig = {
  slug: 'user-groups',
  labels: {
    singular: '👨‍👩‍👧‍👦 User Group',
    plural: '👨‍👩‍👧‍👦 User Groups',
  },
  enableQueryPresets: true,
  admin: {
    group: 'Organization',
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  custom: {
    filterList: [[{ name: 'isActive' }]],
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
