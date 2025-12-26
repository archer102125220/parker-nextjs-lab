import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import { DefaultLayout } from '@/layout/default';

import styles from './page.module.scss';

// 連結分類配置
const LINK_SECTIONS = [
  {
    title: '🎨 自訂組件',
    links: [
      { href: '/components', label: '組件庫', description: '20+ 可重用 UI 組件', icon: '📦' },
      { href: '/css-drawing', label: 'CSS 繪圖', description: '純 CSS 圖形與動畫', icon: '✏️' },
      { href: '/directive-effects', label: '指令效果', description: '懶載入、波紋效果', icon: '✨' }
    ]
  },
  {
    title: '🔌 即時通訊',
    links: [
      { href: '/web-rtc', label: 'WebRTC 視訊', description: 'P2P 視訊通話', icon: '📹' },
      { href: '/socket-test', label: 'Socket.IO', description: 'WebSocket 即時通訊', icon: '🔗' },
      { href: '/server-sent-event-test', label: 'SSE 測試', description: 'Server-Sent Events', icon: '📡' }
    ]
  },
  {
    title: '🤖 AI & 裝置',
    links: [
      { href: '/face-swap', label: 'AI 換臉', description: 'face-api.js 人臉辨識', icon: '🎭' },
      { href: '/web-cam', label: '相機測試', description: 'MediaDevices API', icon: '📷' },
      { href: '/web-authn', label: 'WebAuthn', description: '生物辨識驗證', icon: '🔐' }
    ]
  },
  {
    title: '🔧 開發工具',
    links: [
      { href: '/firebase', label: 'Firebase', description: '推播、認證整合', icon: '🔥' },
      { href: '/hooks-test', label: 'Hooks 測試', description: '自訂 React Hooks', icon: '🪝' },
      { href: '/route', label: '路由測試', description: 'i18n 路由管理', icon: '🛤️' },
      { href: '/about', label: '關於本站', description: '專案資訊', icon: 'ℹ️' }
    ]
  }
] as const;

async function HomePage(): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') || '';

  return (
    <DefaultLayout nonce={nonce}>
      <main className={styles.home_page}>
        <GTMScnOpen />

        {/* Hero Section */}
        <section className={styles['home_page-hero']}>
          <div className={styles['home_page-hero-title']}>
            <Image
              src="/img/icon/Next.jsLab.v.01.svg"
              alt="Next.js Lab"
              width={80}
              height={80}
              priority
            />
            <h1 className={styles['home_page-hero-title-text']}>
              Parker&apos;s Next.js Lab
            </h1>
          </div>
          <p className={styles['home_page-hero-subtitle']}>
            探索現代前端技術 — WebRTC、AI 換臉、PWA、Firebase 等實驗性功能
          </p>
        </section>

        {/* Link Sections */}
        {LINK_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className={styles['home_page-section-title']}>{section.title}</h2>
            <div className={styles['home_page-section-grid']}>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles['home_page-card']}
                >
                  <span className={styles['home_page-card-icon']}>{link.icon}</span>
                  <h3 className={styles['home_page-card-title']}>{link.label}</h3>
                  <p className={styles['home_page-card-description']}>{link.description}</p>
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
