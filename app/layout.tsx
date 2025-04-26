import type { ReactNode } from 'react';
import type { Viewport } from 'next';

import '@/app/global.scss';

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF'
};

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props;

  return children;
}
