'use client';

import * as React from 'react';
import { Map, Users, User, UserRoundPenIcon, BookUserIcon } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavAdmin } from '@/components/nav-admin';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { NavTeamActions } from './nav-team-action';
import { api } from '@/trpc/react';

// This is sample data.
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
  navMain: [
    {
      title: 'Settings',
      icon: User,
      url: '#',
      isActive: true,
      items: [
        {
          title: 'My Profile',
          url: '/profile',
        },
        {
          title: 'Account',
          url: '/account',
        },
      ],
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
  const [userProfile] = api.me.getMe.useSuspenseQuery();
  const [
    {
      teamsOwned: { docs: teamsOwned },
    },
  ] = api.me.getTeams.useSuspenseQuery();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.main} />
        <NavTeamActions items={teamsOwned} />
        {userProfile.user.roles?.includes('admin') && <NavAdmin projects={data.admins} />}
      </SidebarContent>

      <SidebarFooter>
        <React.Suspense fallback="loading...">
          <NavUser user={userProfile.user} />
        </React.Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
