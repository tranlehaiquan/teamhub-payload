'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Map,
  Settings,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavAdmin } from '@/components/nav-admin';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getMeUser } from '@/utilities/getMeUser';

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
  navMain: [
    {
      title: 'Links',
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
