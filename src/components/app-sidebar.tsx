'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Map,
  Users,
  User,
  UserRoundPenIcon,
  UsersRound,
  BookUserIcon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavAdmin } from '@/components/nav-admin';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NavTeamActions } from './nav-team-action';
import { meQuery } from '@/tanQueries';

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
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
  listTeam: [
    {
      title: 'FSD team',
      icon: UsersRound,
      url: '#',
      isActive: true,
      items: [
        {
          title: 'Skills Matrix',
          url: '/skills-matrix',
        },
        {
          title: 'Settings',
          url: '/team-settings',
        },
      ],
    },
    {
      title: 'Marketing team',
      icon: UsersRound,
      url: '#',
      isActive: true,
      items: [
        {
          title: 'Skills Matrix',
          url: '/skills-matrix',
        },
        {
          title: 'Settings',
          url: '/team-settings',
        },
      ],
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
  const { data: userProfile } = useSuspenseQuery(meQuery);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.main} />
        <NavTeamActions items={data.listTeam} />
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
