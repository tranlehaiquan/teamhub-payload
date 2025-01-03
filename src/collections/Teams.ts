import type { CollectionConfig } from 'payload'

const Team: CollectionConfig = {
  slug: 'teams',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
