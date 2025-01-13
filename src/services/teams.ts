import { Team } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { ResultQuery } from './rest-types';
import { customFetch } from '@/utilities/customFetch';

const BASE_URL = getClientSideURL();

export const createTeam = async (newTeam: { name: string; owner: number }) => {
  const url = `${BASE_URL}/api/teams`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTeam),
  });

  const json = await res.json();
  return json;
};

export const getTeams = async () => {
  const url = `${BASE_URL}/api/teams`;

  const res = await customFetch(url, {
    credentials: 'include',
  });
  const json = await res.json();
  return json as ResultQuery<Team>;
};
