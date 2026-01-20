import {CollectionConfig} from 'payload'

export const MessageAnalytics: CollectionConfig = {
  slug: 'message-analytics',
  enableQueryPresets: true,
  admin: {
    useAsTitle: 'message',
  },
  access: {
    read: () => true,
  },
  custom: {
    filterList: [[{ name: 'deliveryDate' }]],
  },
  fields: [
    {
      name: 'message',
      type: 'relationship',
      relationTo: 'messages',
      required: true,
    },
    {
      name: 'totalSent',
      type: 'number',
    },
    {
      name: 'totalViewed',
      type: 'number',
    },
    {
      name: 'totalResponded',
      type: 'number',
    },
    {
      name: 'responseRate',
      type: 'number',
      admin: {
        description: 'Calculated response rate',
      },
    },
    {
      name: 'deliveryDate',
      type: 'date',
    },
    {
      name: 'channelBreakdown',
      type: 'json',
      admin: {
        description: 'Stats per channel',
      },
    },
    {
      name: 'userInteractions',
      type: 'array',
      fields: [
        {
          name: 'userId',
          type: 'text',
        },
        {
          name: 'action',
          type: 'text',
        },
        {
          name: 'timestamp',
          type: 'date',
        },
      ],
    },
  ],
}

export default MessageAnalytics
