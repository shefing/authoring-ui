// src/seed.ts - Seed data for Broadcast Capability Development

import { Payload } from 'payload';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const seed = async (payload: Payload): Promise<void> => {
  // 1. Media (for Branding Logo)
  const logoPath = path.resolve(dirname, '../media/image.png');
  let mediaId;

  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: 'Riverbed Logo',
      },
      file: {
        data: logoBuffer,
        name: 'logo.png',
        mimetype: 'image/png',
        size: logoBuffer.length,
      },
    });
    mediaId = media.id;
  } else {
    // Fallback if image doesn't exist - though we saw it in ls
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: 'Riverbed Logo Placeholder',
      },
    });
    mediaId = media.id;
  }

  // 2. Branding (Simplified to one theme)
  const branding = await payload.create({
    collection: 'branding',
    data: {
      name: 'Default Theme',
      slug: 'default-theme',
      primaryColor: '#581c87', // Purple
      secondaryColor: '#c084fc',
      logo: mediaId,
      isActive: true,
    },
    draft: false,
  });

  // 3. User Groups
  const userGroups = await Promise.all([
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'All Employees',
        description: 'All company employees',
        estimatedSize: 2450,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'user-groups',
      data: {
        name: 'Engineering Department',
        description: 'Engineering team members',
        estimatedSize: 87,
        isActive: true,
      },
    }),
  ]);

  // 4. Templates (Simplified)
  const templates = await Promise.all([
    payload.create({
      collection: 'templates',
      data: {
        name: 'Success Notification',
        slug: 'success-notification',
        description: 'Generic success notification template',
        messageType: 'notification',
        branding: branding.id,
        isActive: true,
        body: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Your operation was successful!',
                    type: 'text',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
      draft: false,
    }),
    payload.create({
      collection: 'templates',
      data: {
        name: 'System Alert',
        slug: 'system-alert',
        description: 'Standard system alert notification',
        messageType: 'notification',
        branding: branding.id,
        isActive: true,
        body: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'A system alert has been triggered.',
                    type: 'text',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
      draft: false,
    }),
  ]);

  // 5. Messages
  await Promise.all([
    payload.create({
      collection: 'messages',
      data: {
        name: 'Welcome Message',
        description: 'Initial welcome to the platform',
        messageType: 'notification',
        template: templates[0].id,
        targetGroup: userGroups[0].id,
        deliveryMode: 'non-intrusive',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Welcome to our new communication platform!',
                    type: 'text',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
    }),
  ]);

  console.log('✅ Seed data updated successfully!');
};
