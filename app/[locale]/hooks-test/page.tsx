import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const DemoHooks = dynamic(() => import('@/components/Demo/Hooks'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hooks 測試頁面',
    description: '展示各種自訂 Hooks 的功能'
  };
}

export default function HooksTestPage() {
  return (
    <div className={styles.hooks_test_page}>
      <h1>Hooks 測試頁面</h1>
      <p className={styles['hooks_test_page-description']}>
        展示各種自訂 Hooks 的功能
      </p>
      <DemoHooks />
    </div>
  );
}
