import type { AccessArgs } from 'payload';
import type { User } from '@/payload-types';

type isAdmin = (args: AccessArgs<User>) => boolean;

export const isAdminRole: isAdmin = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'));
};
