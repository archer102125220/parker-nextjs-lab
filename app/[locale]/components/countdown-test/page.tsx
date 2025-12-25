import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const CountdownTestClient = dynamic(() => import('@/components/Demo/CountdownTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Countdown 倒數計時組件測試',
    description: '展示翻牌動畫效果的倒數/正數計時器'
  };
}

export default function CountdownTestPage() {
  return (
    <div className={style.countdown_test_page}>
      <GTMScnOpen />
      <CountdownTestClient />
    </div>
  );
}
