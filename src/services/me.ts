import { User } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { customFetch } from '@/utilities/customFetch';

const BASE_URL = getClientSideURL();

export const getMeUserClient = async () => {
  const meUserReq = await customFetch(`${BASE_URL}/api/users/me`);
  const {
    user,
    token,
  }: {
    user: User;
    token: string;
  } = await meUserReq.json();

  return {
    user,
    token,
  };
};
