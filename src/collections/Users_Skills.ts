import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';

export const Users_Skills: CollectionConfig = {
  slug: 'users_skills',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['skill', 'user', 'currentLevel', 'desiredLevel'],
    // hidden: true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'skills',
    },
    {
      name: 'currentLevel',
      type: 'number',
    },
    {
      name: 'desiredLevel',
      type: 'number',
    },
  ],
  timestamps: true,
};
