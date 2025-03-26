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
      fields: [
        {
          name: 'title',
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
