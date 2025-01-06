'use client';
import { Button } from '@/components/ui/button';
import { logout } from '@/services/users';
import { getMeUser } from '@/utilities/getMeUser';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

const UserProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: userProfile } = useSuspenseQuery({
    queryKey: ['me'],
    queryFn: async () => await getMeUser(),
  });

  const handleLogout = async () => {
    await logout();

    await queryClient.invalidateQueries({
      queryKey: ['me'],
    });
  };

  if (userProfile.user) {
    return (
      <div className="container">
        <h1>Welcome, {userProfile.user.name}</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/login">Go to login</Link>
    </div>
  );
};

export default UserProfile;
