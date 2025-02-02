import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';

export const Team_Skills: CollectionConfig = {
  slug: 'team_skills',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['team', 'skill'],
  },
  fields: [
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'skills',
    },
  ],
  timestamps: true,
};
