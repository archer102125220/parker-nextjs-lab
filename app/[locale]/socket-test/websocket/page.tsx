import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const WebSocketTest = dynamic(() => import('@/components/Demo/WebSocketTest'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '原生 WebSocket 測試',
    description: '使用原生 WebSocket API 測試'
  };
}

export default function WebSocketPage() {
  return (
    <section className={styles.websocket_page}>
      <WebSocketTest />
    </section>
  );
}
