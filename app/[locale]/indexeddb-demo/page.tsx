import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const IndexedDBDemoClient = dynamic(
  () => import('@/components/Demo/IndexedDBDemo')
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.indexedDBDemo');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function IndexedDBDemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={style.indexeddb_demo_page}>
      <IndexedDBDemoClient />
    </div>
  );
}
