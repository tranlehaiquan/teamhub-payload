import { z } from 'zod';
import { createTRPCRouter, isAuthedProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { Profile, Team } from '@/payload-types';
import { unionBy } from 'lodash';
import { users_skills } from '@/payload-generated-schema';
import { TrainingStatusValues } from '@/collections/Trainings/constants';

const schemaChangePassword = z.object({
  currentPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
  newPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
});

export const meRouter = createTRPCRouter({
  getMe: isAuthedProcedure.query(async ({ ctx }) => {
    const me = ctx.user;

    return me;
  }),

  getTeams: isAuthedProcedure.query(async ({ ctx }) => {
    const me = ctx.user;
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

    // find team_user
    const teamUsers = await payload.find({
      collection: 'teams_users',
      where: {
        user: {
          equals: userId,
        },
      },
      populate: {},
    });

    const teamsIsMember = unionBy(
      teamUsers.docs.map((teamUser) => teamUser.team as Team).concat(teamsOwned.docs),
      'id',
    ).filter((team) => team.id);

    return teamsIsMember as Team[];
  }),

  getProfile: isAuthedProcedure.query(async ({ ctx }) => {
    const me = ctx.user;

    return me.user.profile as Profile;
  }),

  userSkill: isAuthedProcedure.query(async ({ ctx }) => {
    const me = ctx.user;
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
          category: true,
        },
      },
      depth: 1,
    });

    return userSkills;
  }),

  getCertificates: isAuthedProcedure.query(async () => {
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
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user;
      const profileId = (me.user.profile as Profile).id;

      const payload = await getPayloadFromConfig();
      const profile = await payload.update({
        collection: 'profiles',
        id: profileId,
        data: input,
      });

      return profile;
    }),

  addCertificate: isAuthedProcedure
    .input(
      z.object({
        name: z.string().nonempty({
          message: 'Name is required',
        }),
        issuingOrganization: z.string().min(1, {
          message: 'Issuing organization is required',
        }),
        deliveryDate: z.date().optional().nullable(),
        expiryDate: z.date().optional().nullable(),
        userSkills: z.array(
          z.number({
            message: 'Skill is required',
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const payload = await getPayloadFromConfig();
      const { name, issuingOrganization, deliveryDate, expiryDate, userSkills } = input;

      const certificate = await payload.create({
        collection: 'certificates',
        data: {
          name,
          issuingOrganization,
          deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
          userSkills,
          user: userId,
        },
      });

      return certificate;
    }),

  updateCertificate: isAuthedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().nonempty({
          message: 'Name is required',
        }),
        issuingOrganization: z.string().min(1, {
          message: 'Issuing organization is required',
        }),
        deliveryDate: z.date().optional().nullable(),
        expiryDate: z.date().optional().nullable(),
        userSkills: z.array(
          z.number({
            message: 'Skill is required',
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const payload = await getPayloadFromConfig();
      const { id, name, issuingOrganization, deliveryDate, expiryDate, userSkills } = input;

      const certificate = await payload.update({
        collection: 'certificates',
        where: {
          id: {
            equals: id,
          },
          user: {
            equals: userId,
          },
        },
        data: {
          name,
          issuingOrganization,
          deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
          userSkills,
        },
      });

      return certificate;
    }),

  removeCertificate: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const payload = await getPayloadFromConfig();
    const userId = ctx.user.user.id;
    const certificateId = input;

    try {
      await payload.delete({
        collection: 'certificates',
        where: {
          id: {
            equals: certificateId,
          },
          user: {
            equals: userId,
          },
        },
      });

      return {
        success: true,
        message: 'Certificate removed successfully',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to remove certificate',
      };
    }
  }),

  updatePassword: isAuthedProcedure.input(schemaChangePassword).mutation(async ({ input, ctx }) => {
    const payload = await getPayloadFromConfig();
    const user = ctx.user.user;

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: input.newPassword,
      },
    });

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }),

  addUserSkill: isAuthedProcedure.input(z.array(z.number())).mutation(async ({ input, ctx }) => {
    const me = ctx.user.user;
    const userId = me.id;
    const payload = await getPayloadFromConfig();
    const skills = input;

    try {
      const newUserSkills = skills.map((skill) => ({
        user: userId,
        skill: skill,
      }));

      await payload.db.drizzle.insert(users_skills).values(newUserSkills);

      return {
        success: true,
        message: 'Skills added successfully',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to add skills',
      };
    }
  }),

  removeUserSkill: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const me = ctx.user.user;
    const userId = me.id;
    const payload = await getPayloadFromConfig();
    const skill = input;

    try {
      await payload.delete({
        collection: 'users_skills',
        where: {
          user: {
            equals: userId,
          },
          skill: {
            equals: skill,
          },
        },
      });

      return {
        success: true,
        message: 'Skill removed successfully',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to remove skill',
      };
    }
  }),

  updateUserSkill: isAuthedProcedure
    .input(
      z.object({
        id: z.number(),
        currentLevel: z.number().optional(),
        desiredLevel: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const payload = await getPayloadFromConfig();
      const { id, currentLevel, desiredLevel } = input;

      try {
        await payload.update({
          collection: 'users_skills',
          where: {
            user: {
              equals: userId,
            },
            id: {
              equals: id,
            },
          },
          data: {
            currentLevel,
            desiredLevel,
          },
        });

        return {
          success: true,
          message: 'Skill updated successfully',
        };
      } catch {
        return {
          success: false,
          message: 'Failed to update skill',
        };
      }
    }),

  getTrainings: isAuthedProcedure
    .input(
      z
        .object({
          page: z.number().default(1),
          limit: z.number().default(10),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const me = ctx.user;
      const userId = me.user.id;
      const payload = await getPayloadFromConfig();
      const { page = 1, limit = 10 } = input || {};

      const trainings = await payload.find({
        collection: 'trainings',
        where: {
          user: {
            equals: userId,
          },
        },
        page,
        limit,
      });

      return trainings;
    }),
  addTraining: isAuthedProcedure
    .input(
      z.object({
        name: z.string(),
        link: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(TrainingStatusValues).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const payload = await getPayloadFromConfig();
      const { name, link, description, status, startDate, endDate } = input;

      const training = await payload.create({
        collection: 'trainings',
        data: {
          name,
          link,
          description,
          status,
          user: userId,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
        },
      });

      return training;
    }),

  updateTraining: isAuthedProcedure
    .input(
      z
        .object({
          id: z.number(),
          name: z.string().nonempty({
            message: 'Training name is required',
          }),
          link: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(TrainingStatusValues).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .refine((data) => !data.startDate || !data.endDate || data.startDate < data.endDate, {
          message: 'End date must be after start date',
          path: ['endDate'],
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const me = ctx.user.user;
      const userId = me.id;
      const payload = await getPayloadFromConfig();
      const { id, name, link, description, status, startDate, endDate } = input;

      try {
        await payload.update({
          collection: 'trainings',
          where: {
            user: {
              equals: userId,
            },
            id: {
              equals: id,
            },
          },
          data: {
            name,
            link,
            description,
            status,
            startDate: startDate ? new Date(startDate).toISOString() : null,
            endDate: endDate ? new Date(endDate).toISOString() : null,
          },
        });

        return {
          success: true,
          message: 'Training updated successfully',
        };
      } catch {
        return {
          success: false,
          message: 'Failed to update training',
        };
      }
    }),

  removeTraining: isAuthedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const payload = await getPayloadFromConfig();
    const userId = ctx.user.user.id;
    const trainingId = input;

    try {
      await payload.delete({
        collection: 'trainings',
        where: {
          id: {
            equals: trainingId,
          },
          user: {
            equals: userId,
          },
        },
      });

      return {
        success: true,
        message: 'Training removed successfully',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to remove training',
      };
    }
  }),

  updateReportTo: isAuthedProcedure
    .input(
      z.object({
        reportTo: z.number().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await getPayloadFromConfig();
      const me = ctx.user.user;

      await payload.update({
        collection: 'users',
        id: me.id,
        data: input,
      });

      return {
        success: true,
        message: 'Report to updated successfully',
      };
    }),
});
