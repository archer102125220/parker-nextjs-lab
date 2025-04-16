import { getMessages } from 'next-intl/server';
import { useMessages } from 'next-intl';
import { ThemeProvider } from '@mui/material/styles';

import { theme as defaultTheme, createTheme } from '@/styles/theme';

interface MuiThemeProviderProps {
  children: React.ReactNode;
}
export default async function MuiThemeProvider({
  children
}: MuiThemeProviderProps) {
  const messages =
    typeof window === 'object' ? useMessages() : await getMessages();
  const theme =
    typeof window === 'object' ? createTheme(messages) : defaultTheme;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
