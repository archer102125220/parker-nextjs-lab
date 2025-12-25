import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SocketIoTest = dynamic(
  () => import('@/components/Demo/SocketIoTest'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Socket.IO 測試',
    description: '前後端皆由 socket.io 做處理'
  };
}

export default function SocketIoPage() {
  return (
    <section className={styles.socket_io_page}>
      <SocketIoTest />
    </section>
  );
}
