import React from 'react';

import { HeaderThemeProvider } from './HeaderTheme';
import { ThemeProvider } from './Theme';
import QueryProvider from './QueryProvider/QueryProvider';

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  );
};
