import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import '@/app/[locale]/route/query-back-test/query-back-test.scss';

const QueryBackTestClient = dynamic(() => import('@/components/Demo/QueryBackTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '路由 Query 與上一頁測試',
    description: '測試 URL query 參數的 push 與 replace 行為'
  };
}

export default function QueryBackTestPage() {
  return (
    <section className="query_back_test_page">
      <GTMScnOpen />
      <QueryBackTestClient />
    </section>
  );
}
