import React from 'react';
import LoginForm from './LoginForm';
import { getMeUser } from '@/utilities/getMeUser';
import { Metadata } from 'next';
import { api } from '@/trpc/server';

export function generateMetadata(): Metadata {
  return {
    title: `Login - TeamHub`,
  };
}

const PageLogin = async () => {
  const hello = await api.post.hello({ text: 'from tRPC 22' });

  await getMeUser({
    validUserRedirect: '/',
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {JSON.stringify(hello)}
        <LoginForm />
      </div>
    </div>
  );
};

export default PageLogin;
