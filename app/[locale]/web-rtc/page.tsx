import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const WebRTCIndex = dynamic(() => import('@/components/Demo/WebRTCIndex'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebRTC 測試列表',
    description:
      'WebRTC 的實作測試，主要分為 Socket.IO 和 SSE 兩種 Signaling 方式'
  };
}

export default function WebRTCPage() {
  return (
    <section className={style.web_rtc_page}>
      <WebRTCIndex />
    </section>
  );
}
