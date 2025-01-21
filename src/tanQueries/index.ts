import { Profile } from '@/payload-types';
import { getCategories } from '@/services/categories';
import { getUserCertificates, getUserSkills } from '@/services/server/currentUser/getUserInfo';
import { getSkills } from '@/services/skills';
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

export const getSkillsByOptionsQuery = ({ page = 1, limit = 10 } = {}) => {
  return queryOptions({
    queryKey: ['skills', { page, limit }],
    queryFn: () =>
      getSkills({
        page,
        limit,
      }),
  });
};

export const getSkillsQuery = getSkillsByOptionsQuery({
  page: 1,
  limit: 100,
});

export const getCategoriesQuery = queryOptions({
  queryKey: ['categories'],
  queryFn: getCategories,
});

export const getCurrentUserSkillsQuery = queryOptions({
  queryKey: ['current-user-skills'],
  queryFn: getUserSkills,
});

export const getCurrentUserCertificatesQuery = queryOptions({
  queryKey: ['current-user-certificates'],
  queryFn: getUserCertificates,
});
