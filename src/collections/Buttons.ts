import {CollectionConfig} from 'payload'

export const Buttons: CollectionConfig = {
  slug: 'buttons',
  labels: {
    singular: '🔘 Button',
    plural: '🔘 Buttons',
  },
  enableQueryPresets: true,
  admin: {
    group: 'Configuration',
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
      name: 'label',
      type: 'text',
    },
    {
      name: 'icon',
      type: 'text',
    },
    {
      name: 'otherAttributes',
      type: 'json',
    },
  ],
}

export default Buttons
