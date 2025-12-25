import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const WebRTCSocketIOEntry = dynamic(
  () => import('@/components/Demo/WebRTCSocketIOEntry')
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebRTC - Socket.IO 實作',
    description: '配合 Socket.IO 做為 Signaling Server 實作'
  };
}

export default function WebRTCSocketIOPage() {
  return <WebRTCSocketIOEntry />;
}
