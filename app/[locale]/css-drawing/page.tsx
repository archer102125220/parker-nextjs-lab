import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Link } from '@/i18n/navigation';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import { DefaultLayout } from '@/layout/default';

import style from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'CSS 繪圖與動畫',
    description: '純 CSS 實現的圖形繪製與 anime.js 動畫效果'
  };
}

const CSS_DEMOS = [
  {
    href: '/css-drawing/triangle-test',
    label: '🔺 CSS 三角形',
    description: '使用 border 繪製各方向三角形'
  },
  {
    href: '/css-drawing/triangle-full-test',
    label: '📐 三角形滿版',
    description: '滿版三角形佈局效果'
  },
  {
    href: '/css-drawing/triangle-anime-test',
    label: '✨ 三角形動畫',
    description: '結合 anime.js 的動態效果'
  },
  {
    href: '/css-drawing/hexagon-test',
    label: '⬡ CSS 六邊形',
    description: '純 CSS 繪製蜂巢六邊形'
  },
  {
    href: '/css-drawing/svg-color-change',
    label: '🎨 SVG 換色',
    description: '動態替換 SVG 圖示顏色'
  }
] as const;

async function CssDrawing(): Promise<ReactNode> {
  const headersData = await headers();
  const _nonce = headersData.get('x-nonce') || '';

  return (
    <DefaultLayout nonce={_nonce}>
      <main className={style.css_animejs_page}>
        <GTMScnOpen />

        {/* Hero Section */}
        <section className={style['css_animejs_page-hero']}>
          <span className={style['css_animejs_page-hero-icon']}>✏️</span>
          <h1 className={style['css_animejs_page-hero-title']}>CSS 繪圖實驗室</h1>
          <p className={style['css_animejs_page-hero-subtitle']}>
            探索純 CSS 圖形繪製與 anime.js 動畫整合
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
                {demo.label}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {demo.description}
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </DefaultLayout>
  );
}

export default CssDrawing;
