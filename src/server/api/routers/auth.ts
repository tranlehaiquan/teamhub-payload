import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(signupSchema).mutation(async ({ input }) => {
    const { email, password } = input;
    const payload = await getPayloadFromConfig();

    const profile = await payload.create({
      collection: 'profiles',
      data: {},
    });

    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        profile: profile.id,
      },
    });

    return {
      user,
      profile,
      message: 'User created successfully',
    };
  }),
});
