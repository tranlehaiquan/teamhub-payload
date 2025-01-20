import type { CollectionConfig } from 'payload';

import { authenticated } from '../../access/authenticated';

export const Certificates: CollectionConfig = {
  slug: 'certificates',
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
      label: 'Certificate name',
      required: true,
    },
    {
      name: 'issuingOrganization',
      type: 'text',
      label: 'Issuing organization',
      required: true,
    },
    {
      name: 'deliveryDate',
      type: 'date',
      label: 'Delivery date',
    },
    {
      name: 'expiryDate',
      type: 'date',
      label: 'Expiry date',
    },
    {
      name: 'user',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'users',
    },
    {
      name: 'userSkills',
      type: 'relationship',
      relationTo: 'users_skills',
      hasMany: true,
    },
  ],
  timestamps: true,
};
