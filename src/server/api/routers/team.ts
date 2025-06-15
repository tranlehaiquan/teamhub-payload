import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  isAuthedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import {
  teams_users,
  users,
  users_skills,
  team_requirements,
  skills,
  teams,
  team_skills,
  categories,
} from '@/payload-generated-schema';
import { eq, like, count } from '@payloadcms/db-postgres/drizzle';
import { inArray } from '@payloadcms/db-postgres/drizzle';

export const teamRouter = createTRPCRouter({
  getTeams: isAuthedProcedure
    .input(
      z
        .object({
          page: z.number().optional().default(1),
          limit: z.number().optional().default(10),
          name: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const { page = 1, limit = 10, name } = input || {};

      const teamRecords = await ctx.drizzle
        .select({
          id: teams.id,
          name: teams.name,
          owner: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
          members: count(teams_users.id),
          createdAt: teams.createdAt,
          updatedAt: teams.updatedAt,
        })
        .from(teams)
        .leftJoin(users, eq(teams.owner, users.id))
        .leftJoin(teams_users, eq(teams.id, teams_users.team))
        .where(name ? like(teams.name, `%${name}%`) : undefined)
        .groupBy(
          teams.id,
          teams.name,
          users.id,
          users.name,
          users.email,
          teams.createdAt,
          teams.updatedAt,
        )
        .limit(limit)
        .offset((page - 1) * limit);

      console.log(JSON.stringify(teamRecords));

      return {
        docs: teamRecords,
        totalDocs: teamRecords.length,
        limit,
        totalPages: Math.ceil(teamRecords.length / limit),
        page,
        pagingCounter: (page - 1) * limit + 1,
        hasPrevPage: page > 1,
        hasNextPage: false,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: null,
      };
    }),

  getTeamById: isAuthedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const team = await ctx.payload.db.drizzle.select().from(teams).where(eq(teams.id, input));
    return team[0];
  }),

  updateTeamById: isAuthedProcedure
    .input(
      z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional() }),
    )
    .mutation(async ({ input, ctx }) => {
      const newData = {
        name: input.name,
        description: input.description,
      };

      const team = await ctx.payload.update({
        collection: 'teams',
        id: input.id,
        data: newData,
      });

      return team;
    }),

  getTeamMembers: isAuthedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const teamId = input;
    const teamUsersResults = await ctx.payload.db.drizzle
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

    return teamUsersResults as {
      id: number;
      team: number | null;
      user: {
        name: string | null;
        id: number;
        email: string;
        profile: number | null;
      };
    }[];
  }),

  getUserSkills: isAuthedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const teamId = input;

    const teamUsersResults = await ctx.payload.db.drizzle
      .select({
        id: teams_users.id,
        team: teams_users.team,
        user: teams_users.user,
      })
      .from(teams_users)
      .leftJoin(users, eq(teams_users.user, users.id))
      .where(eq(teams_users.team, teamId));

    const teamMemberIds = teamUsersResults.map((teamMember) => teamMember.user as number);
    const userSkills = await ctx.payload.db.drizzle
      .select({
        id: users_skills.id,
        user: users_skills.user,
        skill: users_skills.skill,
        currentLevel: users_skills.currentLevel,
        desiredLevel: users_skills.desiredLevel,
      })
      .from(users_skills)
      .where(inArray(users_skills.user, teamMemberIds));

    const teamUsersResultsWithSkills = teamUsersResults
      .map((teamUser) => {
        const user = teamUser.user;
        const userSkill = userSkills
          .filter((userSkill) => userSkill.user === user)
          .map((userSkill) => ({
            ...userSkill,
            currentLevel: userSkill.currentLevel ? Number(userSkill.currentLevel) : undefined,
            desiredLevel: userSkill.desiredLevel ? Number(userSkill.desiredLevel) : undefined,
          }));

        return userSkill;
      })
      .flat();

    return teamUsersResultsWithSkills;
  }),

  removeTeamMember: isAuthedProcedure
    .input(z.object({ teams_usersId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { teams_usersId } = input;

      return await ctx.payload.delete({
        collection: 'teams_users',
        id: teams_usersId,
      });
    }),

  addTeamMember: isAuthedProcedure
    .input(z.object({ teamId: z.number(), userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { teamId, userId } = input;

      return await ctx.payload.create({
        collection: 'teams_users',
        data: {
          team: teamId,
          user: userId,
        },
      });
    }),

  deleteTeam: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const me = ctx.user;

    if (!me) {
      throw new Error('Unauthorized');
    }

    const teamId = input;
    const userId = me.user.id;
    const team = await ctx.payload.db.drizzle.select().from(teams).where(eq(teams.id, teamId));

    if (!team || team[0].owner !== userId) {
      throw new Error('Team not found');
    }

    const transactionID = (await ctx.payload.db.beginTransaction()) as string;

    // TODO: soft delete?
    const deleteTeamSkills = ctx.payload.delete({
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

    const deleteTeamRequirements = ctx.payload.delete({
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
    const deleteTeamUsers = ctx.payload.delete({
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

    const deleteTeam = ctx.payload.delete({
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

    await ctx.payload.db.commitTransaction(transactionID);

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
      const me = ctx.user;

      if (!me) {
        throw new Error('Unauthorized');
      }

      const userId = me.user.id;

      return await ctx.payload.create({
        collection: 'teams',
        data: {
          name: input.name,
          owner: input.owner || userId,
        },
      });
    }),

  getTeamSkills: isAuthedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const teamId = input;
    const teamSkills = await ctx.payload.db.drizzle
      .select({
        id: team_skills.id,
        team: team_skills.team,
        skill: {
          id: skills.id,
          name: skills.name,
        },
        skillCategory: {
          id: categories.id,
          title: categories.title,
        },
      })
      .from(team_skills)
      .leftJoin(skills, eq(team_skills.skill, skills.id))
      .leftJoin(categories, eq(skills.category, categories.id))
      .where(eq(team_skills.team, teamId))
      .limit(100);

    return {
      docs: teamSkills,
      totalDocs: teamSkills.length,
      limit: 100,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }),

  updateTeamSkills: isAuthedProcedure
    .input(
      z.object({
        teamId: z.number(),
        remove: z.array(z.number()).optional(),
        add: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { teamId, remove, add } = input;

      const removeSkills = (remove || []).map(async (teamSkill) => {
        return await ctx.payload.delete({
          collection: 'team_skills',
          id: teamSkill,
        });
      });

      const addSkills = (add || []).map(async (skillId) => {
        return await ctx.payload.create({
          collection: 'team_skills',
          data: {
            team: teamId,
            skill: skillId,
          },
        });
      });

      return await Promise.all([...removeSkills, ...addSkills]);
    }),

  getTeamRequirements: isAuthedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const teamId = input;

    const teamUsersResults = await ctx.payload.db.drizzle
      .select({
        id: teams_users.id,
        team: teams_users.team,
        user: teams_users.user,
      })
      .from(teams_users)
      .leftJoin(users, eq(teams_users.user, users.id))
      .where(eq(teams_users.team, teamId));
    const teamMemberIds = teamUsersResults.map((teamMember) => teamMember.user as number);
    const userSkills = await ctx.payload.db.drizzle
      .select({
        id: users_skills.id,
        user: users_skills.user,
        skill: users_skills.skill,
        currentLevel: users_skills.currentLevel,
        desiredLevel: users_skills.desiredLevel,
      })
      .from(users_skills)
      .where(inArray(users_skills.user, teamMemberIds));

    const teamRequirements = await ctx.payload.db.drizzle
      .select({
        id: team_requirements.id,
        team: team_requirements.team,
        skill: team_requirements.skill,
        desiredLevel: team_requirements.desiredLevel,
        desiredMembers: team_requirements.desiredMembers,
        skillName: skills.name,
      })
      .from(team_requirements)
      .leftJoin(skills, eq(team_requirements.skill, skills.id))
      .where(eq(team_requirements.team, teamId));

    // Create a lookup map for efficient counting: skill_id -> currentLevel -> count
    const userSkillsLookup = new Map<number, Map<number, number>>();
    userSkills.forEach((userSkill) => {
      const skillId = userSkill.skill as number;
      const currentLevel = userSkill.currentLevel ? Number(userSkill.currentLevel) : null;

      if (currentLevel !== null) {
        if (!userSkillsLookup.has(skillId)) {
          userSkillsLookup.set(skillId, new Map());
        }
        const skillMap = userSkillsLookup.get(skillId)!;
        skillMap.set(currentLevel, (skillMap.get(currentLevel) || 0) + 1);
      }
    });

    const teamRequirementsProcessed = teamRequirements.map((requirement) => {
      const skill = requirement.skill;
      const desiredLevel = requirement.desiredLevel ? Number(requirement.desiredLevel) : null;
      const desiredMembers = requirement.desiredMembers ? Number(requirement.desiredMembers) : null;

      // Efficient lookup instead of filtering
      const numberOfUserSkillsWithSameSkillAndDesiredLevel =
        skill && desiredLevel !== null && userSkillsLookup.has(skill)
          ? userSkillsLookup.get(skill)!.get(desiredLevel) || 0
          : 0;

      return {
        skill,
        desiredLevel,
        desiredMembers,
        numberOfUserSkillsWithSameSkillAndDesiredLevel,
      };
    });

    return teamRequirementsProcessed;
  }),

  updateUserSkills: isAuthedProcedure
    .input(
      z.array(
        z.object({
          id: z.number().optional(),
          user: z.number(),
          skill: z.number(),
          currentLevel: z.number().nullable(),
          desiredLevel: z.number().nullable(),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const newUserSkills = input.filter((userSkill) => !userSkill.id);
      const userSkillsUpdate = input.filter((userSkill) => userSkill.id) as {
        id: number;
        user: number;
        skill: number;
        currentLevel: number;
      }[];

      const newUserSkillsRs = newUserSkills.map(async (userSkill) => {
        await ctx.payload.create({
          collection: 'users_skills',
          data: {
            user: userSkill.user,
            skill: userSkill.skill,
            currentLevel: userSkill.currentLevel,
            desiredLevel: userSkill.desiredLevel,
          },
        });
      });

      const updateUserSkillsRs = userSkillsUpdate.map(async (userSkillUpdate) => {
        return await ctx.payload.update({
          collection: 'users_skills',
          id: userSkillUpdate.id,
          data: userSkillUpdate,
        });
      });

      return await Promise.all([...newUserSkillsRs, ...updateUserSkillsRs]);
    }),

  transferTeamOwnership: isAuthedProcedure
    .input(
      z.object({
        teamId: z.number(),
        newOwnerId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user;

      if (!me) {
        throw new Error('Unauthorized');
      }

      const { teamId, newOwnerId } = input;
      const currentUserId = me.user.id;

      // Verify current user is the team owner
      const teamResults = await ctx.payload.db.drizzle
        .select()
        .from(teams)
        .where(eq(teams.id, teamId));

      const team = teamResults[0];

      if (!team || team.owner !== currentUserId) {
        throw new Error('Unauthorized: Only team owner can transfer ownership');
      }

      // Verify new owner exists
      const newOwner = await ctx.payload.db.drizzle
        .select()
        .from(users)
        .where(eq(users.id, newOwnerId));

      if (!newOwner || newOwner.length === 0) {
        throw new Error('New owner not found');
      }

      // Transfer ownership
      return await ctx.payload.update({
        collection: 'teams',
        id: teamId,
        data: {
          owner: newOwnerId,
        },
      });
    }),

  updateTeamRequirements: isAuthedProcedure
    .input(
      z.object({
        teamId: z.number(),
        skillId: z.number(),
        requirements: z.array(
          z.object({
            desiredLevel: z.number().nullable(),
            desiredMembers: z.number().nullable(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { teamId, skillId, requirements } = input;

      // Delete existing requirements for this team and skill
      await ctx.payload.delete({
        collection: 'team_requirements',
        where: {
          AND: [
            {
              team: {
                equals: teamId,
              },
            },
            {
              skill: {
                equals: skillId,
              },
            },
          ],
        },
      });

      // Create new requirements
      const createRequirements = requirements
        .filter(
          (req) =>
            req.desiredLevel !== null && req.desiredMembers !== null && req.desiredMembers > 0,
        )
        .map(async (requirement) => {
          return await ctx.payload.create({
            collection: 'team_requirements',
            data: {
              team: teamId,
              skill: skillId,
              desiredLevel: requirement.desiredLevel,
              desiredMembers: requirement.desiredMembers,
            },
          });
        });

      return await Promise.all(createRequirements);
    }),
});
