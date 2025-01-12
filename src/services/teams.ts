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

  let headers = {};

  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers'); // Dynamically import to avoid errors in the client
    const cookieStore = cookies();
    headers = {
      Cookie: cookieStore.toString(), // Convert cookies to a string if needed
    };
  }

  const res = await fetch(url, {
    headers,
  });
  const json = await res.json();
  return json as ResultQuery<Team>;
};
