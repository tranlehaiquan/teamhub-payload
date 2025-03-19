'use client';
import * as React from 'react';
import { Map, Users, UserRoundPenIcon, BookUserIcon } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavAdmin } from '@/components/nav-admin';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { NavTeamActions } from './nav-team-action';
import { api } from '@/trpc/react';
import { SideBarModeToggle } from '@/providers/NextTheme/theme-toggle';

const data = {
  main: [
    {
      title: 'My Profile',
      url: '/profile',
      icon: BookUserIcon,
    },
    {
      title: 'Account',
      url: '/account',
      icon: UserRoundPenIcon,
    },
  ],
  admins: [
    {
      name: 'Users',
      url: '/users',
      icon: Users,
    },
    {
      name: 'Teams',
      url: '/teams',
      icon: Map,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  const [{ user }] = api.me.getMe.useSuspenseQuery();
  const [teams] = api.me.getTeams.useSuspenseQuery();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.main} />
        <NavTeamActions items={teams} />
        {user.roles?.includes('admin') && <NavAdmin projects={data.admins} />}
      </SidebarContent>

      <SidebarFooter>
        <SideBarModeToggle />
        <React.Suspense fallback="loading...">
          <NavUser user={user} />
        </React.Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
