import type { ReactNode } from 'react';

// import { getMessages } from 'next-intl/server';
// import type { Messages } from 'next-intl';
// import { useMessages } from 'next-intl';
import { ThemeProvider } from '@mui/material/styles';

import {
  theme as defaultTheme
  //  createTheme
} from '@/styles/theme';

interface MuiThemeProviderProps {
  children: ReactNode;
}
export function MuiThemeProvider(
  props: MuiThemeProviderProps
): ReactNode {
  const { children } = props;

  // const messages: Messages =
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   typeof window === 'object' ? useMessages() : await getMessages();
  // const theme =
  // typeof window === 'object' ? createTheme(messages) : defaultTheme;

  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
}

export default MuiThemeProvider;
