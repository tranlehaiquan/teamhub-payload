import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { createTRPCRouter, isAuthedProcedure } from '@/server/api/trpc';

export const globalConfigsRouter = createTRPCRouter({
  getLevels: isAuthedProcedure.query(async () => {
    const payload = await getPayloadFromConfig();
    const results = await payload.findGlobal({
      slug: 'levels',
      depth: 2,
    });

    return results;
  }),
  getJobTitles: isAuthedProcedure.query(async () => {
    const payload = await getPayloadFromConfig();
    const results = await payload.findGlobal({
      slug: 'job-titles',
      depth: 2,
    });

    return results;
  }),
});
