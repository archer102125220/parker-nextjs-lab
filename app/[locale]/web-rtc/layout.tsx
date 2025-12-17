import type { ReactNode } from 'react';
import { headers } from 'next/headers';

import { DefaultLayout } from '@/layout/default';

interface WebRtcLayoutProps {
  children: ReactNode;
}

async function WebRtcLayout(
  props: Readonly<WebRtcLayoutProps>
): Promise<ReactNode> {
  const { children } = props;
  const headersData = await headers();
  const nonce = headersData.get('x-nonce') || '';

  return <DefaultLayout nonce={nonce}>{children}</DefaultLayout>;
}

export default WebRtcLayout;
