import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SSEGlobalGet = dynamic(() => import('@/components/Demo/SSEGlobalGet'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SSE 全域測試 (GET)',
    description: '使用 GET 方法的全域 Server-Sent Events'
  };
}

export default function SSEGlobalGetPage() {
  return (
    <section className={styles.sse_global_get_page}>
      <SSEGlobalGet />
    </section>
  );
}
