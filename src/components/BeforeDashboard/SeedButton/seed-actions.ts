'use server';

import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { headers } from 'next/headers';
import { BasePayload, createLocalReq, PayloadRequest } from 'payload';

export const runSeed = async () => {
  const payload = await getPayloadFromConfig();
  const requestHeaders = await headers();
  const { user } = await payload.auth({ headers: requestHeaders });

  if (!user) {
    throw new Error('User not found');
  }

  const payloadReq = await createLocalReq({ user }, payload);

  try {
    await seed({ payload, req: payloadReq });

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

const users = [
  {
    email: 'admin@gmail.com',
    password: '123qweasd',
    roles: ['admin'],
    _verified: true,
  },
  {
    email: 'quan.tran@metro.digital',
    password: '123qweasd',
    roles: ['admin'],
    _verified: true,
  },
  {
    email: 'hung.thieu@metro.digital',
    password: '123qweasd',
    roles: ['admin'],
    _verified: true,
  },
  {
    email: 'giap.hoang@metro.digital',
    password: '123qweasd',
    roles: ['admin'],
    _verified: true,
  },
  {
    email: 'trung.pham@metro.digital',
    password: '123qweasd',
    roles: ['admin'],
    _verified: true,
  },
];

const categories = [
  {
    title: 'Backend',
  },
  {
    title: 'Frontend',
  },
  {
    title: 'Fullstack',
  },
  {
    title: 'DevOps',
  },
  {
    title: 'Design',
  },
  {
    title: 'Management',
  },
];

const skills = [
  {
    name: 'NodeJS',
    category: 'Backend',
  },
  {
    name: 'ReactJS',
    category: 'Frontend',
  },
  {
    name: 'VueJS',
    category: 'Frontend',
  },
  {
    name: 'Angular',
    category: 'Frontend',
  },
  {
    name: 'Docker',
    category: 'DevOps',
  },
  {
    name: 'Kubernetes',
    category: 'DevOps',
  },
  {
    name: 'Figma',
    category: 'Design',
  },
  {
    name: 'Adobe XD',
    category: 'Design',
  },
  {
    name: 'Sketch',
    category: 'Design',
  },
  {
    name: 'Zeplin',
    category: 'Design',
  },
  {
    name: 'Jira',
    category: 'Management',
  },
  {
    name: 'Trello',
    category: 'Management',
  },
];

const seed = async ({ payload, req }: { payload: BasePayload; req: PayloadRequest }) => {
  payload.logger.info('Seeding database...');
  payload.logger.info(`— Clearing collections and globals...`);
  payload.logger.info(`— Seeding demo author and user...`);
  await Promise.all(
    users.map((user) => payload.create({ collection: 'users', data: user as any, req })),
  );
  payload.logger.info(`— Seeding demo category...`);
  const categoriesResponse = await Promise.all(
    categories.map((category) =>
      payload.create({ collection: 'categories', data: category as any, req }),
    ),
  );
  payload.logger.info(`— Seeding demo skills...`);
  await Promise.all(
    skills.map((skill) => {
      const categoryId = categoriesResponse.find(
        (category) => category.title === skill.category,
      )?.id;
      return payload.create({
        collection: 'skills',
        data: {
          ...skill,
          category: categoryId,
        },
        req,
      });
    }),
  );
};
