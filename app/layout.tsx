import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';

import '@/app/global.scss';

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
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

export const viewport: Viewport = {
  themeColor: '#FFFFFF'
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return children;
}
