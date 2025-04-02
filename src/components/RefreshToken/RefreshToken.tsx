'use client';
import { refreshToken } from '@/services/users';
import { api } from '@/trpc/react';
import { useEffect } from 'react';

const RefreshToken = () => {
  const [me] = api.me.getMe.useSuspenseQuery();

  useEffect(() => {
    if (me.user) {
      refreshToken();
    }
  }, [me]);

  return null;
};

export default RefreshToken;
