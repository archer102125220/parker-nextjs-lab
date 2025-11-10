import type { ReactNode } from 'react';
import { headers } from 'next/headers';

import { FullScreenLayout } from '@/layout/full-screen';

interface RootLayoutProps {
  children: ReactNode;
}

async function RootLayout(
  props: Readonly<RootLayoutProps>
): Promise<ReactNode> {
  const { children } = props;
  const headersData = await headers();
  const nonce = headersData.get('x-nonce') || '';

  return <FullScreenLayout nonce={nonce}>{children}</FullScreenLayout>;
}

export default RootLayout;
