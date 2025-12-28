import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SSETestIndex = dynamic(() => import('@/components/Demo/SSETestIndex'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.sseTest');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ServerSentEventTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className={styles.sse_test_page}>
      <SSETestIndex />
    </section>
  );
}
