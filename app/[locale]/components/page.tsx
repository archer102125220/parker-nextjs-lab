import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Link } from '@/i18n/navigation';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

import './page.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '自製組件庫',
    description: '20+ 可重用的 React UI 組件'
  };
}

// 組件連結配置 - 分類並加入描述
const COMPONENT_CATEGORIES = [
  {
    category: '表單元件',
    icon: '📝',
    components: [
      { href: '/components/selector', label: 'Selector', description: '自訂下拉選單組件' },
      { href: '/components/phone-input', label: 'PhoneInput', description: '國際電話號碼輸入' },
      { href: '/components/image-upload-test', label: 'ImageUpload', description: '圖片上傳與預覽' },
      { href: '/components/switch-button', label: 'SwitchButton', description: '開關切換按鈕' }
    ]
  },
  {
    category: '展示元件',
    icon: '🎨',
    components: [
      { href: '/components/banner-demo', label: 'Banner', description: '輪播廣告橫幅' },
      { href: '/components/qr-code-test', label: 'QRCode', description: 'QR Code 生成器' },
      { href: '/components/countdown-test', label: 'Countdown', description: '多格式倒數計時' },
      { href: '/components/skeleton-loader', label: 'SkeletonLoader', description: '載入骨架動畫' }
    ]
  },
  {
    category: '導航元件',
    icon: '🧭',
    components: [
      { href: '/components/tab-test', label: 'Tabs', description: '多功能分頁組件' },
      { href: '/components/slide-in-panel', label: 'SlideInPanel', description: '側邊滑入面板' },
      { href: '/components/dialog', label: 'Dialog', description: '模態對話框' },
      { href: '/components/drawer', label: 'Drawer', description: '抽屜式導航' },
      { href: '/components/go-top', label: 'GoTop', description: '返回頂部按鈕' }
    ]
  },
  {
    category: '滾動元件',
    icon: '📜',
    components: [
      { href: '/components/scroll-fetch', label: 'ScrollFetch', description: '下拉刷新與無限滾動' },
      { href: '/components/virtual-scroller', label: 'VirtualScroller', description: '虛擬滾動列表' },
      { href: '/components/swiper-test', label: 'Swiper', description: '自訂輪播滑塊' },
      { href: '/components/swiper-js', label: 'SwiperJS', description: 'Swiper.js 整合' }
    ]
  },
  {
    category: '富媒體元件',
    icon: '🎬',
    components: [
      { href: '/components/youtube-test', label: 'YouTube', description: 'YouTube 播放器嵌入' },
      { href: '/components/wang-editor-test', label: 'WangEditor', description: '富文本編輯器' },
      { href: '/components/enter-label', label: 'EnterLabel', description: '打字機動畫效果' }
    ]
  }
] as const;

// 計算總組件數
const TOTAL_COMPONENTS = COMPONENT_CATEGORIES.reduce(
  (acc, cat) => acc + cat.components.length,
  0
);

async function ComponentsPage(): Promise<ReactNode> {
  const _nonce = (await headers()).get('x-nonce') || '';

  return (
    <main className="components-page">
      <GTMScnOpen />

      {/* Header */}
      <header className="components-page-header">
        <h1>🎨 組件庫</h1>
        <p className="subtitle">
          {TOTAL_COMPONENTS} 個可重用的 React UI 組件
        </p>
      </header>

      {/* Component Categories */}
      {COMPONENT_CATEGORIES.map((category) => (
        <section key={category.category} style={{ marginBottom: '2.5rem' }}>
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
            {category.category}
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
                  {component.description}
                </p>
                <div className="component-card-footer">
                  <span className="view-demo">查看演示 →</span>
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
          <div className="stat-label">UI 組件</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{COMPONENT_CATEGORIES.length}</div>
          <div className="stat-label">組件分類</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">TypeScript</div>
        </div>
      </div>
    </main>
  );
}

export default ComponentsPage;
