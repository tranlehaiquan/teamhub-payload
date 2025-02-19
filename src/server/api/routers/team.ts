import { z } from 'zod';

import { adminProcedure, createTRPCRouter, isAuthedProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { categories, teams_users, users } from '@/payload-generated-schema';
import { eq } from '@payloadcms/db-postgres/drizzle';
import { Skill, User } from '@/payload-types';

export const teamRouter = createTRPCRouter({
  getTeams: isAuthedProcedure
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

  getTeamById: isAuthedProcedure.input(z.number()).query(async ({ input }) => {
    const payload = await getPayloadFromConfig();
    const team = await payload.findByID({
      collection: 'teams',
      id: input,
      depth: 0,
    });

    return team;
  }),

  updateTeamById: isAuthedProcedure
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

  getTeamMembers: isAuthedProcedure.input(z.number()).query(async ({ input }) => {
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
          profile: users.profile,
        },
      })
      .from(teams_users)
      .leftJoin(users, eq(teams_users.user, users.id))
      .where(eq(teams_users.team, teamId));

    return teamUsersResults;
  }),

  removeTeamMember: isAuthedProcedure
    .input(z.object({ teams_usersId: z.number() }))
    .mutation(async ({ input }) => {
      const { teams_usersId } = input;
      const payload = await getPayloadFromConfig();

      return await payload.delete({
        collection: 'teams_users',
        id: teams_usersId,
      });
    }),

  addTeamMember: isAuthedProcedure
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

  deleteTeam: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const payload = await getPayloadFromConfig();
    const me = ctx.user;

    if (!me) {
      throw new Error('Unauthorized');
    }

    const teamId = input;
    const userId = me.user.id;

    const team = await payload.findByID({
      collection: 'teams',
      id: teamId,
    });

    if (!team || (team.owner as User).id !== userId) {
      throw new Error('Team not found');
    }

    return await payload.delete({
      collection: 'teams',
      id: teamId,
    });
  }),

  createTeam: adminProcedure
    .input(
      z.object({
        name: z.string(),
        owner: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await getPayloadFromConfig();
      const me = ctx.user;

      if (!me) {
        throw new Error('Unauthorized');
      }

      const userId = me.user.id;

      return await payload.create({
        collection: 'teams',
        data: {
          name: input.name,
          owner: userId,
        },
      });
    }),

  getTeamSkills: isAuthedProcedure.input(z.number()).query(async ({ input }) => {
    const teamId = input;
    const payload = await getPayloadFromConfig();
    const teamSkills = await payload.find({
      collection: 'team_skills',
      where: {
        team: {
          equals: teamId,
        },
      },
      limit: 100,
      populate: {
        teams: {}, // this make team only return { id }
        skills: {
          name: true,
          category: true,
        },
      },
    });

    return teamSkills;
  }),

  updateTeamSkills: isAuthedProcedure
    .input(z.object({ teamId: z.number(), skills: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      const { teamId, skills } = input;
      const payload = await getPayloadFromConfig();

      const currentTeamSkills = await payload.find({
        collection: 'team_skills',
        where: {
          team: {
            equals: teamId,
          },
        },
      });

      // diff the skills
      const skillsToRemove = currentTeamSkills.docs.filter(
        (teamSkill) => !skills.includes((teamSkill.skill as Skill).id),
      );

      const skillsToAdd = skills.filter(
        (skill) =>
          !currentTeamSkills.docs.some((teamSkill) => (teamSkill.skill as Skill).id === skill),
      );

      const removeSkills = skillsToRemove.map(async (teamSkill) => {
        return await payload.delete({
          collection: 'team_skills',
          id: teamSkill.id,
        });
      });

      const addSkills = skillsToAdd.map(async (skillId) => {
        return await payload.create({
          collection: 'team_skills',
          data: {
            team: teamId,
            skill: skillId,
          },
        });
      });

      return await Promise.all([...removeSkills, ...addSkills]);
    }),

  getTeamRequirement: isAuthedProcedure.input(z.number()).query(async ({ input }) => {
    const teamId = input;
    const payload = await getPayloadFromConfig();
    const teamRequirements = await payload.find({
      collection: 'team_requirements',
      where: {
        team: {
          equals: teamId,
        },
      },
      populate: {
        teams: {}, // this make team only return { id }
        skills: {
          name: true,
          category: true,
        },
      },
    });

    return teamRequirements;
  }),
});
