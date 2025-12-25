import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const WebRTCSSEEntry = dynamic(
  () => import('@/components/Demo/WebRTCSSEEntry')
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebRTC - Server-Sent Events 實作',
    description: '配合 Server-Sent Events 及 @upstash/redis 實作'
  };
}

export default function WebRTCSSEPage() {
  return <WebRTCSSEEntry />;
}
