import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const LazyLoadTestClient = dynamic(() => import('@/components/Demo/LazyLoadTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'useLazyLoad Hook 測試',
    description:
      '使用 Intersection Observer API 實作懶載入功能，當圖片進入視窗時才開始載入'
  };
}

export default function LazyLoadTestPage(): React.ReactNode {
  return (
    <section className={style.lazyload_test_page}>
      <GTMScnOpen />
      <LazyLoadTestClient />
    </section>
  );
}
