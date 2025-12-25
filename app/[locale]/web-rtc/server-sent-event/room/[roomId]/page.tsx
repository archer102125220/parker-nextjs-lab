import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const WebRTCSSERoom = dynamic(
  () => import('@/components/Demo/WebRTCSSERoom'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebRTC 視訊聊天室 (SSE)',
    description: '配合 Server-Sent Events 及 Upstash Redis 實作'
  };
}

export default function WebRTCSSERoomPage() {
  return (
    <section className={style.web_rtc_sse_room_page}>
      <WebRTCSSERoom />
    </section>
  );
}
