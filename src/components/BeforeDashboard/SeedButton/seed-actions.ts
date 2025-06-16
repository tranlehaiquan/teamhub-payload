'use server';
import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import { headers } from 'next/headers';
import { type BasePayload, createLocalReq, type PayloadRequest } from 'payload';
import { faker } from '@faker-js/faker';

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
    return { success: false, error: error.message };
  }
};

const randomUsers = Array.from({ length: 50 }, () => ({
  email: faker.internet.email(),
  password: '123qweasd',
  roles: [],
  _verified: true,
}));

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

const levels = [
  {
    id: '67badef6d6bcff5d9b16240a',
    name: 'Novice',
    description: 'Novice',
    level: 1,
    levelColor: '#ffc9c9',
  },

  {
    id: '67badf394b9bc0ca4ddddaa8',
    name: 'Intermediate',
    description: 'Intermediate',
    level: 2,
    levelColor: '#fff085',
  },

  {
    id: '67bae4f1c29fb0e3abe854dd',
    name: 'Advanced',
    description: 'Advanced',
    level: 3,
    levelColor: '#b9f8cf',
  },

  {
    id: '67bae517c29fb0e3abe854df',
    name: 'Expert',
    description: 'Expert',
    level: 4,
    levelColor: '#05df72',
  },
];

const seed = async ({ payload, req }: { payload: BasePayload; req: PayloadRequest }) => {
  payload.logger.info('Seeding database...');
  payload.logger.info(`— Clearing collections and globals...`);
  await payload.updateGlobal({
    slug: 'levels',
    data: {
      items: levels,
    },
  });

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

const seedRandomUsers = async ({ payload, req }: { payload: BasePayload; req: PayloadRequest }) => {
  payload.logger.info('Seeding random users...');
  console.log(randomUsers);
  await Promise.all(
    randomUsers.map((user) => payload.create({ collection: 'users', data: user, req })),
  );
};

export const runSeedRandomUsers = async () => {
  const payload = await getPayloadFromConfig();
  const requestHeaders = await headers();
  const { user } = await payload.auth({ headers: requestHeaders });

  if (!user) {
    throw new Error('User not found');
  }
  const payloadReq = await createLocalReq({ user }, payload);

  try {
    await seedRandomUsers({ payload, req: payloadReq });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const seedRandomJobTitles = async ({
  payload,
  req,
}: {
  payload: BasePayload;
  req: PayloadRequest;
}) => {
  payload.logger.info('Seeding random job titles...');
  const mockJobTitles = Array.from({ length: 50 }, () => ({
    name: faker.person.jobTitle(),
    description: faker.lorem.sentence(),
  }));

  await payload.updateGlobal({
    slug: 'job-titles',
    data: {
      titles: mockJobTitles,
    },
  });
};

export const runSeedRandomJobTitles = async () => {
  const payload = await getPayloadFromConfig();
  const requestHeaders = await headers();
  const { user } = await payload.auth({ headers: requestHeaders });

  if (!user) {
    throw new Error('User not found');
  }
  const payloadReq = await createLocalReq({ user }, payload);

  try {
    await seedRandomJobTitles({ payload, req: payloadReq });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
