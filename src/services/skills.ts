import { Skill, UsersSkill } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { ResultQuery } from './rest-types';
import { customFetch } from '@/utilities/customFetch';
import type { Where } from 'payload';

const BASE_URL = getClientSideURL();

export const getSkills = async ({ page = 1, limit = 10 }) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const url = `${BASE_URL}/api/skills?${params.toString()}`;

  const res = await customFetch(url, {
    credentials: 'include',
  });
  const json = await res.json();
  return json as ResultQuery<Skill>;
};

export const getUserSkillsByUserId = async (userId: number) => {
  const query: Where = {
    user: {
      equals: userId,
    },
  };
  const searchParams = new URLSearchParams({ where: JSON.stringify(query) });
  const url = `${BASE_URL}/api/skills?${searchParams.toString()}`;

  const res = await customFetch(url);
  return (await res.json()) as ResultQuery<UsersSkill>;
};
