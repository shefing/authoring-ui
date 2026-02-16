import type {CollectionConfig} from 'payload'
import {createBackgroundColorField, createColorField} from '@/components/color-picker/index'
import {createFontFamilyField, createFontSizeField, createFontWeightField} from '@/components/font-picker/index'

export const Branding: CollectionConfig = {
    slug: 'branding',
    labels: {
        singular: '🎨 Brand',
        plural: '🎨 Brands',
    },
    trash: true, // Enable trash functionality
    versions: {drafts: true, maxPerDoc: 50},
    enableQueryPresets: true,
    admin: {
        group: 'Content',
        useAsTitle: 'name',
        livePreview: {
            url: ({ data }: { data: any }) => {
                return `/preview/branding?id=${data.id}`
            },
        },
    },
    access: {
        read: () => true,
    },
    custom: {
        filterList: [['isActive', 'scopeType', 'messageType']],
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
                                {
                                    name: 'name',
                                    type: 'text',
                                    required: true,
                                    admin: {
                                        style: {
                                            marginRight: '10px',
                                        },
                                    },
                                },
                                {
                                    name: 'isActive',
                                    type: 'checkbox',
                                    defaultValue: true,
                                },
                            ],
                        },
                        {
                            name: 'logo',
                            type: 'relationship',
                            relationTo: 'media',
                        },
                        {
                            type: 'group',
                            label: 'Brand Colors And Typography',
                            fields: [
                                {
                                    type: 'group',
                                    name: 'general',
                                    label: 'Border and Background',
                                    fields: [
                                        {
                                            type: 'row',
                                            fields: [
                                                createColorField({name: 'borderColor', label: 'Border'}),
                                                createBackgroundColorField({
                                                    name: 'messageBackgroundColor',
                                                    label: 'Message Background'
                                                }),
                                            ],
                                        },
                                    ]
                                },
                                {
                                  type:'group',
                                    name:'title',
                                  label: 'Title',
                                    fields:[
                                        {
                                          type: 'row',
                                          fields:[
                                              createColorField({name: 'textColor', label: 'Text Color'}),
                                              createFontFamilyField({
                                                  name: 'fontFamily',
                                                  label: 'Font Family'
                                              }),
                                              createFontWeightField({
                                                  name: 'fontWeight',
                                                  label: 'Font Weight & Style'
                                              }),
                                              createFontSizeField({name: 'fontSize', label: 'Font Size'}),
                                          ]
                                        },
                                    ]
                                },
                                {
                                    type: 'group',
                                    name: 'message',
                                    label: 'Message',
                                    fields: [
                                        {
                                            type: 'row',
                                            fields: [
                                                createColorField({name: 'textColor', label: 'Text Color'}),
                                                createFontFamilyField({
                                                    name: 'fontFamily',
                                                    label: 'Font Family'
                                                }),
                                                createFontWeightField({
                                                    name: 'fontWeight',
                                                    label: 'Font Weight & Style'
                                                }),
                                                createFontSizeField({name: 'fontSize', label: 'Font Size'}),
                                            ]
                                        }
                                        ]
                                },
                                {
                                    type: 'group',
                                    label: 'Actions',
                                    name: 'actions',
                                    fields:[
                                        {
                                            type: 'row',
                                            fields: [
                                                createBackgroundColorField({
                                                    name: 'primaryBackground',
                                                    label: 'Primary Background'
                                                }),
                                                createColorField({
                                                    name: 'primaryText',
                                                    label: 'Primary Text'
                                                }),
                                                createBackgroundColorField({
                                                    name: 'secondaryBackground',
                                                    label: 'Secondary Background'
                                                }),
                                                createColorField({
                                                    name: 'secondaryText',
                                                    label: 'Secondary Text'
                                                }),
                                            ],
                                        }
                                        ]
                                },
                            ],
                        }
                        ]
                },
                {
                    label: 'Advanced',
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'scope',
                                    type: 'select',
                                    options: [
                                        {label: 'All Messages', value: 'all'},
                                        {label: 'Urgent Messages', value: 'urgent'},
                                        {label: 'Division-specific', value: 'division'},
                                        {label: 'Message-Type specific', value: 'message-type'},
                                    ],
                                    defaultValue: 'all',
                                    admin: {
                                        style: {
                                            marginRight: '10px',
                                        },
                                    },
                                },
                                {
                                    name: 'scopeType',
                                    type: 'select',
                                    options: [
                                        {label: 'Global', value: 'global'},
                                        {label: 'Urgency', value: 'urgency'},
                                        {label: 'Division', value: 'division'},
                                        {label: 'Message-Type', value: 'message-type'},
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
                                    admin: {
                                        condition: (data) => data.scope === 'division' || data.scopeType === 'division',
                                        style: {
                                            marginRight: '10px',
                                        },
                                    },
                                },
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
                                    admin: {
                                        condition: (data) => data.scope === 'message-type' || data.scopeType === 'message-type',
                                    },
                                },
                            ],
                        },

                        {
                            name: 'customCSS',
                            type: 'code',
                            admin: {
                                language: 'css',
                                description: 'Advanced CSS customization',
                            },
                        },
                    ],
                },
            ],
        },
    ],
}

export default Branding
