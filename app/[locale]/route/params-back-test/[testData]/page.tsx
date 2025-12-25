import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import '@/app/[locale]/route/params-back-test/params-back-test.scss';

const ParamsBackTestClient = dynamic(() => import('@/components/Demo/ParamsBackTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '路由參數與上一頁測試',
    description: '測試動態路由參數的 push 與 replace 行為'
  };
}

export default function ParamsBackTestPage() {
  return (
    <section className="params_back_test_page">
      <GTMScnOpen />
      <ParamsBackTestClient />
    </section>
  );
}
