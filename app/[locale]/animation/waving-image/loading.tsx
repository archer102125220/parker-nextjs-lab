import { headers } from 'next/headers';

import { PageLoading } from '@/components/PageLoading';

export default async function Loading() {
  const nonce = (await headers()).get('x-nonce') || '';

  return <PageLoading loading={true} nonce={nonce} />;
}
