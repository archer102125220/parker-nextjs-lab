import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const FrontendApiCacheTest = dynamic(
  () => import('@/components/Demo/FrontendApiCacheTest'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Frontend API Cache Test',
    description: '前端 API 快取測試，展示 PWA 和 Service Worker 快取功能'
  };
}

export default function FrontendApiCacheTestPage() {
  return (
    <section className={style.frontend_api_cache_test_page}>
      <FrontendApiCacheTest />
    </section>
  );
}
