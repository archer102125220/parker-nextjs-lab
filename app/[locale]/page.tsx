import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import { DefaultLayout } from '@/layout/default';

import styles from './page.module.scss';

export const revalidate = 86400;
// 將未列在 generateStaticParams 內的語系 (例如 /fr) 直接回傳 404 Not Found。
// 這樣可防止 Next.js 進入 SSR 浪費伺服器資源去渲染不受支援的語系，作為白名單防呆機制。
export const dynamicParams = false;
// 雖然頁面內呼叫了 headers() 會導致 Next.js 將此頁強制轉為 SSR（無法在 build 時產出純靜態 HTML），
// 但強烈建議保留此函式，以便提供 Next.js 路由系統和 next-intl 合法的語系參數列表，
// 確保 i18n 底層運作正常，同時替未來的 Partial Prerendering (PPR) 架構鋪路。
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

// 連結配置 (使用 translation keys)
const LINK_SECTIONS = [
  {
    titleKey: 'sections.customComponents',
    links: [
      {
        href: '/components',
        labelKey: 'links.components',
        descKey: 'links.componentsDesc',
        icon: '📦'
      },
      {
        href: '/css-drawing',
        labelKey: 'links.cssDrawing',
        descKey: 'links.cssDrawingDesc',
        icon: '✏️'
      },
      {
        href: '/directive-effects',
        labelKey: 'links.directiveEffects',
        descKey: 'links.directiveEffectsDesc',
        icon: '✨'
      },
      {
        href: '/components/ripples-background',
        labelKey: 'links.ripplesBackground',
        descKey: 'links.ripplesBackgroundDesc',
        icon: '🌊'
      },
      {
        href: '/krpano-demo',
        labelKey: 'links.krpano',
        descKey: 'links.krpanoDesc',
        icon: '🌐'
      }
    ]
  },
  {
    titleKey: 'sections.realtime',
    links: [
      {
        href: '/web-rtc',
        labelKey: 'links.webRTC',
        descKey: 'links.webRTCDesc',
        icon: '📹'
      },
      {
        href: '/socket-test',
        labelKey: 'links.socketIO',
        descKey: 'links.socketIODesc',
        icon: '🔗'
      },
      {
        href: '/server-sent-event-test',
        labelKey: 'links.sse',
        descKey: 'links.sseDesc',
        icon: '📡'
      }
    ]
  },
  {
    titleKey: 'sections.aiDevice',
    links: [
      {
        href: '/face-swap',
        labelKey: 'links.faceSwap',
        descKey: 'links.faceSwapDesc',
        icon: '🎭'
      },
      {
        href: '/web-cam',
        labelKey: 'links.webCam',
        descKey: 'links.webCamDesc',
        icon: '📷'
      },
      {
        href: '/web-authn',
        labelKey: 'links.webAuthn',
        descKey: 'links.webAuthnDesc',
        icon: '🔐'
      }
    ]
  },
  {
    titleKey: 'sections.devTools',
    links: [
      {
        href: '/firebase',
        labelKey: 'links.firebase',
        descKey: 'links.firebaseDesc',
        icon: '🔥'
      },
      {
        href: '/indexeddb-demo',
        labelKey: 'links.indexedDB',
        descKey: 'links.indexedDBDesc',
        icon: '💾'
      },
      {
        href: '/hooks-test',
        labelKey: 'links.hooks',
        descKey: 'links.hooksDesc',
        icon: '🪝'
      },
      {
        href: '/route',
        labelKey: 'links.route',
        descKey: 'links.routeDesc',
        icon: '🛤️'
      },
      {
        href: '/about',
        labelKey: 'links.about',
        descKey: 'links.aboutDesc',
        icon: 'ℹ️'
      }
    ]
  },
  {
    titleKey: 'sections.knowledgeBase',
    links: [
      {
        href: '/notes',
        labelKey: 'links.notes',
        descKey: 'links.notesDesc',
        icon: '📝'
      }
    ]
  }
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};


async function HomePage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;

  // Enable static rendering - CRITICAL for next-intl 4.x
  setRequestLocale(locale);

  const nonce = (await headers()).get('x-nonce') || '';
  const t = await getTranslations('pages.home');

  return (
    <DefaultLayout nonce={nonce}>
      <main className={styles.home_page}>
        <GTMScnOpen />

        {/* Hero Section */}
        <section className={styles['home_page-hero']}>
          <div className={styles['home_page-hero-title']}>
            <Image
              src="/img/icon/Next.jsLab.v.03.svg"
              alt="Next.js Lab"
              width={80}
              height={80}
              priority
            />
            <h1 className={styles['home_page-hero-title-text']}>
              {t('heroTitle')}
            </h1>
          </div>
          <p className={styles['home_page-hero-subtitle']}>
            {t('heroSubtitle')}
          </p>
        </section>

        {/* Link Sections */}
        {LINK_SECTIONS.map((section) => (
          <section key={section.titleKey}>
            <h2 className={styles['home_page-section-title']}>
              {t(section.titleKey)}
            </h2>
            <div className={styles['home_page-section-grid']}>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles['home_page-card']}
                >
                  <span className={styles['home_page-card-icon']}>
                    {link.icon}
                  </span>
                  <h3 className={styles['home_page-card-title']}>
                    {t(link.labelKey)}
                  </h3>
                  <p className={styles['home_page-card-description']}>
                    {t(link.descKey)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </DefaultLayout>
  );
}

export default HomePage;
