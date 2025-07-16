'use client';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserProfile';
import type { Media, Profile } from '@/payload-types';
import type React from 'react';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import SectionCard from '@/components/SectionCard/SectionCard';
import useJobTitleById from '@/hooks/useJobTitleById';

const ProfileSection: React.FC = () => {
  const [me] = api.me.getMe.useSuspenseQuery();
  const userProfile = me.user.profile as Profile;
  const [skills] = api.me.userSkills.useSuspenseQuery();
  const [{ docs: certificates }] = api.me.getCertificates.useSuspenseQuery();
  const [{ docs: trainings }] = api.me.getTrainings.useSuspenseQuery();
  const jobTitle = useJobTitleById(me.user.jobTitle);

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
            <p className="text-sm text-gray-500">{jobTitle?.name}</p>
          </div>

          <Button variant={'outline'} asChild>
            <Link href="/account" className="self-start">
              <Edit size={20} />
              Update Profile
            </Link>
          </Button>
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
