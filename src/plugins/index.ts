import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import { Plugin } from 'payload';
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';

const usingVercelBlobStorage = !!process.env.BLOB_READ_WRITE_TOKEN;

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['categories'],
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ];
                },
              }),
            };
          }
          return field;
        });
      },
    },
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
