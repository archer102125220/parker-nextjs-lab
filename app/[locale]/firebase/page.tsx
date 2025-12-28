import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import { DefaultLayout } from '@/layout/default';

import style from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.firebase');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle')
  };
}

// Feature keys
const FIREBASE_FEATURE_KEYS = ['fcm', 'auth', 'pwa', 'sw'] as const;

// Demo 配置
const FIREBASE_DEMOS = [
  { href: '/firebase/cloud-messaging', demoKey: 'cloudMessaging' }
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

async function FirebasePage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);

  const nonce = (await headers()).get('x-nonce') || '';
  const t = await getTranslations('pages.firebase');

  return (
    <DefaultLayout nonce={nonce}>
      <main className={style.firebase_page}>
        <GTMScnOpen />

        {/* Hero Section */}
        <section className={style['firebase_page-hero']}>
          <span className={style['firebase_page-hero-icon']}>🔥</span>
          <h1 className={style['firebase_page-hero-title']}>{t('heroTitle')}</h1>
          <p className={style['firebase_page-hero-subtitle']}>
            {t('heroSubtitle')}
          </p>
        </section>

        {/* Description */}
        <div className={style['firebase_page-content']}>
          <p className={style['firebase_page-content-text']}>
            {t.rich('description1', {
              link: () => (
                <a
                  href="https://resume-web-orpin.vercel.app/portfolio/firebase-admin"
                  target="_blank"
                  rel="noopener"
                  className={style['firebase_page-content-link']}
                >
                  {t('resumeLink')}
                </a>
              )
            })}
          </p>
          <p className={style['firebase_page-content-text']}>
            {t('description2')}
          </p>
        </div>

        {/* Demo Links */}
        <nav className={style['firebase_page-link_list']}>
          {FIREBASE_DEMOS.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className={style['firebase_page-link_list-link']}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {t(`demos.${demo.demoKey}.label`)}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {t(`demos.${demo.demoKey}.description`)}
              </span>
            </Link>
          ))}
        </nav>

        {/* Feature List */}
        <div className={style['firebase_page-feature_list']}>
          {FIREBASE_FEATURE_KEYS.map((featureKey) => (
            <div key={featureKey} className={style['firebase_page-feature_list-item']}>
              <span className={style['firebase_page-feature_list-item-text']}>
                {t(`features.${featureKey}`)}
              </span>
            </div>
          ))}
        </div>
      </main>
    </DefaultLayout>
  );
}

export default FirebasePage;
