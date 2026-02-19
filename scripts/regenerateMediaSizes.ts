/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { getPayload } from 'payload'
// import fetch from 'node-fetch'; // Ensure node-fetch is installed
import * as dotenv from 'dotenv'
dotenv.config() // Load environment variables from .env
import config from "@/payload.config"
const payload = await getPayload({ config: config })

// eslint-disable-next-line
import 'dotenv/config'

const regenerateMediaSizes = async (): Promise<void> => {
  const media = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 500,
  })
  //console.log('^^^^^^^^^^^^^^^^^^^^media', media)
  if (media != null && media.totalDocs > 0) {
    payload.logger.info(`Found ${media.totalDocs} media files.`)
    for (let index = 0; index < media.docs.length; index++) {
      const mediaDoc = media.docs[index]
      //console.log('^^^^^^^^^^^^^^^^^^^^mediaDoc', mediaDoc)
      const req = {
        headers: new Map(), // Or use any object literal
      } as PayloadRequestWithData
      req.headers.set('origin', process.env.PAYLOAD_URL)
      try {
        await payload.update({
          collection: 'media',
          id: mediaDoc.id,
          data: mediaDoc,
          overwriteExistingFiles: true,
          req,
        })

        payload.logger.info(
          `Media ${mediaDoc.id} (${mediaDoc.filename}) successfully and new copy created.`,
        )
      } catch (err) {
        payload.logger.error(`Media ${mediaDoc.id} (${mediaDoc.filename}) failed to regenerate`)
        console.error(err)
      }
    }
  } else {
    payload.logger.info('No media files found.')
  }

  payload.logger.info('Done!')
  process.exit(0)
}

void regenerateMediaSizes()
