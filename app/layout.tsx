import type { ReactNode } from 'react';
import type { Viewport } from 'next';

import '@/app/global.scss';

interface RootLayoutProps {
  children: ReactNode;
}

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#FFFFFF'
};

function RootLayout(props: Readonly<RootLayoutProps>): ReactNode {
  const { children } = props;

  return children;
}

export default RootLayout;
