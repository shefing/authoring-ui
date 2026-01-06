import { CollectionConfig } from 'payload'

export const Channels: CollectionConfig = {
  slug: 'channels',
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
      name: 'status',
      type: 'select',
      options: [
        { label: 'Configured', value: 'configured' },
        { label: 'Disabled - Not Configured', value: 'disabled' },
      ],
      defaultValue: 'disabled',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'supportedMessageTypes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Survey', value: 'survey' },
        { label: 'Confirmation', value: 'confirmation' },
        { label: 'Notification', value: 'notification' },
        { label: 'Reminder', value: 'reminder' },
        { label: 'Self-Service', value: 'self-service' },
      ],
    },
    {
      name: 'capabilities',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Server-Side Only', value: 'server-side' },
        { label: 'Requires OAuth', value: 'oauth' },
      ],
    },
    {
      name: 'configuration',
      type: 'json',
      admin: {
        description: 'Channel-specific configuration (API keys, endpoints, etc.)',
      },
    },
  ],
}

export default Channels
