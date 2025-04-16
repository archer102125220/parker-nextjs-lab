import { ReactNode } from 'react';

import { getMessages } from 'next-intl/server';
import { useMessages } from 'next-intl';
import type { Messages } from 'next-intl';
import { ThemeProvider } from '@mui/material/styles';

import { theme as defaultTheme, createTheme } from '@/styles/theme';

interface MuiThemeProviderProps {
  children: ReactNode;
}
export default async function MuiThemeProvider(props: MuiThemeProviderProps) {
  const { children } = props;

  const messages: Messages =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    typeof window === 'object' ? useMessages() : await getMessages();
  const theme =
    typeof window === 'object' ? createTheme(messages) : defaultTheme;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
