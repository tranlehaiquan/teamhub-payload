import type React from 'react';

import { TRPCReactProvider } from '@/trpc/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './NextTheme/theme-provider';

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TRPCReactProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </TRPCReactProvider>
    </ThemeProvider>
  );
};
