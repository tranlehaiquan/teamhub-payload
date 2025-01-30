import { z } from 'zod';

import { createTRPCRouter, publicProcedure, isAuthedProcedure } from '@/server/api/trpc';
import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { Profile } from '@/payload-types';

export const meRouter = createTRPCRouter({
  getMe: publicProcedure.query(async () => {
    const me = await getMeUser();

    return me;
  }),

  getTeams: publicProcedure.query(async () => {
    const me = await getMeUser();
    const userId = me.user.id;
    const payload = await getPayloadFromConfig();

    // all teams user is owner
    const teamsOwned = await payload.find({
      collection: 'teams',
      where: {
        owner: {
          equals: userId,
        },
      },
    });

    return {
      teamsOwned,
    };
  }),

  getProfile: publicProcedure.query(async () => {
    const me = await getMeUser();

    return me.user.profile as Profile;
  }),

  userSkill: publicProcedure.query(async () => {
    const me = await getMeUser();
    const userId = me.user.id;
    const payload = await getPayloadFromConfig();

    const userSkills = await payload.find({
      collection: 'users_skills',
      where: {
        user: {
          equals: userId,
        },
      },
      populate: {
        skills: {
          name: true,
        },
      },
      depth: 1,
    });

    return userSkills;
  }),

  getCertificates: publicProcedure.query(async ({ ctx }) => {
    const payload = await getPayloadFromConfig();

    const userCertificates = await payload.find({
      collection: 'certificates',
      populate: {
        users_skills: {
          skill: true,
        },
      },
    });

    return userCertificates;
  }),

  updateProfile: isAuthedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const me = await getMeUser();
      const profileId = (me.user.profile as Profile).id;

      const payload = await getPayloadFromConfig();
      const profile = await payload.update({
        collection: 'profiles',
        id: profileId,
        data: input,
      });

      return profile;
    }),
});
