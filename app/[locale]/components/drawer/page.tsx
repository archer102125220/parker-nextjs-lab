import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import DemoDrawer from '@/components/Demo/Drawer';

import style from '@/app/[locale]/components/drawer/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dialog 元件演示',
    description: 'Dialog 元件演示'
  };
}

function DialogDemoPage(): ReactNode {
  return (
    <main className={style.drawer_page}>
      <GTMScnOpen />
      <h1>Drawer 元件演示</h1>
      <DemoDrawer />
    </main>
  );
}

export default DialogDemoPage;
