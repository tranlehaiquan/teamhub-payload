import OrgChart from './OrgChart';
import { api, HydrateClient } from '@/trpc/server';

export default async function Page() {
  void api.user.getUsers.prefetch({
    page: 1,
    limit: 100,
  });

  return (
    <HydrateClient>
      <OrgChart />
    </HydrateClient>
  );
}
