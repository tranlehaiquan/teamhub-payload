import { getMeUser } from '@/utilities/getMeUser';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';

export const getUserCertificates = async () => {
  const me = await getMeUser();
  const userId = me.user.id;
  const payload = await getPayloadFromConfig();

  const userCertificates = await payload.find({
    collection: 'certificates',
    where: {
      user: {
        equals: userId,
      },
    },
    populate: {
      users_skills: {
        skill: true,
      },
    },
  });

  return Response.json(userCertificates);
};

export const GET = getUserCertificates;
