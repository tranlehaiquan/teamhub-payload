import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const getUserSkills = async () => {
  const me = await getMeUser();
  const userId = me.user.id;
  const payload = await getPayloadFromConfig();

  const userSkills = await payload.find({
    collection: 'users_skills',
    where: {
      user: {
        equals: userId,
      },
    },
    populate: {
      skills: {
        name: true,
      },
    },
    depth: 1,
  });

  return Response.json(userSkills);
};

export const GET = getUserSkills;
