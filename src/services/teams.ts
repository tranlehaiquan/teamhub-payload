import { Team } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { ResultQuery } from './rest-types';

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
  const res = await fetch(url);
  const json = await res.json();
  return json as ResultQuery<Team>;
};
