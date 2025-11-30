import type { CollectionConfig } from 'payload'

export const BrandingPackages: CollectionConfig = {
  slug: 'branding-packages',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, required: true },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'assets',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'themeTokens',
      type: 'json',
      admin: {
        description:
          'Design tokens exported from your theme generator (colors, spacing, radii, typography, semantic states, light/dark variants).',
      },
    },
    {
      name: 'cssAllowlist',
      type: 'json',
      admin: { description: 'Optional allowlist of CSS tokens/styles permitted for branding.' },
    },
    { name: 'signature', type: 'text' },
  ],
}

export default BrandingPackages
