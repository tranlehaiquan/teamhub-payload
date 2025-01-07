'use server';

import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const getCurrentProfile = async () => {
  const payload = await getPayloadFromConfig();
  const me = await getMeUser();
  const userId = me.user.id;

  const profiles = await payload.findByID({
    collection: 'profiles',
    id: userId,
  });

  return profiles;
};
