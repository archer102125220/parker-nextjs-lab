import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const WangEditorTest = dynamic(
  () => import('@/components/Demo/WangEditorTest')
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.wangEditor');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WangEditorTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.wangEditor');

  return (
    <div className={style.wang_editor_test_page}>
      <h1>{t('title')}</h1>
      <p className={style['wang_editor_test_page-description']}>
        {t('description')}
      </p>
      <WangEditorTest />
    </div>
  );
}
