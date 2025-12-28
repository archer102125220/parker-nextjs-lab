import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import styles from './page.module.scss';

const YoutubeTestClient = dynamic(() => import('@/components/Demo/YoutubeTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.youtube');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function YoutubeTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className={styles.youtube_test_page}>
      <GTMScnOpen />
      <YoutubeTestClient />
    </section>
  );
}
