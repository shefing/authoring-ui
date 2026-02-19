import type {GlobalConfig} from 'payload'
import {createBackgroundColorField, createColorField} from '@/components/color-picker/index'
import {createFontFamilyField, createFontSizeField, createFontWeightField} from '@/components/font-picker/index'
import {invalidateSettingsCache} from './settingsCache'

export const Setting: GlobalConfig = {
    slug: 'setting',
    label: '⚙️ Setting',
    hooks: {
        afterChange: [
            () => {
                invalidateSettingsCache()
            },
        ],
    },
    admin: {
        group: 'Settings',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            defaultValue: 'Default Brand Settings',
        },
        {
            type: 'group',
            name: 'brandDefaults',
            label: '🎨 Brand Colors and Typography Defaults',
            fields: [
                {
                    type: 'group',
                    name: 'general',
                    label: '🖼️ Border and Background',
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
                    type: 'group',
                    name: 'title',
                    label: '📝 Title',
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
                        },
                    ]
                },
                {
                    type: 'group',
                    name: 'message',
                    label: '💬 Message',
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
                    label: '⚡ Actions',
                    name: 'actions',
                    fields: [
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
                        },
                    ]
                },
            ],
        },
    ],
}
