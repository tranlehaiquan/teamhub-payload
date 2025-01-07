import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';

export const getPayloadFromConfig = async () => {
  const payload = await getPayload({ config });

  return payload;
};
