'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Map,
  Settings,
  User,
  UsersRound,
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
import { getMeUser } from '@/utilities/getMeUser';
import { NavTeamActions } from './nav-team-action';

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
      name: 'Settings',
      url: '#',
      icon: Settings,
    },
    {
      name: 'Teams',
      url: '#',
      icon: Map,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { data: userProfile } = useSuspenseQuery({
    queryKey: ['me'],
    queryFn: async () => await getMeUser(),
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
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
