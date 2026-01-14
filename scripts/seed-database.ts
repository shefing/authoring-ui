import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seed } from '../src/seed'
import * as dotenv from 'dotenv'

dotenv.config()

const run = async () => {
  const payload = await getPayload({ config })
  
  console.log('🌱 Starting seed process...')
  try {
    await seed(payload)
    console.log('✅ Seed completed successfully!')
  } catch (error: any) {
    if (error.data && error.data.errors) {
      console.error('❌ Seed failed with validation errors:', JSON.stringify(error.data.errors, null, 2))
    } else {
      console.error('❌ Seed failed:', error)
    }
    process.exit(1)
  }
  process.exit(0)
}

run()
