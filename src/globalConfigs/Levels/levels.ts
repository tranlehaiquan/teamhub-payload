import { GlobalConfig } from 'payload';

export const Levels: GlobalConfig = {
  slug: 'levels',
  fields: [
    {
      name: 'items',
      label: 'Level items',
      type: 'array',
      required: true,
      admin: {
        components: {
          RowLabel: '@/globalConfigs/Levels/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'name',
          label: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'level',
          label: 'level',
          type: 'number',
          required: true,
        },
        {
          name: 'levelColor',
          label: 'level color',
          // todo: add type color picker
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
