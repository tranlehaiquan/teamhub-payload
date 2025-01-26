import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const teamRouter = createTRPCRouter({
  getTeams: publicProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const payload = await getPayloadFromConfig();
      const skills = await payload.find({
        collection: 'teams',
        limit,
        page,
      });

      return skills;
    }),
});
