import { z } from 'zod';
import { adminProcedure, createTRPCRouter, isAuthedProcedure } from '@/server/api/trpc';
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
import { eq, like, count, sql } from '@payloadcms/db-postgres/drizzle';
import { inArray, and } from '@payloadcms/db-postgres/drizzle';
import { TRPCError } from '@trpc/server';

// Shared helper function
async function fetchTeamRequirements(
  ctx: any,
  teamId: number,
): Promise<
  {
    skillId: number;
    skillName: string;
    progress: number;
    requirements: Array<{
      desiredLevel: number | null;
      desiredMembers: number | null;
      numberOfUserSkillsWithSameSkillAndDesiredLevel: number;
    }>;
  }[]
> {
  const teamRequirementsWithCounts = await ctx.drizzle
    .select({
      id: team_requirements.id,
      skill: team_requirements.skill,
      desiredLevel: team_requirements.desiredLevel,
      desiredMembers: team_requirements.desiredMembers,
      skillName: skills.name,
      numberOfUserSkillsWithSameSkillAndDesiredLevel: sql<number>`
        COUNT(
          CASE
            WHEN ${users_skills.skill} = ${team_requirements.skill}
            AND ${users_skills.currentLevel} = ${team_requirements.desiredLevel}
            THEN 1
          END
        )
      `.as('count'),
    })
    .from(team_requirements)
    .leftJoin(skills, eq(team_requirements.skill, skills.id))
    .leftJoin(teams_users, eq(teams_users.team, teamId))
    .leftJoin(
      users_skills,
      and(eq(users_skills.user, teams_users.user), eq(users_skills.skill, team_requirements.skill)),
    )
    .where(eq(team_requirements.team, teamId))
    .groupBy(
      team_requirements.id,
      team_requirements.skill,
      team_requirements.desiredLevel,
      team_requirements.desiredMembers,
      skills.name,
    );
  // Group by skill
  const grouped: Record<
    string,
    {
      skillId: number;
      skillName: string;
      requirements: Array<{
        desiredLevel: number | null;
        desiredMembers: number | null;
        numberOfUserSkillsWithSameSkillAndDesiredLevel: number;
      }>;
    }
  > = {};

  for (const req of teamRequirementsWithCounts) {
    const skillId = req.skill;
    if (!grouped[skillId]) {
      grouped[skillId] = {
        skillId,
        skillName: req.skillName,
        requirements: [],
      };
    }
    grouped[skillId].requirements.push({
      desiredLevel: req.desiredLevel ? Number(req.desiredLevel) : null,
      desiredMembers: req.desiredMembers ? Number(req.desiredMembers) : null,
      numberOfUserSkillsWithSameSkillAndDesiredLevel: Number(
        req.numberOfUserSkillsWithSameSkillAndDesiredLevel,
      ),
    });
  }
  const values = Object.values(grouped).map((skill) => {
    const topReq = skill.requirements.reduce(
      (max: any, req: any) => (req.desiredMembers > (max?.desiredMembers ?? 0) ? req : max),
      null,
    );
    const progress =
      topReq && topReq.desiredMembers
        ? Math.round(
            ((topReq.numberOfUserSkillsWithSameSkillAndDesiredLevel || 0) / topReq.desiredMembers) *
              100,
          )
        : 0;

    return {
      ...skill,
      progress,
    };
  });

  return values;
}

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

      const totalCountResult = await ctx.drizzle
        .select({ count: count() })
        .from(teams)
        .where(name ? like(teams.name, `%${name}%`) : undefined);

      const totalDocs = Number(totalCountResult[0]?.count || 0);
      const totalPages = Math.ceil(totalDocs / limit);

      return {
        docs: teamRecords,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter: (page - 1) * limit + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      };
    }),

  getTeamById: isAuthedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const team = await ctx.drizzle.select().from(teams).where(eq(teams.id, input));
    return team[0];
  }),

  updateTeamById: isAuthedProcedure
    .input(
      z.object({
        id: z.number().positive(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
      }),
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
    const teamUsersResults = await ctx.drizzle
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

    // Single query with JOINs - much more efficient!
    const teamUsersWithSkills = await ctx.drizzle
      .select({
        // Team user info
        teamUserId: teams_users.id,
        teamId: teams_users.team,
        userId: teams_users.user,

        // User skill info (can be null if user has no skills)
        userSkillId: users_skills.id,
        skillId: users_skills.skill,
        currentLevel: users_skills.currentLevel,
        desiredLevel: users_skills.desiredLevel,
      })
      .from(teams_users)
      .leftJoin(users_skills, eq(teams_users.user, users_skills.user))
      .where(eq(teams_users.team, teamId));

    // Simple mapping - no filtering needed!
    const userSkillsProcessed = teamUsersWithSkills
      .filter((row) => row.userSkillId !== null) // Only include rows with skills
      .map((row) => ({
        id: row.userSkillId!,
        user: row.userId,
        skill: row.skillId!,
        currentLevel: row.currentLevel ? Number(row.currentLevel) : 0,
        desiredLevel: row.desiredLevel ? Number(row.desiredLevel) : 0,
      }));

    return userSkillsProcessed;
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
    .input(z.object({ teamId: z.number().positive(), userId: z.number().positive() }))
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

    const teamId = input;
    const userId = me.user.id;
    const team = await ctx.drizzle.select().from(teams).where(eq(teams.id, teamId));

    if (!team || team[0].owner !== userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Team not found',
      });
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
        name: z.string().min(1).max(255),
        owner: z.number().positive(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user;
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
    const teamSkills = await ctx.drizzle
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

    return teamSkills;
  }),

  updateTeamSkills: isAuthedProcedure
    .input(
      z.object({
        teamId: z.number().positive(),
        remove: z.array(z.number().positive()).optional(),
        add: z.array(z.number().positive()).optional(),
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

  updateUserSkills: isAuthedProcedure
    .input(
      z.array(
        z.object({
          id: z.number().optional(),
          user: z.number().positive(),
          skill: z.number().positive(),
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
        return await ctx.payload.create({
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
        teamId: z.number().positive(),
        newOwnerId: z.number().positive(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user;
      const { teamId, newOwnerId } = input;
      const currentUserId = me.user.id;

      // Verify current user is the team owner
      const teamRecords = await ctx.drizzle.select().from(teams).where(eq(teams.id, teamId));
      const team = teamRecords[0];

      if (!team || team.owner !== currentUserId) {
        throw new Error('Unauthorized: Only team owner can transfer ownership');
      }

      // Verify new owner exists
      const newOwner = await ctx.drizzle.select().from(users).where(eq(users.id, newOwnerId));

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

  getTeamRequirements: isAuthedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    try {
      const teamRequirements = await fetchTeamRequirements(ctx, input);
      return teamRequirements;
    } catch (error) {
      console.error('Error fetching team requirements:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch team requirements',
      });
    }
  }),

  updateTeamRequirements: isAuthedProcedure
    .input(
      z.object({
        teamId: z.number().positive(),
        skillId: z.number().positive(),
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
