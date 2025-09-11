import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import style from '@/app/[locale]/components/drawer/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));
const DrawerDemo = dynamic(() => import('./DrawerDemo'));

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
      <DrawerDemo />
    </main>
  );
}

export default DialogDemoPage;
