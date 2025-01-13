import { Profile } from '@/payload-types';

export const getAvatarFallback = (profile: Profile): string => {
  const { firstName, lastName } = profile;

  if (!firstName || !lastName) {
    return 'AV';
  }

  return `${firstName[0]}${lastName[0]}`;
};
