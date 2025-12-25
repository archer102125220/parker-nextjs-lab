import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const VirtualScrollerTest = dynamic(
  () => import('@/components/Demo/VirtualScrollerTest'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Virtual Scroller 虛擬滾動測試',
    description: '虛擬滾動技術,只渲染可見區域的項目,大幅提升大量數據的渲染性能'
  };
}

export default function VirtualScrollerTestPage() {
  return (
    <div className={style.virtual_scroller_test_page}>
      <h1>Virtual Scroller 虛擬滾動測試</h1>
      <p className={style['virtual_scroller_test_page-description']}>
        虛擬滾動技術,只渲染可見區域的項目,大幅提升大量數據的渲染性能
      </p>
      <VirtualScrollerTest />
    </div>
  );
}
