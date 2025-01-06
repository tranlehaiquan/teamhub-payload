import { getQueryClient } from '@/providers/QueryProvider/makeQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import UserProfile from './UserProfile';
import { getMeUser } from '@/utilities/getMeUser';

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: () => getMeUser(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile />
    </HydrationBoundary>
  );
};

export default Page;
