'use client';
import { logout } from '@/services/users';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const LogoutPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    logout().finally(() => {
      queryClient.clear();
      router.push('/login');
    });
  }, [queryClient]);

  return <div>logout please wait...</div>;
};

export default LogoutPage;
