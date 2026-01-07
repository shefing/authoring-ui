// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Templates } from './collections/Templates'
import { Branding } from './collections/Branding'
import { Policies } from './collections/Policies'
import { Variables } from './collections/Variables'
import { Channels } from './collections/Channels'
import { Buttons } from './collections/Buttons'
import { Messages } from './collections/Messages'
import { Divisions } from './collections/Divisions'
import { UserGroups } from './collections/UserGroups'
import { DeliveryRules } from './collections/DeliveryRules'
import { MessageAnalytics } from './collections/MessageAnalytics'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Templates,
    Branding,
    Policies,
    Variables,
    Channels,
    Buttons,
    Messages,
    Divisions,
    UserGroups,
    DeliveryRules,
    MessageAnalytics,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: [
    // storage-adapter-placeholder
  ],
})
