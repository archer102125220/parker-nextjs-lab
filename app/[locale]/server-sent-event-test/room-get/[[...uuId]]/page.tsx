import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SSERoomGet = dynamic(() => import('@/components/Demo/SSERoomGet'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SSE 房間測試 (GET)',
    description: '依照 route param 分組的 SSE'
  };
}

export default function SSETestRoomGetPage() {
  return (
    <section className={styles.sse_room_get_page}>
      <SSERoomGet />
    </section>
  );
}
