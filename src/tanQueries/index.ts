import { getCurrentProfile } from '@/app/(frontend)/(app)/account/actions';
import { getMeUser } from '@/utilities/getMeUser';
import { queryOptions } from '@tanstack/react-query';

export const meQuery = queryOptions({
  queryKey: ['me'],
  queryFn: () => getMeUser(),
});

export const userProfileQuery = queryOptions({
  queryKey: ['user-profile'],
  queryFn: () => getCurrentProfile(),
});
