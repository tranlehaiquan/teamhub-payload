import { Team, User, UsersSkill, Certificate } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { customFetch } from '@/utilities/customFetch';
import { PaginatedDocs } from 'payload';

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

export const getUserSkills = async () => {
  const meUserReq = await customFetch(`${BASE_URL}/api/me/userSkills`);
  const userSkills = await meUserReq.json();

  return userSkills as PaginatedDocs<UsersSkill>;
};

export const getUserCertificates = async () => {
  const meUserReq = await customFetch(`${BASE_URL}/api/me/certificates`);
  const userCertificates = await meUserReq.json();

  return userCertificates as PaginatedDocs<Certificate>;
};

export const getUserTeams = async () => {
  const meUserReq = await customFetch(`${BASE_URL}/api/me/userTeams`);
  const userTeams = await meUserReq.json();

  return userTeams as PaginatedDocs<Team>;
};
