'use server';
import { createUserTemplate } from '@/email-templates/templates';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import z from 'zod';

// define the schema for the signup function
const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export const createUser = async ({ firstName, lastName, email }) => {
  const validatedFields = signupSchema.safeParse({ firstName, lastName, email });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

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
};
