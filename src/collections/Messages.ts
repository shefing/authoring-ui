import { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'channel', 'mode', 'status', 'responseRate'],
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
      name: 'type',
      type: 'select',
      options: [
        { label: 'Survey', value: 'survey' },
        { label: 'Confirmation', value: 'confirmation' },
        { label: 'Notification', value: 'notification' },
        { label: 'Reminder', value: 'reminder' },
        { label: 'Self-Service', value: 'self-service' },
      ],
      required: true,
    },
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'channels',
      required: true,
    },
    {
      name: 'mode',
      type: 'select',
      options: [
        { label: 'Intrusive', value: 'intrusive' },
        { label: 'Non-Intrusive', value: 'non-intrusive' },
      ],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      defaultValue: 'medium',
      required: true,
    },
    {
      name: 'responseRate',
      type: 'group',
      fields: [
        {
          name: 'percentage',
          type: 'number',
          admin: {
            description: 'Response rate percentage',
          },
        },
        {
          name: 'count',
          type: 'number',
          admin: {
            description: 'Number of responses',
          },
        },
        {
          name: 'total',
          type: 'number',
          admin: {
            description: 'Total targeted users',
          },
        },
      ],
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'templates',
      required: true,
    },
  ],
}

export default Messages
