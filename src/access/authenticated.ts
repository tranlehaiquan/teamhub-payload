import type { AccessArgs } from 'payload';

import type { User } from '@/payload-types';

type isAuthenticated = (args: AccessArgs<User>) => boolean;

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user);
};

export const adminAccess: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'));
};

export const publicAccess: isAuthenticated = () => {
  return true;
};
