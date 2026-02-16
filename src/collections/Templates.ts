import {CollectionConfig} from 'payload'
// import { VariableInlineField } from '@/components/TextToDisplayInVars'

export const Templates: CollectionConfig = {
    slug: 'templates',
    labels: {
        singular: '📑 Template',
        plural: '📑 Templates',
    },
    enableQueryPresets: true,
    versions: {drafts: true, maxPerDoc: 50},
    access: {
        // Allow read access for preview UI (published/draft). In production, tighten to published-only.
        read: () => true,
    },
    custom: {
        filterList: [['isActive', 'messageType', 'templateType']],
    },
    admin: {
        group: 'Content',
        livePreview: {
            url: ({data}: { data: any }) => {
                return `/preview/template?id=${data.id}`
            },
        },
        useAsTitle: 'name',
        // Opens your portal preview; replace path if needed
        preview: (doc) => {
            // Point to the co-located Operator UI root with query params.
            // We avoid non-existent /operator/preview/template route and undefined version.
            let url = `/preview/template?id=${doc.id}`
            if (doc._status === 'draft') url += '&draft=1'
            return url
        },
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Basic',
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {name: 'name', type: 'text', required: true},
                                {
                                    name: 'branding',
                                    type: 'relationship',
                                    relationTo: 'branding',
                                },
                                {
                                    name: 'isActive',
                                    type: 'checkbox',
                                    defaultValue: true,
                                },
                            ],
                        },
                        {
                          type: 'row',
                            fields: [
                                {
                                    name: 'messageType',
                                    type: 'select',
                                    options: [
                                        {label: 'Survey', value: 'survey'},
                                        {label: 'Confirmation', value: 'confirmation'},
                                        {label: 'Notification', value: 'notification'},
                                        {label: 'Reminder', value: 'reminder'},
                                        {label: 'Self-Service', value: 'self-service'},
                                    ],
                                    required: true,
                                },
                                {
                                    name: 'channel',
                                    type: 'relationship',
                                    hasMany: true,
                                    relationTo: 'channels',
                                    admin: { width: '70%' },
                                },
                            ]
                        },
                        {
                            name: 'title',
                            type: 'richText',
                        },
                        {
                            name: 'body',
                            type: 'richText',
                        },
                    ],
                },
                {label: 'Advanced', fields: [
                        {
                            name: 'description',
                            type: 'textarea',
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'priority',
                                    type: 'select',
                                    options: [
                                        {label: 'Normal', value: 'normal'},
                                        {label: 'High', value: 'high'},
                                        {label: 'Urgent', value: 'urgent'},
                                    ],
                                    defaultValue: 'normal',
                                },
                                {
                                    name: 'templateType',
                                    type: 'select',
                                    options: [
                                        {label: 'Pre-defined', value: 'pre-defined'},
                                        {label: 'Custom', value: 'custom'},
                                    ],
                                    defaultValue: 'custom',
                                },
                                {
                                    name: 'category',
                                    type: 'select',
                                    options: [
                                        {label: 'Security', value: 'security'},
                                        {label: 'HR', value: 'hr'},
                                        {label: 'IT', value: 'it'},
                                        {label: 'General', value: 'general'},
                                    ],
                                    defaultValue: 'general',
                                },

                            ],
                        },

                    ]},
            ],
        },
    ],
}

export default Templates
