'use client';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Team } from '@/payload-types';
import { usePathname } from 'next/navigation';
import { cn } from '@/utilities/cn';

const TEAM_LINKS = [
  {
    title: 'Skills Matrix',
    url: '/skills-matrix',
  },
  {
    title: 'Settings',
    url: '/settings',
  },
];

export function NavTeamActions({ items }: { items: Team[] }) {
  const pathname = usePathname();
  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teams</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.name} asChild defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.name}>
                  <span>{item.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {TEAM_LINKS?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={`/team/${item.id}${subItem.url}`}
                          className={cn(
                            isActive(`/team/${item.id}${subItem.url}`) &&
                              'bg-primary/10 text-primary font-medium',
                          )}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
