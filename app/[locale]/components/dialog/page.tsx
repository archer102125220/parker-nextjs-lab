import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));
const DialogDemo = dynamic(() => import('./DialogDemo'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dialog 元件演示',
    description: 'Dialog 元件演示'
  };
}

export function DialogDemoPage(): ReactNode {
  return (
    <main>
      <GTMScnOpen />
      <h1>Dialog 元件演示</h1>
      <DialogDemo />
    </main>
  );
}

export default DialogDemoPage;
