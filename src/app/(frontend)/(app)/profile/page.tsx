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
import ProfileSection from './ProfileSection';
import UserSkills from './UserSkills/UserSkills';
import CertificatesSection from './UserCertificates/CertificatesSection';
import TrainingsSection from './TrainingsSection';
import { api, HydrateClient } from '@/trpc/server';

const Profile: React.FC = async () => {
  void api.skill.getSkills.prefetch({
    page: 1,
    limit: 50,
  });

  void api.category.getCategories.prefetch({});
  void api.me.userSkill.prefetch();
  void api.me.getProfile.prefetch();

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
    </HydrateClient>
  );
};

export default Profile;
