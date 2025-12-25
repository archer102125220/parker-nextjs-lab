import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import '@/app/[locale]/offline/offline.scss';

const OfflinePageClient = dynamic(() => import('@/components/Demo/OfflinePageClient'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '離線頁面',
    description: '網路連線中斷時顯示的離線頁面'
  };
}

export default function OfflinePage() {
  return <OfflinePageClient />;
}
