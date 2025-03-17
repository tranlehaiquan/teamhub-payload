import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';
import { trainingStatusOptions } from './constants';

export const Trainings: CollectionConfig = {
  slug: 'trainings',
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
      validate: (value) => {
        if (value) {
          try {
            new URL(value);
            return true;
          } catch (e) {
            return 'Please enter a valid URL';
          }
        }
        return true;
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'user',
      type: 'relationship',
      required: true,
      admin: {
        position: 'sidebar',
      },
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'not-started',
      options: trainingStatusOptions,
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
      validate: (value, { siblingData }: { siblingData: { startDate?: string } }) => {
        if (value && siblingData.startDate) {
          const endDate = new Date(value);
          const startDate = new Date(siblingData.startDate);
          if (endDate < startDate) {
            return 'End date must be after the start date';
          }
        }
        return true;
      },
    },
    {
      name: 'certificate',
      type: 'relationship',
      relationTo: 'certificates',
      admin: {
        condition: (data) => data.status === 'completed',
      },
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
