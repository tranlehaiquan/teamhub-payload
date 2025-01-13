import type { CollectionConfig, Field, PayloadRequest } from 'payload';
import { authenticated } from '../../access/authenticated';
import { forgotPasswordTemplate } from '../../email-templates/forgotPassword';
import { isAdminRole } from '@/access/isAdminRole';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdminRole,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['email', 'roles'],
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
    {
      name: 'profile',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        allowEdit: false,
      },
      relationTo: 'profiles',
    },
  ],
  timestamps: true,
};
