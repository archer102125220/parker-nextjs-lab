import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const SwitchButtonTestClient = dynamic(() => import('@/components/Demo/SwitchButtonTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SwitchButton 開關組件測試',
    description: '展示開關按鈕的各種用法和狀態'
  };
}

export default function SwitchButtonPage() {
  return (
    <div className={style.switch_button_test_page}>
      <GTMScnOpen />
      <SwitchButtonTestClient />
    </div>
  );
}
