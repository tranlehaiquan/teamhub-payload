import { GlobalConfig } from 'payload';

export const JobTitles: GlobalConfig = {
  slug: 'job-titles',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'titles',
      type: 'array',
      required: true,
      admin: {
        components: {
          RowLabel: '@/globalConfigs/JobTitles/RowLabel#RowLabel',
        },
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
};
