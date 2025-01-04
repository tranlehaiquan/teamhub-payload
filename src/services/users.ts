import { getClientSideURL } from '@/utilities/getURL';

const BASE_URL = getClientSideURL();

export const login = async ({ email, password }: { email: string; password: string }) => {
  const url = `${BASE_URL}/api/users/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const json = await res.json();
  return json;
};

export const logout = async () => {
  const url = `${BASE_URL}/api/users/logout`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await res.json();
  return json;
};

export const signup = async ({ email, password, confirmPassword }) => {
  const url = `${BASE_URL}/api/users`;
  const rest = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      confirmPassword,
    }),
  });

  const json = await rest.json();
  return;
};
