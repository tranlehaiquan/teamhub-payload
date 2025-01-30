import { z } from 'zod';

import { createTRPCRouter, isAuthedProcedure, adminProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { createUserTemplate } from '@/email-templates/templates';

export const userRouter = createTRPCRouter({
  getUsers: isAuthedProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const payload = await getPayloadFromConfig();
      const skills = await payload.find({
        collection: 'users',
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
      const profile = await payload.create({
        collection: 'profiles',
        data: {
          firstName,
          lastName,
        },
      });

      const randomPassword = Math.random().toString(36).slice(-8);
      const user = await payload.create({
        collection: 'users',
        data: {
          email,
          password: randomPassword,
          profile: profile.id,
        },
        disableVerificationEmail: true,
        showHiddenFields: true,
      });
      const tokenVerify = user._verificationToken;
      const url = `http://localhost:3000/verify?token=${tokenVerify}`;
      const html = createUserTemplate(user, url, randomPassword);

      await payload.sendEmail({
        to: user.email,
        subject: 'Welcome to TeamHub platform!',
        text: 'welcome to teamhub',
        html,
      });

      return {
        user,
        profile,
        message: 'User created successfully',
      };
    }),
});
