import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { teams_users, users, profiles } from '@/payload-generated-schema';
import { eq } from '@payloadcms/db-postgres/drizzle';

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
      const teams = await payload.find({
        collection: 'teams',
        limit,
        page,
      });

      return teams;
    }),

  getTeamById: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const payload = await getPayloadFromConfig();
    const team = await payload.findByID({
      collection: 'teams',
      id: input,
      depth: 0,
    });

    return team;
  }),

  updateTeamById: publicProcedure
    .input(
      z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional() }),
    )
    .mutation(async ({ input }) => {
      const payload = await getPayloadFromConfig();
      const newData = {
        name: input.name,
        description: input.description,
      };

      const team = await payload.update({
        collection: 'teams',
        id: input.id,
        data: newData,
      });

      return team;
    }),

  getTeamMembers: publicProcedure.input(z.number()).query(async ({ input }) => {
    const teamId = input;
    const payload = await getPayloadFromConfig();
    const teamUsersResults = await payload.db.drizzle
      .select({
        id: teams_users.id,
        team: teams_users.team,
        user: {
          id: users.id,
          email: users.email,
          name: users.name,
          // profile: {
          //   id: profiles.id,
          //   firstName: profiles.firstName,
          //   lastName: profiles.lastName,
          // },
        },
      })
      .from(teams_users)
      .leftJoin(users, eq(teams_users.user, users.id))
      // .leftJoin(profiles, eq(users.profile, profiles.id))
      .where(eq(teams_users.team, teamId));

    return teamUsersResults;
  }),

  removeTeamMember: publicProcedure
    .input(z.object({ teams_usersId: z.number() }))
    .mutation(async ({ input }) => {
      const { teams_usersId } = input;
      const payload = await getPayloadFromConfig();

      return await payload.delete({
        collection: 'teams_users',
        id: teams_usersId,
      });
    }),

  addTeamMember: publicProcedure
    .input(z.object({ teamId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      const { teamId, userId } = input;
      const payload = await getPayloadFromConfig();

      return await payload.create({
        collection: 'teams_users',
        data: {
          team: teamId,
          user: userId,
        },
      });
    }),
});
