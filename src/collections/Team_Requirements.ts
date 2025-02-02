import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';

export const Team_Requirements: CollectionConfig = {
  slug: 'team_requirements',
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
    {
      name: 'desiredLevel',
      type: 'number',
    },
    {
      name: 'desiredMembers',
      type: 'number',
    },
  ],
  timestamps: true,
};
