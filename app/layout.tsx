import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import '@/app/global.scss';

interface RootLayoutProps {
  children: ReactNode;
}

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
export const viewport: Viewport = {
  themeColor: '#FFFFFF'
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return children;
}
