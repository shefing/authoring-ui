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
                                    name: 'isActive',
                                    type: 'checkbox',
                                    defaultValue: true,
                                },
                            ],
                        },
                        {
                            name: 'description',
                            type: 'textarea',
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
                                {
                                    name: 'branding',
                                    type: 'relationship',
                                    relationTo: 'branding',
                                },
                            ],
                        },
                        {
                            name: 'body',
                            type: 'richText',
                        },
                    ],
                },
                {
                    label: 'Advanced',
                    fields: [
                        {
                            type: 'collapsible',
                            label: 'Advanced Content Configuration',
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            name: 'showHeader',
                                            type: 'checkbox',
                                            defaultValue: true,
                                            admin: {width: '33%'},
                                        },
                                        {
                                            name: 'showDescription',
                                            type: 'checkbox',
                                            defaultValue: true,
                                            admin: {width: '33%'},
                                        },
                                        {
                                            name: 'showBody',
                                            type: 'checkbox',
                                            defaultValue: true,
                                            admin: {width: '33%'},
                                        },
                                    ],
                                },
                                {
                                    name: 'title',
                                    type: 'text',
                                    admin: {
                                        condition: (data) => data.showHeader,
                                    },
                                },
                                {
                                    name: 'messageDescription',
                                    type: 'textarea',
                                    admin: {
                                        condition: (data) => data.showDescription,
                                    },
                                },
                            ],
                        },
                        {
                            type: 'collapsible',
                            label: 'Actions & Buttons',
                            fields: [
                                {
                                    name: 'buttons',
                                    type: 'array',
                                    minRows: 0,
                                    maxRows: 3,
                                    fields: [
                                        {
                                            type: 'row',
                                            fields: [
                                                {
                                                    name: 'button',
                                                    type: 'relationship',
                                                    relationTo: 'buttons',
                                                    required: true,
                                                    admin: {width: '50%'},
                                                },
                                                {
                                                    name: 'type',
                                                    type: 'select',
                                                    options: [
                                                        {label: 'Primary', value: 'primary'},
                                                        {label: 'Secondary', value: 'secondary'},
                                                        {label: 'Tertiary', value: 'tertiary'},
                                                    ],
                                                    defaultValue: 'primary',
                                                    admin: {width: '50%'},
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'division',
                                    type: 'relationship',
                                    relationTo: 'divisions',
                                },
                            ],
                        },
                        {
                            name: 'channels',
                            type: 'relationship',
                            relationTo: 'channels',
                            hasMany: true,
                        },
                    ],
                },
            ],
        },
    ],
}

export default Templates
