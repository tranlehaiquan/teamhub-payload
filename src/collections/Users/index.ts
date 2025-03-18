import type { CollectionConfig } from 'payload';
import { isAdminRole } from '@/access/isAdminRole';
import { authenticated } from '../../access/authenticated';
import { forgotPasswordTemplate, verifyEmailTemplate } from '../../email-templates/templates';
import { getClientSideURL } from '@/utilities/getURL';

const clientURL = getClientSideURL();

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
    // TODO: extends expiry time, handle logic for refresh tokens
    // handle logic expire in front end
    forgotPassword: {
      generateEmailHTML: (args) => {
        const resetPasswordURL = `${clientURL}/reset?token=${args?.token}`;
        const template = forgotPasswordTemplate(args?.user, resetPasswordURL);

        return template;
      },
    },
    verify: {
      generateEmailHTML: (args) => {
        const verifyEmailURL = `${clientURL}/verify?token=${args?.token}`;
        return verifyEmailTemplate(args?.user, verifyEmailURL);
      },
    },
    // second expires 5 hours
    tokenExpiration: 60 * 60 * 5,
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
    {
      name: 'reportTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: "Select the user's manager/supervisor",
      },
    },
  ],
  timestamps: true,
};
