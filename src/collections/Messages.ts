import {CollectionConfig, FieldHook} from 'payload'
import {Variable} from '@/payload-types'

const collectNodes = (node: any, out: any[]) => {
  if (!node) return
  if (Array.isArray(node)) {
    node.forEach((n) => collectNodes(n, out))
    return
  }
  if (typeof node === 'object') {
    out.push(node)
    for (const v of Object.values(node)) collectNodes(v, out)
  }
}

type RenderDataItem = {
  type: 'variable' | 'button'
  label: string
  value: string
  key?: string
}

type VariableRef = {
  id: string
  key?: string
  label?: string
}

const extractVariableRefsFromRichText = (content: any): VariableRef[] => {
  if (!content) return []
  const nodes: any[] = []
  collectNodes(content, nodes)
  const refs = new Map<string, VariableRef>()

  for (const n of nodes) {
    if (n && typeof n === 'object' && (n.blockType === 'var' || n.slug === 'var')) {
      const fields = n.fields || n
      const rel = fields?.variable
      let id: string | undefined
      let key: string | undefined
      let label: string | undefined

      if (typeof rel === 'string' || typeof rel === 'number') {
        id = String(rel)
      } else if (rel && typeof rel === 'object') {
        if ('id' in rel && rel.id) {
          id = String(rel.id)
        } else if ('value' in rel && rel.value) {
          id = typeof rel.value === 'object' && rel.value ? String(rel.value.id) : String(rel.value)
        }
        const candidate = typeof rel.value === 'object' && rel.value ? rel.value : rel
        key = candidate?.key || candidate?.name
        label = candidate?.label
      }

      const refId = id || key
      if (refId) {
        const existing = refs.get(refId)
        refs.set(refId, {
          id: id || existing?.id || refId,
          key: key || existing?.key,
          label: label || existing?.label,
        })
      }
    }
  }

  return Array.from(refs.values())
}

const resolveVariableDefs = async (refs: VariableRef[], req: any) => {
  const resolved = await Promise.all(
    refs.map(async (ref) => {
      let variable: Variable | null = null
      if (ref.id) {
        try {
          variable = await req.payload.findByID({
            collection: 'variables',
            id: ref.id,
            depth: 0,
          })
        } catch (err) {
          console.error('Error fetching variable definition:', err)
        }
      }

      const key = ref.key || variable?.key || ref.id
      const label = ref.label || variable?.label || key || 'Variable'
      return { key, label }
    }),
  )

  const unique = new Map<string, { key: string; label: string }>()
  for (const item of resolved) {
    if (item.key && !unique.has(item.key)) unique.set(item.key, item)
  }

  return Array.from(unique.values())
}

const syncRenderData: FieldHook = async ({ data, req, value }) => {
  const existingItems: RenderDataItem[] = Array.isArray(value) ? value.filter(Boolean) : []
  const existingVars = new Map<string, RenderDataItem>()
  const existingButtons = new Map<string, RenderDataItem>()

  for (const item of existingItems) {
    if (item?.type === 'variable') {
      const key = item.key || item.label
      if (key) existingVars.set(key, item)
    }
    if (item?.type === 'button' && item.label) {
      existingButtons.set(item.label, item)
    }
  }

  let titleSource: any = null
  let contentSource: any = null
  let template: any = null

  if (data?.template) {
    try {
      template = await req.payload.findByID({
        collection: 'templates',
        id: typeof data.template === 'object' ? data.template.id : data.template,
        depth: 1,
      })
    } catch (err) {
      console.error('Error fetching template for render data sync:', err)
    }
  }

  if (data?.templateType === 'custom') {
    titleSource = data.title
    contentSource = data.content
  } else if (template) {
    titleSource = template.title
    contentSource = template.body
  }

  const titleVars = extractVariableRefsFromRichText(titleSource)
  const contentVars = extractVariableRefsFromRichText(contentSource)
  const variableDefs = await resolveVariableDefs([...titleVars, ...contentVars], req)

  const variableItems: RenderDataItem[] = variableDefs.map((def) => {
    const existing = existingVars.get(def.key)
    return {
      type: 'variable',
      key: def.key,
      label: def.label,
      value: existing?.value || '',
    }
  })

  const templateButtons = Array.isArray(template?.buttons) ? template.buttons : []
  const buttonItems: RenderDataItem[] = templateButtons.map((buttonEntry: any) => {
    const buttonDoc = buttonEntry?.button && typeof buttonEntry.button === 'object' ? buttonEntry.button : null
    const label = buttonEntry?.label || buttonDoc?.label || buttonDoc?.name || 'Button'
    const existing = existingButtons.get(label)
    return {
      type: 'button',
      label,
      value: existing?.value || label,
    }
  })

  if (variableItems.length === 0 && buttonItems.length === 0) return existingItems

  return [...variableItems, ...buttonItems]
}

const populateContentFromTemplate: FieldHook = async ({ data, req, value }) => {
  if (data?.templateType === 'custom') return value
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
  trash: true, // Enable trash functionality
  enableQueryPresets: true,
  versions: {drafts: {autosave: true}, maxPerDoc: 50,    },
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
  hooks: {
    beforeValidate: [
      async ({ data, req, originalDoc }: any) => {
        const existing =
          Array.isArray(data?.renderData)
            ? data.renderData
            : (Array.isArray(originalDoc?.renderData) ? originalDoc.renderData : []);
        const next = await (syncRenderData as any)({ data, req, value: existing });
        data.renderData = next;
        return data;
      },
    ],
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
                  name: 'template',
                  type: 'relationship',
                  relationTo: 'templates',
                  admin: { width: '40.33%', allowCreate: false ,allowEdit: false},
                },
                {
                  name: 'targetGroup',
                  type: 'relationship',
                  relationTo: 'user-groups',
                  admin: { width: '36.33%' , allowCreate: false , allowEdit: false},
                },
                {
                  name: 'status',
                  type: 'select',
                  options: [
                    { label: 'Draft', value: 'Draft' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Triggered', value: 'Triggered' },
                    { label: 'Rendered', value: 'Rendered' },
                    { label: 'Acknowledged', value: 'Acknowledged' },
                    { label: 'Expired', value: 'Expired' },
                  ],
                  defaultValue: 'Draft',
                  admin: { width: '23.33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'templateType',
                  virtual: 'template.templateType',
                  type: 'select',
                  options: [
                    { label: 'Pre-defined', value: 'pre-defined' },
                    { label: 'Custom', value: 'custom' },
                  ],
                  defaultValue: 'pre-defined',
                  admin: { width: '20%' ,readOnly: true },
                },
                {
                  name: 'messageType',
                  virtual: 'template.messageType',
                  type: 'select',
                  options: [
                    { label: 'Survey', value: 'survey' },
                    { label: 'Confirmation', value: 'confirmation' },
                    { label: 'Notification', value: 'notification' },
                    { label: 'Reminder', value: 'reminder' },
                    { label: 'Self-Service', value: 'self-service' },
                  ],
                  required: true,
                  admin: { width: '20%',readOnly: true },
                },
                {
                  name: 'channels',
                  type: 'relationship',
                  hasMany: true,
                  relationTo: 'channels',
                  virtual :'template.channels',
                  admin: { width: '49%' ,readOnly: true ,allowCreate: false , allowEdit: false},
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'deliverySchedule',
                  type: 'select',
                  options: [
                    { label: 'Send Immediately', value: 'immediate' },
                    { label: 'Scheduled', value: 'scheduled' },
                  ],
                  defaultValue: 'immediate',
                  admin: { width: '23.33%' },
                },
                {
                  name: 'scheduledDate',
                  type: 'date',
                  admin: {
                    condition: (data) => data.deliverySchedule === 'scheduled',
                    width: '220px',
                    date: {
                      timeFormat: 'HH:mm',
                      displayFormat: 'HH:mm dd/MM/yyyy',
                      pickerAppearance: 'dayAndTime',
                      timeIntervals: 15,
                    },
                  },
                },
              ],
            },
            {
              name: 'title',
              type: 'richText',
              admin: {
                condition: (data) => data?.templateType === 'custom',
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
                condition: (data) => data?.templateType === 'custom',
              },
            },
            {
              name: 'renderData',
              type: 'json',
              hooks: {
                beforeChange: [syncRenderData],
              },
              admin: {
                description: 'Variables and button text overrides.',
                components: {
                  Field: '/admincomponents/MessageRenderDataField',
                },
              },
            },
            {
              name: 'isHidden',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Visibility flag — hidden messages are not shown to end users',
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
                  name: 'name',
                  type: 'text',
                  required: true,
                  defaultValue: 'New Message',
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
