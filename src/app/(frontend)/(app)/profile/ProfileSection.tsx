'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/UserProfile';
import { Media } from '@/payload-types';
import {
  getCurrentUserCertificatesQuery,
  getCurrentUserSkillsQuery,
  meQuery,
  userProfileQuery,
} from '@/tanQueries';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { Edit } from 'lucide-react';
import Link from 'next/link';

const ProfileSection: React.FC = () => {
  const { data: userProfile } = useSuspenseQuery(userProfileQuery);
  const { data: me } = useSuspenseQuery(meQuery);
  const {
    data: { docs: skills },
  } = useSuspenseQuery(getCurrentUserSkillsQuery);
  const {
    data: { docs: certificates },
  } = useSuspenseQuery(getCurrentUserCertificatesQuery);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="p-4">
        <p className="mb-2 text-lg">User Profile</p>

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
      </Card>

      <Card className="p-4">
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
            <p className="text-xl font-bold">0</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
