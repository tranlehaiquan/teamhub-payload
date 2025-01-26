import React from 'react';
import LoginForm from './LoginForm';
import { getMeUser } from '@/utilities/getMeUser';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: `Login - TeamHub`,
  };
}

const PageLogin = async () => {
  await getMeUser({
    validUserRedirect: '/',
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default PageLogin;
