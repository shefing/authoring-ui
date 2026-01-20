import type {CollectionConfig} from 'payload'
import {slugField} from 'payload'
import {createBackgroundColorField, createColorField} from '@/components/color-picker/index'
import {createFontFamilyField, createFontSizeField, createFontWeightField} from '@/components/font-picker/index'

export const Branding: CollectionConfig = {
    slug: 'branding',
    versions: {drafts: true, maxPerDoc: 50},
    enableQueryPresets: true,
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    custom: {
        filterList: [['isActive', 'scopeType', 'messageType']],
    },
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
                slugField({fieldToUse: 'name'}),
            ],
        },
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Design',
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
                            name: 'colors',
                            type: 'group',
                            label: 'Brand Colors',
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        createColorField({name: 'primaryColor', label: 'Primary Color'}),
                                        createColorField({name: 'secondaryColor', label: 'Secondary Color'}),
                                        createBackgroundColorField({
                                            name: 'backgroundColor',
                                            label: 'Background Color'
                                        }),
                                        createColorField({name: 'textColor', label: 'Text Color'}),
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'fonts',
                            type: 'group',
                            label: 'Typography',
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        createFontFamilyField({name: 'fontFamily', label: 'Font Family'}),
                                        createFontSizeField({name: 'fontSize', label: 'Font Size'}),
                                        createFontWeightField({name: 'fontWeight', label: 'Font Weight & Style'}),
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Assets & CSS',
                    fields: [
                        {
                            name: 'logos',
                            type: 'array',
                            label: 'Theme Logos',
                            fields: [
                                {
                                    name: 'logo',
                                    type: 'relationship',
                                    relationTo: 'media',
                                    required: true,
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
