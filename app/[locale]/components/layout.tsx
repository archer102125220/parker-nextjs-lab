import type { ReactNode } from 'react';
import { headers } from 'next/headers';

import { DefaultLayout } from '@/layout/default';

interface ComponentsLayoutProps {
  children: ReactNode;
}

async function ComponentsLayout(
  props: Readonly<ComponentsLayoutProps>
): Promise<ReactNode> {
  const { children } = props;
  const headersData = await headers();
  const nonce = headersData.get('x-nonce') || '';

  // 這裡的 layout 會被 app/[locale]/layout.tsx 的 layout 包覆
  return <DefaultLayout nonce={nonce}>{children}</DefaultLayout>;
}

export default ComponentsLayout;
