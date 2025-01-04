import type { CollectionConfig } from 'payload';

import { authenticated } from '../../access/authenticated';

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'relatedUsers',
      type: 'join',
      collection: 'users_skills',
      on: 'skill',
    },
  ],
  timestamps: true,
};
