import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Roboto } from 'next/font/google';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { zhTW, enUS } from 'date-fns/locale';

import { routing } from '@/i18n/routing';

import { Head as LayoutHead } from '@/components/Layout/Head';
import { Body as LayoutBody } from '@/components/Layout/Body';

import { PolyfillEvent } from '@/components/PolyfillEvent';

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

  const headersData = await headers();
  const nonce = headersData.get('x-nonce') || '';

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering - CRITICAL for next-intl 4.x
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} className={roboto.variable}>
      <PolyfillEvent />
      <LayoutHead nonce={nonce} />
      <LayoutBody params={params} locale={locale} messages={messages} nonce={nonce}>
        {children}
      </LayoutBody>
    </html>
  );
}

export default LocaleLayout;
