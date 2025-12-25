import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const QRCodeTestClient = dynamic(() => import('@/components/Demo/QRCodeTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'QRCode 組件測試',
    description: '展示 QR Code 生成器的各種用法'
  };
}

export default function QRCodeTestPage() {
  return (
    <div className={style.qr_code_test_page}>
      <GTMScnOpen />
      <QRCodeTestClient />
    </div>
  );
}
