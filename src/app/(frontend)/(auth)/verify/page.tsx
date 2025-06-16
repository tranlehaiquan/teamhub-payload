import { getPayloadFromConfig } from '@/utilities/getPayloadFromConfig';
import type { Metadata } from 'next';
import Link from 'next/link';

export function generateMetadata(): Metadata {
  return {
    title: `Verify signup - TeamHub`,
  };
}

const VerifyEmailFailed = () => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 text-center">
    <div className="flex w-full max-w-sm flex-col gap-6">Failed to verify email</div>
    <Link href="/login">Back to login</Link>
  </div>
);

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const token = (await searchParams).token;
  const payload = await getPayloadFromConfig();

  if (!token) return <VerifyEmailFailed />;

  try {
    const result = await payload.verifyEmail({
      collection: 'users',
      token: String(token),
    });

    if (!result) {
      return <VerifyEmailFailed />;
    }

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6 text-center">
          <p>Successfully verified email</p>
          <Link href="/login">Back to login</Link>
        </div>
      </div>
    );
  } catch {
    return <VerifyEmailFailed />;
  }
};

export default VerifyEmailPage;
