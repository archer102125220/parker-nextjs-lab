import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SSETestIndex = dynamic(() => import('@/components/Demo/SSETestIndex'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Server-Sent Events 測試列表',
    description: '測試全域及依照 route param 做分組的 Server-Sent Event'
  };
}

export default function ServerSentEventTestPage() {
  return (
    <section className={styles.sse_test_page}>
      <SSETestIndex />
    </section>
  );
}
