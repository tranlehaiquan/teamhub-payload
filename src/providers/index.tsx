import React from 'react';

import { HeaderThemeProvider } from './HeaderTheme';
import { ThemeProvider } from './Theme';
import { TRPCReactProvider } from '@/trpc/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <TRPCReactProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </TRPCReactProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  );
};
