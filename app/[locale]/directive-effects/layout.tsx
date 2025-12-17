import type { ReactNode } from 'react';
import { headers } from 'next/headers';

import { DefaultLayout } from '@/layout/default';

interface DirectiveEffectsLayoutProps {
  children: ReactNode;
}

async function DirectiveEffectsLayout(
  props: Readonly<DirectiveEffectsLayoutProps>
): Promise<ReactNode> {
  const { children } = props;
  const headersData = await headers();
  const nonce = headersData.get('x-nonce') || '';

  return <DefaultLayout nonce={nonce}>{children}</DefaultLayout>;
}

export default DirectiveEffectsLayout;
