import { PageLoading } from '@/components/PageLoading';

export default function Loading() {
  // Or a custom loading skeleton component
  // return <p>Loading...</p>;
  return <PageLoading loading={true} />;
}
