import {CollectionConfig} from 'payload'

export const Channels: CollectionConfig = {
  slug: 'channels',
  enableQueryPresets: true,
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  custom: {
    filterList: [[{ name: 'isEnabled' }, { name: 'isConfigured' }, { name: 'requiresAuth' },'supportedMessageTypes','capabilities']],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'channelId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'isEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'isConfigured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'capabilities',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Server-Side Only', value: 'server-side' },
        { label: 'Requires OAuth', value: 'oauth' },
        { label: 'Client-Side Support', value: 'client-side' },
      ],
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
      name: 'configuration',
      type: 'json',
      admin: {
        description: 'Channel-specific configuration (API keys, endpoints, etc.)',
      },
    },
    {
      name: 'requiresAuth',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'authProvider',
      type: 'text',
    },
  ],
}

export default Channels
