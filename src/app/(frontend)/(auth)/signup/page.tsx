import React from 'react';
import SignupForm from './SignupForm';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: `Sign up - TeamHub`,
  };
}

const PageSignup = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  );
};

export default PageSignup;
