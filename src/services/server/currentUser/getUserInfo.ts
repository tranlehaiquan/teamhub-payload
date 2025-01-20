'use server';
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
    depth: 0,
  });

  return userSkills;
};

export const getUserPlans = async () => {};

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

  return userCertificates;
};

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
