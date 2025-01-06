// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';

import sharp from 'sharp'; // sharp-import
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { Footer } from './Footer/config';
import { Header } from './Header/config';
import { plugins } from './plugins';
import { defaultLexical } from '@/fields/defaultLexical';
import { getServerSideURL } from './utilities/getURL';
import { Profiles } from './collections/Profiles';
import { Certificates } from './collections/Certificates';
import { Skills } from './collections/Skills';
import { Users_Skills } from './collections/Users_Skills';
import Teams from './collections/Teams';
import { Teams_Users } from './collections/Teams_Users';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'teamhub@example.com',
    defaultFromName: 'TeamHub',
    transportOptions: {
      host: 'localhost',
      port: 1025,
    },
  }),
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    beforeSchemaInit: [
      ({ schema, adapter }) => {
        adapter.rawTables.teams_users.indexes!.userIdTeamId = {
          name: 'userIdTeamIdUnique',
          unique: true,
          on: ['user', 'team'],
        };

        return schema;
      },
    ],
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Profiles,
    Certificates,
    Skills,
    Users_Skills,
    Teams,
    Teams_Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    disable: true,
    disablePlaygroundInProduction: true,
  },
});
