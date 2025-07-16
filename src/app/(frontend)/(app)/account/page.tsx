'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import AccountForm from './AccountForm';
import ChangePasswordForm from './ChangePasswordForm';
import { api } from '@/trpc/react';
import UpdateUserForm from './UpdateUserForm';
import { Profile } from '@/payload-types';

const AccountPage: React.FC = () => {
  const [me] = api.me.getMe.useSuspenseQuery();
  const profile = me.user.profile as Profile;

  return (
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
                <BreadcrumbPage>Account</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <AccountForm profile={profile} />
        <UpdateUserForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default AccountPage;
