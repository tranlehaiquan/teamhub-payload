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
import UsersTable from './UsersTable';
import DialogNewUser from './DialogNewUser';
import { api, HydrateClient } from '@/trpc/server';

const PageUsers = async () => {
  // TODO: integrate pagination
  // Data table https://ui.shadcn.com/docs/components/data-table
  void api.user.getUsers.prefetch({});

  return (
    <HydrateClient>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="my-4">
          <DialogNewUser>
            <Button>Create User</Button>
          </DialogNewUser>
        </div>

        <UsersTable />
      </div>
    </HydrateClient>
  );
};

export default PageUsers;
