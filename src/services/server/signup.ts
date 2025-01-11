'use server';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import z from 'zod';

// define the schema for the signup function
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signup = async ({ email, password }) => {
  const validatedFields = signupSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

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
};
