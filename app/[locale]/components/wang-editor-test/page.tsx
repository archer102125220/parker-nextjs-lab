import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const WangEditorTest = dynamic(
  () => import('@/components/Demo/WangEditorTest')
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WangEditor 富文本編輯器測試',
    description: '展示富文本編輯器的功能'
  };
}

export default function WangEditorTestPage() {
  return (
    <div className={style.wang_editor_test_page}>
      <h1>WangEditor 富文本編輯器測試</h1>
      <p className={style['wang_editor_test_page-description']}>
        展示富文本編輯器的功能
      </p>
      <WangEditorTest />
    </div>
  );
}
