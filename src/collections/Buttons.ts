import {CollectionConfig} from 'payload'

export const Buttons: CollectionConfig = {
  slug: 'buttons',
  enableQueryPresets: true,
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
