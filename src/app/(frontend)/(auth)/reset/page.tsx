import type { Metadata } from 'next';
import ResetPasswordForm from './ResetPasswordForm';
import { Suspense } from 'react';

export function generateMetadata(): Metadata {
  return {
    title: `Reset password - TeamHub`,
  };
}

const ResetPasswordPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Suspense fallback={'...loading'}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
