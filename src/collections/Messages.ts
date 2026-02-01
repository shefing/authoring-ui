import {CollectionConfig, FieldHook} from 'payload'

const populateContentFromTemplate: FieldHook = async ({ data, req, value }) => {
  if (data?.template) {
    try {
      const template = await req.payload.findByID({
        collection: 'templates',
        id: typeof data.template === 'object' ? data.template.id : data.template,
        depth: 0,
      })

      if (template?.body) {
        // console.log('[DEBUG_LOG] Template body structure:', JSON.stringify(template.body, null, 2))
        return template.body
      }
    } catch (err) {
      console.error('Error fetching template for content population:', err)
    }
  }

  return value
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: {
    singular: '💬 Message',
    plural: '💬 Messages',
  },
  enableQueryPresets: true,
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'messageType', 'channel', 'deliveryMode', 'status', 'responseRate'],
    livePreview: {
      url: ({ data }: { data: any }) => {
        return `/preview/message?id=${data.id}`
      },
    },
    preview: (doc) => {
      let url = `/preview/message?id=${doc.id}`
      if (doc._status === 'draft') url += '&draft=1'
      return url
    },
  },
  access: {
    read: () => true,
  },
  custom: {
    filterList: [[{ name: 'scheduledDate' },'messageType', 'deliveryMode','status','priority','deliverySchedule']],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: { width: '40%' },
                },
                {
                  name: 'description',
                  type: 'text',
                  admin: { width: '40%' },
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
                  admin: { width: '20%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'template',
                  type: 'relationship',
                  relationTo: 'templates',
                  admin: { width: '33.33%' },
                },
                {
                  name: 'targetGroup',
                  type: 'relationship',
                  relationTo: 'user-groups',
                  admin: { width: '33.33%' },
                },
                {
                  name: 'channel',
                  type: 'relationship',
                  relationTo: 'channels',
                  admin: { width: '33.33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
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
                  admin: { width: '33.33%' },
                },
                {
                  name: 'messageType',
                  type: 'select',
                  options: [
                    { label: 'Survey', value: 'survey' },
                    { label: 'Confirmation', value: 'confirmation' },
                    { label: 'Notification', value: 'notification' },
                    { label: 'Reminder', value: 'reminder' },
                    { label: 'Self-Service', value: 'self-service' },
                  ],
                  required: true,
                  admin: { width: '33.33%' },
                },
                {
                  name: 'deliverySchedule',
                  type: 'select',
                  options: [
                    { label: 'Send Immediately', value: 'immediate' },
                    { label: 'Scheduled', value: 'scheduled' },
                  ],
                  defaultValue: 'immediate',
                  admin: { width: '33.33%' },
                },
              ],
            },
            {
              name: 'scheduledDate',
              type: 'date',
              admin: {
                condition: (data) => data.deliverySchedule === 'scheduled',
              },
            },
            {
              name: 'content',
              type: 'richText',
              hooks: {
                beforeChange: [populateContentFromTemplate],
              },
              admin: {
                description: 'Overrides the template content if provided.',
              },
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'deliveryRules',
                  type: 'relationship',
                  relationTo: 'delivery-rules',
                  hasMany: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'deliveryMode',
                  type: 'select',
                  options: [
                    { label: 'Intrusive', value: 'intrusive' },
                    { label: 'Non-Intrusive', value: 'non-intrusive' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'responseRate',
                  type: 'number',
                  admin: {
                    description: 'Calculated response rate percentage',
                    width: '50%',
                  },
                },
                {
                  name: 'totalRecipients',
                  type: 'number',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Messages
