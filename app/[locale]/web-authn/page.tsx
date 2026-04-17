import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import GTMScnOpen from '@/components/Google/GTMScnOpen';
import style from './page.module.scss';

const DemoWebAuthn = dynamic(() => import('@/components/Demo/WebAuthn'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebAuthn 生物辨識測試',
    description: '原生方式為主，套件用來編碼、解碼的方式實作'
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WebAuthnPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  
  // Enable static rendering - CRITICAL for next-intl 4.x
  setRequestLocale(locale);

  return (
    <div className={style.web_authn_page}>
      <GTMScnOpen />

      {/* Hero Section */}
      <section className={style['web_authn_page-hero']}>
        <div className={style['web_authn_page-hero-background']}>
          <div className={style['web_authn_page-hero-background-overlay']} />
        </div>

        <div className={style['web_authn_page-hero-content']}>
          <div className={style['web_authn_page-hero-content-icon']}>
             <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
          </div>
          <h1 className={style['web_authn_page-hero-content-title']}>
            WebAuthn 測試
          </h1>
          <p className={style['web_authn_page-hero-content-subtitle']}>
            生物辨識與硬體金鑰認證
          </p>
          <p className={style['web_authn_page-hero-content-description']}>
            紀錄與測試 FIDO WebAuthn 的註冊與驗證流程。展示原生存取 navigator.credentials 的方式作通行密鑰認證。
          </p>
          <a
            href="https://www.notion.so/Web-Authn-6480f13abf224ef59a41571df1531f6a"
            target="_blank"
            rel="noopener noreferrer"
            className={style['web_authn_page-hero-content-badge']}
          >
            Notion 筆記連結
          </a>
        </div>
      </section>

      {/* Main Content (Demo) */}
      <section className={style['web_authn_page-main']}>
        <div className={style['web_authn_page-section-container']}>
          <DemoWebAuthn />
        </div>
      </section>
    </div>
  );
}
