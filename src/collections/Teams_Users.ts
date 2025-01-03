import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';

export const Teams_Users: CollectionConfig = {
  slug: 'teams_users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['team', 'user'],
    // hidden: true,
  },
  fields: [
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
  timestamps: true,
};
