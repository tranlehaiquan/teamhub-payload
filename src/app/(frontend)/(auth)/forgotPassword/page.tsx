import React from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: `Forgot password - TeamHub`,
  };
}

const PageForgotPassword = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default PageForgotPassword;
