import type { CollectionConfig, Field } from 'payload';
import { authenticated } from '../../access/authenticated';

const ProfileField: Field = {
  name: 'profile',
  type: 'join',
  collection: 'profiles',
  on: 'users',
};

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    ProfileField,
    {
      name: 'relatedSkills',
      type: 'join',
      collection: 'users_skills',
      on: 'user',
    },
    {
      name: 'certificates',
      type: 'join',
      collection: 'certificates',
      on: 'user',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
  timestamps: true,
};
