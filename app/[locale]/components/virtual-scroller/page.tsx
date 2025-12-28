import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const VirtualScrollerTest = dynamic(
  () => import('@/components/Demo/VirtualScrollerTest')
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.virtualScroller');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VirtualScrollerTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.virtualScroller');

  return (
    <div className={style.virtual_scroller_test_page}>
      <h1>{t('title')}</h1>
      <p className={style['virtual_scroller_test_page-description']}>
        {t('description')}
      </p>
      <VirtualScrollerTest />
    </div>
  );
}
