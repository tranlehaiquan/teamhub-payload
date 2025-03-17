'use client';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserProfile';
import { Media } from '@/payload-types';
import React from 'react';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import SectionCard from '@/components/SectionCard/SectionCard';

const ProfileSection: React.FC = () => {
  const [userProfile] = api.me.getProfile.useSuspenseQuery();
  const [me] = api.me.getMe.useSuspenseQuery();
  const [{ docs: skills }] = api.me.userSkill.useSuspenseQuery();
  const [{ docs: certificates }] = api.me.getCertificates.useSuspenseQuery();
  const [{ docs: trainings }] = api.me.getTrainings.useSuspenseQuery();

  return (
    <div className="grid grid-cols-2 gap-2">
      <SectionCard title="User Profile">
        <div className="flex gap-4">
          <UserAvatar className="w-20 h-20 rounded-full" avatar={userProfile?.avatar as Media} />

          <div className="flex-1">
            <p className="font-bold text-lg">
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p>{me.user.email}</p>
          </div>

          <Link href="/account">
            <Button variant={'outline'}>
              <Edit size={20} />
              Update Profile
            </Button>
          </Link>
        </div>
      </SectionCard>
      <SectionCard>
        <div className="grid grid-cols-3 gap-4 text-center h-full">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-lg">Skills</p>
            <p className="text-xl font-bold">{skills.length}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-lg">Certificates</p>
            <p className="text-xl font-bold">{certificates.length}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-lg">Trainings</p>
            <p className="text-xl font-bold">{trainings.length}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default ProfileSection;
