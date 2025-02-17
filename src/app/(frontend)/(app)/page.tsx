import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';

export default async function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">TeamHub</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="p-4">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-2 text-gray-600">Feel free to explore.</p>

        <p>
          Update your account <Link href="/account">here</Link>.
        </p>
        <p>
          Update your personal skills, plans, certificate <Link href="/profile">here</Link>.
        </p>
      </main>
    </>
  );
}
