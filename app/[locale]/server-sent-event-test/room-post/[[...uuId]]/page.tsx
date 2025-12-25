import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SSERoomPost = dynamic(() => import('@/components/Demo/SSERoomPost'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SSE 房間測試 (POST)',
    description: '依照 route param 分組的 POST SSE'
  };
}

export default function SSETestRoomPostPage() {
  return (
    <section className={styles.sse_room_post_page}>
      <SSERoomPost />
    </section>
  );
}
