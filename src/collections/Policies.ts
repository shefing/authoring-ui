import {CollectionConfig, slugField} from 'payload'

const isType = (expected: string) => ({ siblingData }: { siblingData: any }) => siblingData?.type === expected

export const Policies: CollectionConfig = {
  slug: 'policies',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'name',
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
                      { label: 'Fatigue', value: 'fatigue' },
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
          condition: (data) => data?.type == 'fatigue',
      },
      fields: [
        { name: 'maxPerWindow', type: 'number', required: true, defaultValue: 2 },
        { name: 'windowHours', type: 'number', required: true, defaultValue: 24 },
      ],
    },

    // Quiet hours policy
    {
      type: 'group',
      name: 'quietHours',
      admin: {
          condition: (data) => data?.type == 'quietHours',
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
            condition: (data) => data?.type == 'routing',
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
              condition: (data) => data?.routing?.preferredChannel == 'both',
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
          condition: (data) => data?.type == 'dndExceptions',
      },
      fields: [
        { name: 'allowedDuringDndKinds', type: 'json', admin: { description: 'E.g., { "kinds": ["urgent", "security"] }' } },
      ],
    },
  ],
}

export default Policies
