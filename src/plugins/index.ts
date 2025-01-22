import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { Plugin } from 'payload';
import { revalidateRedirects } from '@/hooks/revalidateRedirects';
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

import { Page, Post } from '@/payload-types';
import { getServerSideURL } from '@/utilities/getURL';

import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template';
};

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

const usingVercelBlobStorage = !!process.env.BLOB_READ_WRITE_TOKEN;

export const plugins: Plugin[] = [
  nestedDocsPlugin({
    collections: ['categories'],
  }),
  seoPlugin({
    generateTitle,
    generateURL,
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
