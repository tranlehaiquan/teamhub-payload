import type { Metadata } from 'next';

import { cn } from 'src/utilities/cn';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type React from 'react';

import { Providers } from '@/providers';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import { Toaster } from '@/components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { getServerSideURL } from '@/utilities/getURL';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
};
