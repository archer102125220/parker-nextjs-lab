import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const SelectorTestClient = dynamic(() => import('@/components/Demo/SelectorTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Selector 下拉選單組件測試',
    description: '展示下拉選單的各種用法和自訂功能'
  };
}

export default function SelectorPage() {
  return (
    <div className={style.selector_test_page}>
      <GTMScnOpen />
      <SelectorTestClient />
    </div>
  );
}
