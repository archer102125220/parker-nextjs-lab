import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const RippleTestClient = dynamic(() => import('@/components/Demo/RippleTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ripple Component 測試',
    description: '實作 Material Design 風格的點擊波紋效果'
  };
}

export default function RippleTestPage(): React.ReactNode {
  return (
    <section className={style.ripple_test_page}>
      <GTMScnOpen />
      <RippleTestClient />
    </section>
  );
}
