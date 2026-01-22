import {CollectionConfig} from 'payload'

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  labels: {
    singular: '🏢 Division',
    plural: '🏢 Divisions',
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
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'parentDivision',
      type: 'relationship',
      relationTo: 'divisions',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default Divisions
