import { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  HeadingFeature,
  LinkFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'messageType', 'deliveryMode'],
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
      name: 'messageType',
      type: 'select',
      options: [
        { label: 'Notification', value: 'notification' },
      ],
      defaultValue: 'notification',
      required: true,
      admin: {
        readOnly: true,
      }
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'templates',
    },
    {
      name: 'targetGroup',
      type: 'relationship',
      relationTo: 'user-groups',
      required: true,
    },
    {
      name: 'expiredIn',
      type: 'date',
      admin: {
        description: 'Expiration date for the message',
      }
    },
    {
      name: 'deliveryRules',
      type: 'relationship',
      relationTo: 'delivery-rules',
      hasMany: true,
    },
    {
      name: 'deliveryMode',
      type: 'select',
      options: [
        { label: 'Intrusive', value: 'intrusive' },
        { label: 'Non-Intrusive', value: 'non-intrusive' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      defaultValue: 'normal',
    },
    {
      name: 'deliverySchedule',
      type: 'select',
      options: [
        { label: 'Send Immediately', value: 'immediate' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
      defaultValue: 'immediate',
    },
    {
      name: 'scheduledDate',
      type: 'date',
      admin: {
        condition: (data) => data.deliverySchedule === 'scheduled',
      },
    },
    {
      name: 'responseRate',
      type: 'number',
      admin: {
        description: 'Calculated response rate percentage',
      },
    },
    {
      name: 'totalRecipients',
      type: 'number',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: () => [
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          LinkFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          FixedToolbarFeature(),
        ],
      }),
    },
  ],
}

export default Messages
