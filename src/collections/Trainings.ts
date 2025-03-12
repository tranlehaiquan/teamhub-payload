import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';

export const Trainings: CollectionConfig = {
  slug: 'Trainings',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'user', 'status'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
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
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Ongoing',
          value: 'ongoing',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Not Started',
          value: 'not-started',
        },
        {
          label: 'On Hold',
          value: 'on-hold',
        },
      ],
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
    },
    {
      name: 'certificate',
      type: 'relationship',
      relationTo: 'certificates',
    },
  ],
  timestamps: true,
};
