import { User } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { ResultQuery } from './rest-types';
import { customFetch } from '@/utilities/customFetch';

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

  return res;
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

// forgot password
export const forgotPassword = async ({ email }) => {
  const url = `${BASE_URL}/api/users/forgot-password`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message);
  }

  return json;
};

// reset password after forgot
export const resetPasswordAfterForgot = async ({ password, confirmPassword, token }) => {
  const url = `${BASE_URL}/api/users/reset-password`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password,
      'confirm-password': confirmPassword,
      token,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message);
  }

  return json;
};

export const getUsers = async () => {
  const url = `${BASE_URL}/api/users`;
  const res = await customFetch(url);
  const json = await res.json();
  return json as ResultQuery<User>;
};
