'use server';
import { getMeUser } from '@/utilities/getMeUser';
import { Media, Profile, User } from '@/payload-types';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import z from 'zod';

const schemaChangePassword = z.object({
  currentPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
  newPassword: z.string().min(8, {
    message: 'Password must be at',
  }),
});

// TODO: implement check currentPassword latter
export const updatePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  const validatedFields = schemaChangePassword.safeParse({
    currentPassword,
    newPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const me = await getMeUser();
  const payload = await getPayloadFromConfig();

  const user = me.user;
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      password: newPassword,
    },
  });

  return {
    success: true,
    message: 'Password updated successfully',
  };
};
