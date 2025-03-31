// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import sharp from 'sharp'; // sharp-import
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { plugins } from './plugins';
import { defaultLexical } from '@/fields/defaultLexical';
import { getServerSideURL } from './utilities/getURL';
import { Profiles } from './collections/Profiles';
import { Certificates } from './collections/Certificates';
import { Skills } from './collections/Skills';
import { Users_Skills } from './collections/Users_Skills';
import Teams from './collections/Teams';
import { Teams_Users } from './collections/Teams_Users';
import { nodemailerAdapter, NodemailerAdapterArgs } from '@payloadcms/email-nodemailer';
import { Team_Skills } from './collections/Team_Skills';
import { Team_Requirements } from './collections/Team_Requirements';
import { Levels } from './globalConfigs/Levels/levels';
import { JobTitles } from './globalConfigs/JobTitles/jobTitles';
import { Trainings } from './collections/Trainings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const getEmailConfig = (): NodemailerAdapterArgs | undefined => {
  const defaultFromAddress = process.env.MAIL_FROM_ADDRESS;
  const defaultFromName = process.env.MAIL_FROM_NAME;
  const mailHost = process.env.MAIL_HOST;
  const mailPort = process.env.MAIL_PORT;

  if (!defaultFromAddress || !defaultFromName || !mailHost || !mailPort) {
    return;
  }

  const transportOptions: any = {
    host: mailHost,
    port: mailPort,
  };

  if (process.env.MAIL_USER && process.env.MAIL_PASSWORD) {
    transportOptions.auth = {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    };
  }

  const config: NodemailerAdapterArgs = {
    defaultFromAddress,
    defaultFromName,
    transportOptions,
  };

  return config;
};

export default buildConfig({
  email: nodemailerAdapter(getEmailConfig()),
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    components: {
      beforeDashboard: ['@/components/BeforeDashboard'],
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
    Media,
    Categories,
    Users,
    Profiles,
    Certificates,
    Skills,
    Users_Skills,
    Teams,
    Teams_Users,
    Team_Skills,
    Team_Requirements,
    Trainings,
  ],
  cors: [getServerSideURL()].filter(Boolean),
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
  globals: [Levels, JobTitles],
});
