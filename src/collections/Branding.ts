import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { createColorField } from '@/components/color-picker/index'

export const Branding: CollectionConfig = {
  slug: 'branding',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        slugField({ fieldToUse: 'name' }),
      ],
    },
    {
      type: 'row',
      fields: [
        createColorField({ name: 'primaryColor', label: 'Primary Color' }),
        createColorField({ name: 'secondaryColor', label: 'Secondary Color' }),
      ],
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default Branding
