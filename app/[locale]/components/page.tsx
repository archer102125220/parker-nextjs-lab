import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

import './page.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.components');
  return {
    title: t('title'),
    description: t('subtitle', { count: 20 })
  };
}

// 組件連結配置 - 使用 translation keys
const COMPONENT_CATEGORIES = [
  {
    categoryKey: 'categories.form',
    icon: '📝',
    components: [
      { href: '/components/selector', label: 'Selector', descKey: 'items.selector' },
      { href: '/components/phone-input', label: 'PhoneInput', descKey: 'items.phoneInput' },
      { href: '/components/image-upload-test', label: 'ImageUpload', descKey: 'items.imageUpload' },
      { href: '/components/switch-button', label: 'SwitchButton', descKey: 'items.switchButton' }
    ]
  },
  {
    categoryKey: 'categories.display',
    icon: '🎨',
    components: [
      { href: '/components/banner-demo', label: 'Banner', descKey: 'items.banner' },
      { href: '/components/qr-code-test', label: 'QRCode', descKey: 'items.qrCode' },
      { href: '/components/countdown-test', label: 'Countdown', descKey: 'items.countdown' },
      { href: '/components/skeleton-loader', label: 'SkeletonLoader', descKey: 'items.skeletonLoader' }
    ]
  },
  {
    categoryKey: 'categories.navigation',
    icon: '🧭',
    components: [
      { href: '/components/tab-test', label: 'Tabs', descKey: 'items.tabs' },
      { href: '/components/slide-in-panel', label: 'SlideInPanel', descKey: 'items.slideInPanel' },
      { href: '/components/dialog', label: 'Dialog', descKey: 'items.dialog' },
      { href: '/components/drawer', label: 'Drawer', descKey: 'items.drawer' },
      { href: '/components/go-top', label: 'GoTop', descKey: 'items.goTop' }
    ]
  },
  {
    categoryKey: 'categories.scroll',
    icon: '📜',
    components: [
      { href: '/components/scroll-fetch', label: 'ScrollFetch', descKey: 'items.scrollFetch' },
      { href: '/components/virtual-scroller', label: 'VirtualScroller', descKey: 'items.virtualScroller' },
      { href: '/components/swiper-test', label: 'Swiper', descKey: 'items.swiper' },
      { href: '/components/swiper-js', label: 'SwiperJS', descKey: 'items.swiperJS' }
    ]
  },
  {
    categoryKey: 'categories.richMedia',
    icon: '🎬',
    components: [
      { href: '/components/youtube-test', label: 'YouTube', descKey: 'items.youtube' },
      { href: '/components/wang-editor-test', label: 'WangEditor', descKey: 'items.wangEditor' },
      { href: '/components/enter-label', label: 'EnterLabel', descKey: 'items.enterLabel' }
    ]
  }
] as const;

// 計算總組件數
const TOTAL_COMPONENTS = COMPONENT_CATEGORIES.reduce(
  (acc, cat) => acc + cat.components.length,
  0
);

type Props = {
  params: Promise<{ locale: string }>;
};

async function ComponentsPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  
  // Enable static rendering - CRITICAL for next-intl 4.x
  setRequestLocale(locale);

  const _nonce = (await headers()).get('x-nonce') || '';
  const t = await getTranslations('pages.components');
  const tCommon = await getTranslations('common');

  return (
    <main className="components-page">
      <GTMScnOpen />

      {/* Header */}
      <header className="components-page-header">
        <h1>{t('title')}</h1>
        <p className="subtitle">
          {t('subtitle', { count: TOTAL_COMPONENTS })}
        </p>
      </header>

      {/* Component Categories */}
      {COMPONENT_CATEGORIES.map((category) => (
        <section key={category.categoryKey} style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: '#333'
            }}
          >
            <span>{category.icon}</span>
            {t(category.categoryKey)}
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 400,
                color: '#888',
                marginLeft: '0.5rem'
              }}
            >
              ({category.components.length})
            </span>
          </h2>

          <div className="components-grid">
            {category.components.map((component) => (
              <Link
                key={component.href}
                href={component.href}
                className="component-card"
              >
                <div className="component-card-header">
                  <h3>{component.label}</h3>
                </div>
                <p className="component-card-description">
                  {t(component.descKey)}
                </p>
                <div className="component-card-footer">
                  <span className="view-demo">{tCommon('viewDemo')}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Stats */}
      <div className="components-page-stats">
        <div className="stat-card">
          <div className="stat-number">{TOTAL_COMPONENTS}</div>
          <div className="stat-label">{t('stats.uiComponents')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{COMPONENT_CATEGORIES.length}</div>
          <div className="stat-label">{t('stats.categories')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">{t('stats.typescript')}</div>
        </div>
      </div>
    </main>
  );
}

export default ComponentsPage;
