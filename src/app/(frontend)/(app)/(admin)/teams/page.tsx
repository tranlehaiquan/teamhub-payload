import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import DialogNewTeam from './DialogNewTeam';
import TeamsTable from './TeamsTable';
import { api, HydrateClient } from '@/trpc/server';
import { PlusIcon } from 'lucide-react';

const PageTeams = async () => {
  void api.team.getTeams.prefetch();

  return (
    <HydrateClient>
      <div>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">TeamHub</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Teams</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-2">Teams</h1>
            <DialogNewTeam>
              <Button variant={'outline'} size={'sm'}>
                <PlusIcon />
                Create Team
              </Button>
            </DialogNewTeam>
          </div>

          <div className="my-4">
            <TeamsTable />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default PageTeams;
