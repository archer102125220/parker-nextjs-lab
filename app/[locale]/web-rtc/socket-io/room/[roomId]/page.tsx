import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const WebRTCSocketIORoom = dynamic(
  () => import('@/components/Demo/WebRTCSocketIORoom')
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebRTC 視訊聊天室 (Socket.IO)',
    description: '配合 Socket.IO 做為 Signaling Server 實作'
  };
}

export default function WebRTCSocketIORoomPage() {
  return (
    <section className={style.web_rtc_socket_io_room_page}>
      <WebRTCSocketIORoom />
    </section>
  );
}
