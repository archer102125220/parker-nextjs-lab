import type { ReactNode } from 'react';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Roboto } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { zhTW, enUS } from 'date-fns/locale';

import { routing } from '@/i18n/routing';
import { makeStore } from '@/store';

import DefaultLayout from '@/layout/default';

import { Providers } from '@/components/Providers';
import MuiThemeProvider from '@/components/MuiThemeProvider';

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

export default async function LocaleLayout(props: Readonly<LocaleLayout>) {
  const { children, params } = props;

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'metadata' });
  const systemName = t('systemName');

  // 在伺服器端創建 store 並設置初始狀態
  const serverStore = makeStore();
  serverStore.dispatch({ type: 'system/setSystemName', payload: systemName });
  const initialState = serverStore.getState();

  return (
    <html lang={locale} className={roboto.variable}>
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
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        <Providers initialState={initialState}>
          <NextIntlClientProvider locale={locale}>
            <AppRouterCacheProvider>
              {/* <MuiThemeProvider>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={locale === 'zh-tw' ? zhTW : enUS}
                >
                  <DefaultLayout>{children}</DefaultLayout>
                </LocalizationProvider>
              </MuiThemeProvider> */}

              <MuiThemeProvider>
                <DefaultLayout>{children}</DefaultLayout>
              </MuiThemeProvider>
            </AppRouterCacheProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
