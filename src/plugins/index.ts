import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import type { Plugin } from 'payload';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';

const usingVercelBlobStorage = !!process.env.BLOB_READ_WRITE_TOKEN;

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['categories'],
  }),
  payloadCloudPlugin(),
  vercelBlobStorage({
    enabled: usingVercelBlobStorage,
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
];
