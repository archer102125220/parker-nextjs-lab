import { headers } from 'next/headers';

import { DefaultLayout } from '@/layout/default';
import { PageLoading } from '@/components/PageLoading';

export default async function CssDrawingLoading() {
  const nonce = (await headers()).get('x-nonce') || '';

  // Or a custom loading skeleton component
  // return <p>Loading...</p>;
  return (
    <DefaultLayout nonce={nonce}>
      <PageLoading loading={true} nonce={nonce} />
    </DefaultLayout>
  );
}
