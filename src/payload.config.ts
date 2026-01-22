// storage-adapter-import-placeholder
import {vercelBlobStorage} from '@payloadcms/storage-vercel-blob'
import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {payloadCloudPlugin} from '@payloadcms/payload-cloud'
import {importExportPlugin} from '@payloadcms/plugin-import-export'
import {addAuthorsFields} from '@shefing/authors-info'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import path from 'path'
import {buildConfig, CollectionSlug} from 'payload'
import {fileURLToPath} from 'url'
import CollectionQuickFilterPlugin from '@shefing/quickfilter'
import {openapi, swaggerUI} from 'payload-oapi'
import {CollectionResetPreferencesPlugin} from '@shefing/reset-list-view'
import versionsPlugin from '@shefing/custom-version-view'
import DynamicFieldOverrides from '@shefing/field-type-component-override'

import {Users} from './collections/Users'
import {Media} from './collections/Media'
import {Templates} from './collections/Templates'
import {Branding} from './collections/Branding'
import {Policies} from './collections/Policies'
import {Variables} from './collections/Variables'
import {Channels} from './collections/Channels'
import {Buttons} from './collections/Buttons'
import {Messages} from './collections/Messages'
import {Divisions} from './collections/Divisions'
import {UserGroups} from './collections/UserGroups'
import {DeliveryRules} from './collections/DeliveryRules'
import {MessageAnalytics} from './collections/MessageAnalytics'
import {seed} from './seed'
import {en} from "@payloadcms/translations/languages/en";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  debug: process.env.NODE_ENV === 'development',
    i18n: {
        supportedLanguages: {en},
    },
    admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/graphics/Logo',
      },
      Nav: '@shefing/quickfilter/nav',
      views: {
        dashboard: {
          Component: '@shefing/quickfilter/Dashboard',
          path: '/',
          exact: true,
        },
      },
    },
    meta: {
      title: 'Riverbed',
      openGraph: {
        // highlight-end
        description: 'User communication service',
        siteName: 'Riverbed- user communication',
        title: 'Riverbed',
      },
      titleSuffix: '- Admin',
        description: 'User communication service',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
    },
    timezones: {
      supportedTimezones: ({ defaultTimezones }) => [
        ...defaultTimezones,
        { label: 'Israel Standard Time', value: 'Asia/Jerusalem' },
      ],
      defaultTimezone: 'Asia/Jerusalem',
    },
  },
  collections: [
    Branding,
      Templates,
    Messages,
      Policies,
    Media,
    Channels,
    DeliveryRules,
    Buttons,
    Variables,
    MessageAnalytics,
    Users,
    Divisions,
    UserGroups,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SEED === 'true') {
      await seed(payload)
    }
  },
  plugins: [
      DynamicFieldOverrides({
          overrides: [
              {
                  fieldTypes: ['checkbox'],
                  overrides: {
                      admin: {
                          components: {
                              Cell: '/admincomponents/cell/YesNoCell',
                          },
                      },
                  },
              },
        ]}),
    importExportPlugin({
      collections: [
        Branding.slug,
        Policies.slug,
        Messages.slug,
        Media.slug,
        Templates.slug,
        Channels.slug,
        DeliveryRules.slug,
        Buttons.slug,
        Variables.slug,
        MessageAnalytics.slug,
        Users.slug,
        Divisions.slug,
        UserGroups.slug,
      ].map((item)=>{ return {slug:item as CollectionSlug,export:true,import:true}}) ,
    }),
    payloadCloudPlugin(),
    openapi({ openapiVersion: '3.0', metadata: { title: 'Dev API', version: '0.0.1' } }),
    swaggerUI({}),
    addAuthorsFields({
      excludedCollections: [],
      excludedGlobals: [],
      usernameField: 'email',
    }),
    CollectionQuickFilterPlugin({}),
    CollectionResetPreferencesPlugin({
      // Plugin options here
    }),
    versionsPlugin({}),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true, // Enable for your media collection
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
