import { anyone } from '@/access/anyone';
import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';

const Teams: CollectionConfig = {
  slug: 'teams',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'owner'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'users',
      type: 'join',
      collection: 'teams_users',
      on: 'team',
    },
  ],
};

export default Teams;
