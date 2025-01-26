import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const skillRouter = createTRPCRouter({
  getSkills: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input: { page = 1, limit = 10 } }) => {
      const payload = await getPayloadFromConfig();
      const skills = await payload.find({
        collection: 'skills',
        limit,
        page,
      });

      return skills;
    }),
});
