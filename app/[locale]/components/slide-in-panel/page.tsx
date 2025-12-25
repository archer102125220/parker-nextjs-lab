import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const SlideInPanelTest = dynamic(
  () => import('@/components/Demo/SlideInPanelTest'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SlideInPanel 滑入通知面板測試',
    description: '展示滑入通知面板的各種類型'
  };
}

export default function SlideInPanelPage() {
  return (
    <div className={style.slide_in_panel_test_page}>
      <h1>SlideInPanel 滑入通知面板測試</h1>
      <p className={style['slide_in_panel_test_page-description']}>
        展示滑入通知面板的各種類型
      </p>
      <SlideInPanelTest />
    </div>
  );
}

