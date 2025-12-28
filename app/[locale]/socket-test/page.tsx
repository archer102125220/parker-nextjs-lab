import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SocketTestIndex = dynamic(
  () => import('@/components/Demo/SocketTestIndex')
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.socketTest');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SocketTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className={styles.socket_test_page}>
      <SocketTestIndex />
    </section>
  );
}
