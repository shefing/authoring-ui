import {CollectionConfig} from 'payload'

export const DeliveryRules: CollectionConfig = {
  slug: 'delivery-rules',
  enableQueryPresets: true,
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  custom: {
    filterList: [[{ name: 'isEnabled' },'ruleType','targetUserRole']],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'ruleType',
      type: 'select',
      required: true,
      options: [
        { label: 'Fatigue', value: 'fatigue' },
        { label: 'Sequencing', value: 'sequencing' },
        { label: 'VIP', value: 'vip' },
        { label: 'Urgency', value: 'urgency' },
      ],
    },
    {
      name: 'isEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'configuration',
      type: 'json',
      admin: {
        description: 'Rule-specific settings',
      },
    },
    {
      name: 'targetUserRole',
      type: 'select',
      options: [
        { label: 'VIP Users', value: 'vip' },
        { label: 'IT Staff', value: 'it-staff' },
        { label: 'General Users', value: 'general' },
        { label: 'All', value: 'all' },
      ],
    },
    {
      name: 'targetGroup',
      type: 'relationship',
      relationTo: 'user-groups',
      admin: {
        description: 'Optional target user group for this rule',
      },
    },
    {
      name: 'priority',
      type: 'number',
      admin: {
        description: 'Rule priority for conflict resolution',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}

export default DeliveryRules
