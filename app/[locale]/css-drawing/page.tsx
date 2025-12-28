import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import { DefaultLayout } from '@/layout/default';

import style from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.cssDrawing');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle')
  };
}

// Demo 配置使用 translation keys
const CSS_DEMOS = [
  { href: '/css-drawing/triangle-test', demoKey: 'triangle' },
  { href: '/css-drawing/triangle-full-test', demoKey: 'triangleFull' },
  { href: '/css-drawing/triangle-anime-test', demoKey: 'triangleAnime' },
  { href: '/css-drawing/hexagon-test', demoKey: 'hexagon' },
  { href: '/css-drawing/svg-color-change', demoKey: 'svgColor' }
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

async function CssDrawing({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);

  const headersData = await headers();
  const nonce = headersData.get('x-nonce') || '';
  const t = await getTranslations('pages.cssDrawing');

  return (
    <DefaultLayout nonce={nonce}>
      <main className={style.css_animejs_page}>
        <GTMScnOpen />

        {/* Hero Section */}
        <section className={style['css_animejs_page-hero']}>
          <span className={style['css_animejs_page-hero-icon']}>✏️</span>
          <h1 className={style['css_animejs_page-hero-title']}>{t('heroTitle')}</h1>
          <p className={style['css_animejs_page-hero-subtitle']}>
            {t('heroSubtitle')}
          </p>
        </section>

        {/* Demo Grid */}
        <nav className={style['css_animejs_page-link_list']}>
          {CSS_DEMOS.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className={style['css_animejs_page-link_list-link']}
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
      </main>
    </DefaultLayout>
  );
}

export default CssDrawing;
