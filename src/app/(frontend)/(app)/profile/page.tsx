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
import { Card } from '@/components/ui/card';
import ProfileSection from './ProfileSection';
import UserSkills from './UserSkills/UserSkills';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/providers/QueryProvider/makeQueryClient';
import {
  getCategoriesQuery,
  getCurrentUserCertificatesQuery,
  getCurrentUserSkillsQuery,
  getSkillsQuery,
} from '@/tanQueries';
import CertificatesSection from './CertificatesSection';
import TrainingsSection from './TrainingsSection';

const Profile: React.FC = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(getSkillsQuery);
  void queryClient.prefetchQuery(getCategoriesQuery);
  void queryClient.prefetchQuery(getCurrentUserSkillsQuery);
  void queryClient.prefetchQuery(getCurrentUserCertificatesQuery);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
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
                  <BreadcrumbPage>My Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ProfileSection />

          <UserSkills />

          <CertificatesSection />

          <TrainingsSection />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Profile;
