'use server';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const signup = async ({ email, password }) => {
  const payload = await getPayloadFromConfig();

  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      password,
    },
  });

  const profile = await payload.create({
    collection: 'profiles',
    data: {
      users: user.id,
    },
  });

  return {
    user,
    profile,
    message: 'User created successfully',
  };
};
