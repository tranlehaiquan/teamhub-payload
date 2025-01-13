import { Profile } from '@/payload-types';
import { getTeams } from '@/services/teams';
import { getUsers } from '@/services/users';
import { getMeUser } from '@/utilities/getMeUser';
import { queryOptions } from '@tanstack/react-query';

export const meQuery = queryOptions({
  queryKey: ['me'],
  queryFn: () => getMeUser(),
});

export const userProfileQuery = queryOptions({
  queryKey: ['user-profile'],
  queryFn: async () => {
    const me = await getMeUser();
    return me.user.profile as Profile;
  },
});

export const getTeamsQuery = queryOptions({
  queryKey: ['teams'],
  queryFn: getTeams,
});

export const getUsersQuery = queryOptions({
  queryKey: ['users'],
  queryFn: getUsers,
});
