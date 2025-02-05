import { z } from 'zod';
import { createTRPCRouter, isAuthedProcedure, adminProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { createUserTemplate } from '@/email-templates/templates';
import { Where } from 'payload';
import { getClientSideURL } from '@/utilities/getURL';

const clientURL = getClientSideURL();

export const userRouter = createTRPCRouter({
  getUsers: isAuthedProcedure
    .input(
      z.object({
        email: z.string().optional(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit, email } = input;
      const payload = await getPayloadFromConfig();
      const where: Where = {};

      if (email) {
        where['email'] = {
          contains: email,
        };
      }

      const skills = await payload.find({
        collection: 'users',
        where,
        limit,
        page,
      });

      return skills;
    }),

  createUser: adminProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const { firstName, lastName, email } = input;
      const payload = await getPayloadFromConfig();

      const randomPassword = Math.random().toString(36).slice(-8);
      const user = await payload.create({
        collection: 'users',
        data: {
          email,
          password: randomPassword,
        },
        disableVerificationEmail: true,
        showHiddenFields: true,
      });

      const profile = await payload.create({
        collection: 'profiles',
        data: {
          firstName,
          lastName,
        },
      });

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          profile: profile.id,
        },
      });

      const tokenVerify = user._verificationToken;
      const url = `${clientURL}/verify?token=${tokenVerify}`;
      const html = createUserTemplate(user, url, randomPassword);

      await payload.sendEmail({
        to: user.email,
        subject: 'Welcome to TeamHub platform!',
        text: 'welcome to teamhub',
        html,
      });

      return {
        success: true,
        user,
        profile,
        message: 'User created successfully',
      };
    }),

  findUserById: isAuthedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const { id } = input;
    const payload = await getPayloadFromConfig();
    const user = await payload.findByID({
      collection: 'users',
      id,
    });

    return user;
  }),
});
