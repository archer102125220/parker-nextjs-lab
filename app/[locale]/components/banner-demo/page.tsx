import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const BannerDemoClient = dynamic(() => import('@/components/Demo/BannerDemo'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Banner 輪播組件測試',
    description: '展示 3D 輪播效果、拖曳支援、鍵盤導航和自動播放功能'
  };
}

export default function BannerDemoPage() {
  return (
    <div className={style.banner_demo_page}>
      <GTMScnOpen />
      <h1>Banner 輪播組件測試</h1>
      <p className={style['banner_demo_page-description']}>
        展示 3D 輪播效果、拖曳支援、鍵盤導航和自動播放功能
      </p>
      <BannerDemoClient />
    </div>
  );
}
