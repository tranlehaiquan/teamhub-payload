import { Category } from '@/payload-types';
import { getClientSideURL } from '@/utilities/getURL';
import { ResultQuery } from './rest-types';
import { customFetch } from '@/utilities/customFetch';

const BASE_URL = getClientSideURL();

export const getCategories = async () => {
  const url = `${BASE_URL}/api/categories`;

  const res = await customFetch(url, {
    credentials: 'include',
  });
  const json = await res.json();
  return json as ResultQuery<Category>;
};
