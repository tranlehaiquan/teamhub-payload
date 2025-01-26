import React from 'react';

import { HeaderThemeProvider } from './HeaderTheme';
import { ThemeProvider } from './Theme';
import QueryProvider from './QueryProvider/QueryProvider';
import { TRPCReactProvider } from '@/trpc/react';

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <TRPCReactProvider>
          <QueryProvider>{children}</QueryProvider>
        </TRPCReactProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  );
};
