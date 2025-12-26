import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Link } from '@/i18n/navigation';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import { DefaultLayout } from '@/layout/default';

import style from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Firebase 整合測試',
    description: 'Firebase Cloud Messaging、認證等功能整合'
  };
}

const FIREBASE_FEATURES = [
  { icon: '📲', text: 'FCM 推播通知' },
  { icon: '🔐', text: '身份認證' },
  { icon: '⚙️', text: 'PWA 整合' },
  { icon: '🔔', text: 'Service Worker' }
] as const;

const FIREBASE_DEMOS = [
  {
    href: '/firebase/cloud-messaging',
    label: '📲 FCM 推播通知',
    description: 'Firebase Cloud Messaging 推播測試後台'
  }
] as const;

async function FirebasePage(): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') || '';

  return (
    <DefaultLayout nonce={nonce}>
      <main className={style.firebase_page}>
        <GTMScnOpen />

        {/* Hero Section */}
        <section className={style['firebase_page-hero']}>
          <span className={style['firebase_page-hero-icon']}>🔥</span>
          <h1 className={style['firebase_page-hero-title']}>Firebase 整合</h1>
          <p className={style['firebase_page-hero-subtitle']}>
            Cloud Messaging、認證、PWA 與 Service Worker 整合測試
          </p>
        </section>

        {/* Description */}
        <div className={style['firebase_page-content']}>
          <p className={style['firebase_page-content-text']}>
            原本在
            <a
              href="https://resume-web-orpin.vercel.app/portfolio/firebase-admin"
              target="_blank"
              rel="noopener"
              className={style['firebase_page-content-link']}
            >
              電子履歷 →
            </a>
            中實作並測試的功能
          </p>
          <p className={style['firebase_page-content-text']}>
            由於該專案並沒有實作 PWA 等需要 Service Worker 的功能，因此在此專案嘗試整合
            Service Worker 並做測試
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
                {demo.label}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {demo.description}
              </span>
            </Link>
          ))}
        </nav>

        {/* Feature List */}
        <div className={style['firebase_page-feature_list']}>
          {FIREBASE_FEATURES.map((feature) => (
            <div key={feature.text} className={style['firebase_page-feature_list-item']}>
              <span className={style['firebase_page-feature_list-item-icon']}>
                {feature.icon}
              </span>
              <span className={style['firebase_page-feature_list-item-text']}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </main>
    </DefaultLayout>
  );
}

export default FirebasePage;
