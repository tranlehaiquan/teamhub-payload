'use server';

import { Profile } from '@/payload-types';
import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const getCurrentProfile = async () => {
  const payload = await getPayloadFromConfig();
  const me = await getMeUser();
  const profileId = (me.user.profile as Profile).id;

  const profiles = await payload.findByID({
    collection: 'profiles',
    id: profileId,
  });

  return profiles;
};
