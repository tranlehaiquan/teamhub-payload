'use server';
import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const createUserCertificate = async (data) => {
  const me = await getMeUser();
  const userId = me.user.id;
  const payload = await getPayloadFromConfig();

  const certificate = await payload.create({
    collection: 'certificates',
    data: {
      ...data,
      user: userId,
    },
  });

  return certificate;
};
