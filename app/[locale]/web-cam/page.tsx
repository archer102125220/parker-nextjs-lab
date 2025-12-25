import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const WebCamTest = dynamic(() => import('@/components/Demo/WebCamTest'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebCam 網路攝影機測試',
    description: '展示網路攝影機串流和 Canvas 繪製功能'
  };
}

export default function WebCamPage() {
  return (
    <section className={style.web_cam_page}>
      <WebCamTest />
    </section>
  );
}
