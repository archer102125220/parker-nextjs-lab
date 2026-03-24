import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import styles from './page.module.scss';

type Props = {
  params: Promise<{ locale: string }>;
};

const NOTION_ARTICLES = [
  {
    id: 'seoGSC',
    href: 'https://www.notion.so/SEO-GSC-Sitemap-3256dcd96fa28083846ff3d6e90c9248',
    icon: '📄'
  },
  {
    id: 'seoRobots',
    href: 'https://www.notion.so/SEO-Sitemap-Robots-txt-GSC-3186dcd96fa2804d833ae0557de2e465',
    icon: '📝'
  },
  {
    id: 'webAuthn',
    href: 'https://www.notion.so/Web-Authn-6480f13abf224ef59a41571df1531f6a',
    icon: '🔐'
  }
];

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.notes' });

  return {
    title: t('title'),
    description: t('subtitle')
  };
}

async function NotesPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;

  // Enable static rendering - CRITICAL for next-intl 4.x
  setRequestLocale(locale);

  const t = await getTranslations('pages.notes');
  const nonce = (await headers()).get('x-nonce') || '';

  return (
      <main className={styles.notes_page}>
        {/* Hero Section */}
        <section className={styles['notes_page-hero']}>
          <div className={styles['notes_page-hero-title']}>
            <span style={{ fontSize: '3.5rem' }}>📓</span>
            <h1 className={styles['notes_page-hero-title-text']}>
              {t('title')}
            </h1>
          </div>
          <p className={styles['notes_page-hero-subtitle']}>
            {t('subtitle')}
          </p>
        </section>

        {/* Articles List */}
        <section className={styles['notes_page-list']}>
          {NOTION_ARTICLES.map((article) => (
            <a
              key={article.id}
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['notes_page-card']}
            >
              <span className={styles['notes_page-card-icon']}>
                {article.icon}
              </span>
              <div className={styles['notes_page-card-content']}>
                <h2 className={styles['notes_page-card-title']}>
                  {t(`articles.${article.id}`)}
                </h2>
                <p className={styles['notes_page-card-description']}>
                  Notion • {article.href.split('notion.so/')[1].split('-').slice(0, 3).join(' ')}...
                </p>
              </div>
            </a>
          ))}
        </section>
      </main>
  );
}

export default NotesPage;
