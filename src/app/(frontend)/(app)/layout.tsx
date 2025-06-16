import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getMeUser } from '@/utilities/getMeUser';
import type { Metadata } from 'next';
import { api, HydrateClient } from '@/trpc/server';
import RefreshToken from '@/components/RefreshToken/RefreshToken';

export function generateMetadata(): Metadata {
  return {
    title: `TeamHub`,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await getMeUser({
    nullUserRedirect: '/login',
  });

  void api.me.getMe.prefetch();
  void api.me.getTeams.prefetch();
  void api.me.getProfile.prefetch();
  void api.me.getCertificates.prefetch();
  void api.global.getLevels.prefetch();
  void api.global.getJobTitles.prefetch();

  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      <RefreshToken />
    </HydrateClient>
  );
}
