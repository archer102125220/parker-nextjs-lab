import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SocketTestIndex = dynamic(
  () => import('@/components/Demo/SocketTestIndex'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Socket 測試列表',
    description: '紀錄原生 WebSocket 以及由 socket.io 實作的結果'
  };
}

export default function SocketTestPage() {
  return (
    <section className={styles.socket_test_page}>
      <SocketTestIndex />
    </section>
  );
}
