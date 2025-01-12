import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getQueryClient } from '@/providers/QueryProvider/makeQueryClient';
import { getMeUser } from '@/utilities/getMeUser';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { getCurrentProfile } from './account/actions';
import { meQuery } from '@/tanQueries';

export function generateMetadata(): Metadata {
  return {
    title: `TeamHub`,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await getMeUser({
    nullUserRedirect: '/login',
  });

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(meQuery);
  void queryClient.prefetchQuery({
    queryKey: ['user-profile'],
    queryFn: () => getCurrentProfile(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
