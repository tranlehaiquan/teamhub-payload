import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { headers } from 'next/headers';

const Page = async () => {
  const headersList = await headers();
  const payload = await getPayload({ config: configPromise });
  const result = await payload.auth({ headers: headersList });

  return (
    <div>
      <h1>Me</h1>
      {JSON.stringify(result.user)}
    </div>
  );
};

export default Page;
