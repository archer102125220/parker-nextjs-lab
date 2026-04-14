import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

import styles from './page.module.scss';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.animation');
  return {
    title: t('hero.title'),
    description: t('hero.description')
  };
}

interface DemoItem {
  to: string;
  emoji: string;
  label: string;
  description: string;
}

type Props = {
  params: Promise<{ locale: string }>;
};

async function AnimationPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;

  // Enable static rendering - CRITICAL for next-intl 4.x
  setRequestLocale(locale);

  const t = await getTranslations('pages.animation');

  const demoItems: DemoItem[] = [
    {
      to: '/animation/enter-label',
      emoji: '✍️',
      label: t('demos.enter_label.label'),
      description: t('demos.enter_label.description')
    },
    {
      to: '/animation/ripples-background',
      emoji: '🌊',
      label: t('demos.ripples.label'),
      description: t('demos.ripples.description')
    },
    {
      to: '/animation/triangle-anime-test',
      emoji: '🔺',
      label: t('demos.triangle_anime.label'),
      description: t('demos.triangle_anime.description')
    },
    {
      to: '/animation/waving-image',
      emoji: '🖼️',
      label: t('demos.waving_image.label'),
      description: t('demos.waving_image.description')
    }
  ];

  return (
    <div className={styles.animation_page}>
      <GTMScnOpen />

      {/* Hero Section */}
      <section className={styles['animation_page-hero']}>
        <div className={styles['animation_page-hero-background']}>
          <div className={styles['animation_page-hero-background-overlay']} />
          <div className={styles['animation_page-hero-background-particles']}>
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i + 1}
                className={styles['animation_page-hero-background-particles-dot']}
              />
            ))}
          </div>
        </div>

        <div className={styles['animation_page-hero-content']}>
          <div className={styles['animation_page-hero-content-badge']}>
            {t('badge')}
          </div>
          <h1 className={styles['animation_page-hero-content-title']}>
            {t('hero.title')}
          </h1>
          <p className={styles['animation_page-hero-content-subtitle']}>
            {t('hero.subtitle')}
          </p>
          <p className={styles['animation_page-hero-content-description']}>
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles['animation_page-intro']}>
        <div className={styles['animation_page-section-container']}>
          <p className={styles['animation_page-intro-text']}>
            {t('intro.text')}
          </p>
        </div>
      </section>

      {/* Animation Demos Grid */}
      <section className={styles['animation_page-demos']}>
        <div className={styles['animation_page-section-container']}>
          <h2 className={styles['animation_page-section-title']}>
            {t('demos.title')}
          </h2>
          <div className={styles['animation_page-grid']}>
            {demoItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={styles['animation_page-grid-card']}
              >
                <div className={styles['animation_page-grid-card-icon-wrap']}>
                  <span className={styles['animation_page-grid-card-icon-wrap-emoji']}>
                    {item.emoji}
                  </span>
                </div>
                <div className={styles['animation_page-grid-card-body']}>
                  <h3 className={styles['animation_page-grid-card-body-title']}>
                    {item.label}
                  </h3>
                  <p className={styles['animation_page-grid-card-body-description']}>
                    {item.description}
                  </p>
                </div>
                <div className={styles['animation_page-grid-card-arrow']}>›</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AnimationPage;
