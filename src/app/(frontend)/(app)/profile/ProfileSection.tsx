'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/UserProfile';
import { Media } from '@/payload-types';
import { meQuery, userProfileQuery } from '@/tanQueries';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { Edit } from 'lucide-react';
import Link from 'next/link';

const ProfileSection: React.FC = () => {
  const { data: userProfile } = useSuspenseQuery(userProfileQuery);
  const { data: me } = useSuspenseQuery(meQuery);

  return (
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
  );
};

export default ProfileSection;
