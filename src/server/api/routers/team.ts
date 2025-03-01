import { z } from 'zod';

import { adminProcedure, createTRPCRouter, isAuthedProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { teams_users, users, users_skills } from '@/payload-generated-schema';
import { eq } from '@payloadcms/db-postgres/drizzle';
import { User } from '@/payload-types';
import { inArray } from '@payloadcms/db-postgres/drizzle';

export const teamRouter = createTRPCRouter({
  findTeams: isAuthedProcedure
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

    const teamMemberIds = teamUsersResults.map((teamMember) => (teamMember.user as User).id);

    // get the skills of the team members
    const userSkills = await payload.db.drizzle
      .select({
        id: users_skills.id,
        user: users_skills.user,
        skill: users_skills.skill,
        currentLevel: users_skills.currentLevel,
      })
      .from(users_skills)
      .where(inArray(users_skills.user, teamMemberIds));

    const teamUsersResultsWithSkills = teamUsersResults.map((teamUser) => {
      const user = teamUser.user as User;
      const userSkill = userSkills.filter((userSkill) => userSkill.user === user.id) as {
        id: number;
        user: number;
        skill: number;
        currentLevel: string | null;
      }[];

      return {
        ...teamUser,
        userSkills: userSkill,
      };
    });

    return teamUsersResultsWithSkills;
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

    const transactionID = (await payload.db.beginTransaction()) as string;
    console.log('transactionID', transactionID);

    // TODO: soft delete?
    const deleteTeamSkills = payload.delete({
      collection: 'team_skills',
      where: {
        team: {
          equals: teamId,
        },
      },
      req: {
        transactionID,
      },
    });

    const deleteTeamRequirements = payload.delete({
      collection: 'team_requirements',
      where: {
        team: {
          equals: teamId,
        },
      },
      req: {
        transactionID,
      },
    });

    // teams_users
    const deleteTeamUsers = payload.delete({
      collection: 'teams_users',
      where: {
        team: {
          equals: teamId,
        },
      },
      req: {
        transactionID,
      },
    });

    const deleteTeam = payload.delete({
      collection: 'teams',
      id: teamId,
      req: {
        transactionID,
      },
    });

    const result = await Promise.all([
      deleteTeamSkills,
      deleteTeamRequirements,
      deleteTeamUsers,
      deleteTeam,
    ]);

    await payload.db.commitTransaction(transactionID);

    return result;
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
    .input(
      z.object({
        teamId: z.number(),
        remove: z.array(z.number()).optional(),
        add: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { teamId, remove, add } = input;
      const payload = await getPayloadFromConfig();

      const removeSkills = (remove || []).map(async (teamSkill) => {
        return await payload.delete({
          collection: 'team_skills',
          id: teamSkill,
        });
      });

      const addSkills = (add || []).map(async (skillId) => {
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

  updateUserSkills: isAuthedProcedure
    .input(
      z.array(
        z.object({
          id: z.number().optional(),
          user: z.number(),
          skill: z.number(),
          currentLevel: z.number().nullable(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      const payload = await getPayloadFromConfig();
      const newUserSkillsUpdate = input.filter((userSkill) => !userSkill.id);
      const userSkillsUpdate = input.filter((userSkill) => userSkill.id) as {
        id: number;
        user: number;
        skill: number;
        currentLevel: number;
      }[];

      const newUserSkills = newUserSkillsUpdate.map(async (userSkill) => {
        await payload.create({
          collection: 'users_skills',
          data: userSkill,
        });
      });

      const updateUserSkills = userSkillsUpdate.map(async (userSkillUpdate) => {
        return await payload.update({
          collection: 'users_skills',
          id: userSkillUpdate.id,
          data: userSkillUpdate,
        });
      });

      return await Promise.all([...newUserSkills, ...updateUserSkills]);
    }),

  transferTeamOwnership: isAuthedProcedure
    .input(
      z.object({
        teamId: z.number(),
        newOwnerId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await getPayloadFromConfig();
      const me = ctx.user;

      if (!me) {
        throw new Error('Unauthorized');
      }

      const { teamId, newOwnerId } = input;
      const currentUserId = me.user.id;

      // Verify current user is the team owner
      const team = await payload.findByID({
        collection: 'teams',
        id: teamId,
      });

      if (!team || (team.owner as User).id !== currentUserId) {
        throw new Error('Unauthorized: Only team owner can transfer ownership');
      }

      // Verify new owner exists
      const newOwner = await payload.findByID({
        collection: 'users',
        id: newOwnerId,
      });

      if (!newOwner) {
        throw new Error('New owner not found');
      }

      // Transfer ownership
      return await payload.update({
        collection: 'teams',
        id: teamId,
        data: {
          owner: newOwnerId,
        },
      });
    }),
});
