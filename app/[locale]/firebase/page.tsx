import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import LinkButton from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

import style from '@/app/[locale]/firebase/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Firebase 整合測試',
    description: 'Firebase 整合測試'
  };
}

function FirebasePage(): ReactNode {
  return (
    <main className={style.firebase_page}>
      <GTMScnOpen />
      <h1>Firebase 元件演示</h1>

      <div className={style['firebase_page-content']}>
        <p>原本在</p>
        <a
          href="https://resume-web-orpin.vercel.app/portfolio/firebase-admin"
          target="_blank"
        >
          電子履歷
        </a>
        <p>
          中實作並測試的功能，但由於該專案並沒有實作PWA等需要 Service Worker
          的功能，因此在此專案嘗試整合 Service Worker 並做測試
        </p>
      </div>

      <nav className={style['firebase_page-link_list']}>
        <LinkButton
          className={style['firebase_page-link_list-link']}
          href="/firebase/cloud-messaging"
        >
          FCM推播通知後台
        </LinkButton>
      </nav>
    </main>
  );
}

export default FirebasePage;
