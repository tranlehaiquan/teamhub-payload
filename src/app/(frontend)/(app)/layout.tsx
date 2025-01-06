import { getMeUser } from '@/utilities/getMeUser';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: `TeamHub`,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await getMeUser({
    nullUserRedirect: '/login',
  });

  return children;
}
