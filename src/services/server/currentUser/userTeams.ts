'use server';
import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const getUserTeams = async () => {
  const me = await getMeUser();
  const userId = me.user.id;

  const payload = await getPayloadFromConfig();

  // all teams user is owner
  const teamsOwned = await payload.find({
    collection: 'teams',
    where: {
      owner: {
        equals: userId,
      },
    },
  });

  return {
    teamsOwned,
  };
};
