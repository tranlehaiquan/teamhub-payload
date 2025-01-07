import type { CollectionConfig, Field, PayloadRequest } from 'payload';
import { authenticated } from '../../access/authenticated';
import { anyone } from '@/access/anyone';
import { forgotPasswordTemplate } from '../../email-templates/forgotPassword';

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
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['email'],
    useAsTitle: 'email',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        const resetPasswordURL = `http://localhost:3000/reset?token=${args?.token}`;
        const template = forgotPasswordTemplate(args?.user, resetPasswordURL);

        return template;
      },
    },
  },
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
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
  timestamps: true,
};
