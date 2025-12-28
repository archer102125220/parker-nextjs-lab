import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import styles from './page.module.scss';

const SwiperTest = dynamic(() => import('@/components/Demo/SwiperTest'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.swiper');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SwiperTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.swiper');

  return (
    <section className={styles.swiper_test_page}>
      <h1>{t('title')}</h1>
      <p className={styles['swiper_test_page-description']}>
        {t('description')}
      </p>
      <SwiperTest />
    </section>
  );
}
