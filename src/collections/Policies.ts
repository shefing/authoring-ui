import {CollectionConfig, slugField} from 'payload'

const isType = (expected: string) => ({ siblingData }: { siblingData: any }) => siblingData?.type === expected

export const Policies: CollectionConfig = {
  slug: 'policies',
  labels: {
    singular: '📜 Policy',
    plural: '📜 Policies',
  },
  versions: { drafts: true, maxPerDoc: 50 },
  enableQueryPresets: true,
  admin: {
    group: 'Content',
    useAsTitle: 'name',
  },
  custom: {
    filterList: [
      [{ name: 'type' }],
    ],
  },
  fields: [
      {
          type: "row",
          fields: [
              {name: 'name', type: 'text', required: true},
              {
                  name: 'type',
                  type: 'select',
                  options: [
                      { label: 'Fatigue Prevention', value: 'fatigue' },
                      { label: 'Sequencing Control', value: 'sequencing' },
                      { label: 'VIP Handling', value: 'vip' },
                      { label: 'Quiet Hours', value: 'quietHours' },
                      { label: 'Routing', value: 'routing' },
                      { label: 'DND Exceptions', value: 'dndExceptions' },
                  ],
                  required: true,
              },
              slugField({fieldToUse: 'name'}),
          ]
      },
    // Fatigue policy
    {
      type: 'group',
      name: 'fatigue',
      admin: {
          condition: (data) => data?.type === 'fatigue',
      },
      fields: [
        { name: 'maxSurveysPerWeek', type: 'number', required: true, defaultValue: 2 },
        { name: 'minDaysBetweenSurveys', type: 'number', required: true, defaultValue: 3 },
      ],
    },

    // Sequencing Control policy
    {
      type: 'group',
      name: 'sequencing',
      admin: {
          condition: (data) => data?.type === 'sequencing',
      },
      fields: [
        { name: 'allowParallelExecution', type: 'checkbox', defaultValue: false },
        { name: 'maxConcurrentActions', type: 'number', defaultValue: 1 },
        { name: 'queueNonIntrusiveMessages', type: 'checkbox', defaultValue: true },
      ],
    },

    // VIP Handling policy
    {
      type: 'group',
      name: 'vip',
      admin: {
          condition: (data) => data?.type === 'vip',
      },
      fields: [
        {
            name: 'reminderFrequency',
            type: 'select',
            options: [
                { label: 'More Frequent', value: 'more_frequent' },
                { label: 'Less Frequent', value: 'less_frequent' },
                { label: 'Custom', value: 'custom' },
            ],
            defaultValue: 'less_frequent',
        },
        {
            name: 'customIntervalDays',
            type: 'number',
            admin: {
                condition: (data) => data?.vip?.reminderFrequency === 'custom',
            },
        },
      ],
    },

    // Quiet hours policy
    {
      type: 'group',
      name: 'quietHours',
      admin: {
          condition: (data) => data?.type === 'quietHours',
      },
      fields: [
        { name: 'timezone', type: 'text', required: true, defaultValue: 'UTC' },
        {
          name: 'windows',
          type: 'array',
          fields: [
            { name: 'start', type: 'text', required: true, admin: { description: 'e.g., 22:00' } },
            { name: 'end', type: 'text', required: true, admin: { description: 'e.g., 07:00' } },
            { name: 'days', type: 'text', admin: { description: 'e.g., Mon-Fri' } },
          ],
        },
        { name: 'vipUserIds', type: 'json', admin: { description: 'Optional list of VIP user IDs exempt from quiet hours.' } },
      ],
    },

    // Routing policy
    {
      type: 'group',
      name: 'routing',

        admin: {
            condition: (data) => data?.type === 'routing',
        },
      fields: [
        {
          name: 'preferredChannel',
          type: 'select',
          options: [
            { label: 'Device', value: 'device' },
            { label: 'Teams', value: 'teams' },
            { label: 'Both', value: 'both' },
          ],
          required: true,
          defaultValue: 'device',
        },
        {
          name: 'bothStrategy',
          type: 'select',
          options: [
            { label: 'Parallel', value: 'parallel' },
            { label: 'Fallback to Teams', value: 'fallbackToTeams' },
            { label: 'Fallback to Device', value: 'fallbackToDevice' },
          ],
          admin: {
              condition: (data) => data?.routing?.preferredChannel === 'both',
              description: 'Used when preferredChannel = both'
          },
        },
      ],
    },

    // DND Exceptions policy
    {
      type: 'group',
      name: 'dndExceptions',
      admin: {
          condition: (data) => data?.type === 'dndExceptions',
      },
      fields: [
        { name: 'allowedDuringDndKinds', type: 'json', admin: { description: 'E.g., { "kinds": ["urgent", "security"] }' } },
      ],
    },
  ],
}

export default Policies
