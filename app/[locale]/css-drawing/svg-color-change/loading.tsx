import { headers } from 'next/headers';

import { PageLoading } from '@/components/PageLoading';

export default async function SvgColorChangeLoading() {
  const nonce = (await headers()).get('x-nonce') || '';

  // Or a custom loading skeleton component
  // return <p>Loading...</p>;
  return <PageLoading loading={true} nonce={nonce} />;
}
