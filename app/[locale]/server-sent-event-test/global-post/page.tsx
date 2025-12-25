import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SSEGlobalPost = dynamic(() => import('@/components/Demo/SSEGlobalPost'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SSE Post 全域測試',
    description: '使用 POST 方法的全域 Server-Sent Events'
  };
}

export default function SSEGlobalPostPage() {
  return (
    <section className={styles.sse_global_post_page}>
      <SSEGlobalPost />
    </section>
  );
}
