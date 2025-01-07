import { getClientSideURL } from '@/utilities/getURL';

const BASE_URL = getClientSideURL();

export const updateProfileById = async (
  id: string | number,
  data: {
    firstName?: string;
    lastName?: string;
  },
) => {
  const response = await fetch(`${BASE_URL}/api/profiles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
};
