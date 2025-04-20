import type { Metadata } from 'next';
import DialogDemo from './DialogDemo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dialog 元件演示',
    description: 'Dialog 元件演示'
  };
}

export default function DialogDemoPage() {
  return <DialogDemo />;
}
