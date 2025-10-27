import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Roboto } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { zhTW, enUS } from 'date-fns/locale';

import { routing } from '@/i18n/routing';

import DefaultLayout from '@/layout/default';

import { PolyfillEvent } from '@/components/PolyfillEvent';
import { AxiosInit } from '@/components/AxiosInit';
import { ReduxInit } from '@/components/ReduxInit';
import { GAInit } from '@/components/Google/GAInit';
import { GTMInit } from '@/components/Google/GTMInit';
import { FirebaseInit } from '@/components/FirebaseInit';
import MuiThemeProvider from '@/components/MuiThemeProvider';
import { NotificationPermission } from '@/components/NotificationPermission';

interface LocaleLayout {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto'
});

export async function generateMetadata(props: LocaleLayout): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    applicationName: t('systemName'),
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate')
    },
    description: t('description'),
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: t('defaultTitle')
    },
    formatDetection: {
      telephone: false
    },
    openGraph: {
      type: 'website',
      siteName: t('systemName'),
      title: {
        default: t('defaultTitle'),
        template: t('titleTemplate')
      },
      description: t('description')
    },
    twitter: {
      card: 'summary',
      title: {
        default: t('defaultTitle'),
        template: t('titleTemplate')
      },
      description: t('description')
    }
  };
}

async function LocaleLayout(props: Readonly<LocaleLayout>): Promise<ReactNode> {
  const { children, params } = props;

  const nonce = (await headers()).get('x-nonce') || '';
  console.log({ nonce });

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={roboto.variable}>
      <PolyfillEvent />
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        {/*
            https://www.photoroom.com/zh-tw/tools/background-remover
            https://remove-white-background.imageonline.co/cn/
            https://www.freeconvert.com/image-converter
            https://realfavicongenerator.net/
        */}
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
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale}>
          <ReduxInit params={params} nonce={nonce}>
            <AppRouterCacheProvider>
              <MuiThemeProvider>
                <AxiosInit apiBase={process.env.NEXT_PUBLIC_API_BASE} />
                <GAInit
                  gaId={process.env.NEXT_PUBLIC_GA_ID || ''}
                  nonce={nonce}
                />
                <GTMInit
                  gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''}
                  nonce={nonce}
                />
                <FirebaseInit
                  apiKey={process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}
                  authDomain="parker-nextjs-lab.firebaseapp.com"
                  projectId="parker-nextjs-lab"
                  storageBucket="parker-nextjs-lab.firebasestorage.app"
                  messagingSenderId={
                    process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || ''
                  }
                  appId={process.env.NEXT_PUBLIC_APP_ID || ''}
                  measurementId={process.env.NEXT_PUBLIC_GA_ID || ''}
                />
                <Analytics />
                <SpeedInsights />
                <NotificationPermission />
                <DefaultLayout>{children}</DefaultLayout>
              </MuiThemeProvider>
            </AppRouterCacheProvider>
          </ReduxInit>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default LocaleLayout;
