import { getClientSideURL } from '@/utilities/getURL';
import { User } from '@/payload-types';

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

// TODO: Implement flow signup here later, for now it's just direct create user
// for security reasons, we don't want to expose this to the public
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
      'confirm-password': confirmPassword,
    }),
  });

  const json = await rest.json();
  return json as {
    doc: User;
    message: string;
  };
};
