'use client';
import { refreshToken } from '@/services/users';
import { useEffect } from 'react';

const RefreshToken = () => {
  useEffect(() => {
    refreshToken();
  }, []);

  return null;
};

export default RefreshToken;
