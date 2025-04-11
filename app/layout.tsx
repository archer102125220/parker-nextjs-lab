import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@/styles/theme';

import '@/app/global.scss';

interface RootLayoutProps {
  children: React.ReactNode;
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto'
});

const SYSTEM_NAME = "Parker's Next.js lab";
const DEFAULT_TITLE = "Parker's Next.js lab";
const TITLE_TEMPLATE = `%s ${DEFAULT_TITLE}`;
const DESCRIPTION = 'Parker的Next.js實驗室';

export const metadata: Metadata = {
  applicationName: SYSTEM_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE
  },
  description: DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: DEFAULT_TITLE
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: SYSTEM_NAME,
    title: {
      default: DEFAULT_TITLE,
      template: TITLE_TEMPLATE
    },
    description: DESCRIPTION
  },
  twitter: {
    card: 'summary',
    title: {
      default: DEFAULT_TITLE,
      template: TITLE_TEMPLATE
    },
    description: DESCRIPTION
  }
};

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props;

  return (
    <html lang="zh-tw" className={roboto.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <link rel="apple-touch-icon" href="/img/ico/apple-touch-icon.png" />
        <link rel="icon" href="/img/ico/favicon.ico" type="image/x-icon" />
        <link
          rel="shortcut icon"
          href="/img/ico/favicon.ico"
          type="image/x-icon"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
