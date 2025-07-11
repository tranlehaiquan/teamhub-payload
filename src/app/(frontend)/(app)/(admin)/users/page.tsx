import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { HydrateClient, api } from '@/trpc/server';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import DialogNewUser from './DialogNewUser';
import UsersTable from './UsersTable';

const PageUsers = async () => {
  void api.user.getUsers.prefetch({
    page: 1,
  });

  return (
    <HydrateClient>
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
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-2">Users</h1>
          <DialogNewUser>
            <Button variant={'outline'} size={'sm'}>
              <PlusIcon />
              Create User
            </Button>
          </DialogNewUser>
        </div>

        <React.Suspense
          fallback={
            <div className="space-y-4 mt-4">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          }
        >
          <UsersTable />
        </React.Suspense>
      </div>
    </HydrateClient>
  );
};

export default PageUsers;
