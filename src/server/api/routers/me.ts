import { z } from 'zod';

import { createTRPCRouter, isAuthedProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { Profile, User } from '@/payload-types';

const schemaChangePassword = z.object({
  currentPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
  newPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
});

const getAvatarFileName = (user: User) => {
  return `${user.id}-avatar.jpg`;
};

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

    return {
      teamsOwned,
    };
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

    // TODO: consider insert with drizzle (N + 1)
    try {
      await Promise.all(
        skills.map(async (skill) =>
          payload.create({
            collection: 'users_skills',
            data: {
              user: userId,
              skill: skill,
            },
          }),
        ),
      );

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
            skill: {
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
});
