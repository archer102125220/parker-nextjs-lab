import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import LinkButton from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

import { DefaultLayout } from '@/layout/default';

import style from '@/app/[locale]/css-drawing/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'css繪圖相關測試',
    description: 'css繪圖相關測試'
  };
}

async function CssDrawing(): Promise<ReactNode> {
  const headersData = await headers();
  const nonce = headersData.get('x-nonce') || '';

  const linkList = [
    { href: '/css-drawing/triangle-test', label: 'css三角形測試' },
    {
      href: '/css-drawing/triangle-full-test',
      label: 'css三角形滿版測試'
    },
    {
      href: '/css-drawing/triangle-anime-test',
      label: 'css三角形滿版動畫測試'
    },
    {
      href: '/css-drawing/hexagon-test',
      label: 'css六邊形測試'
    },
    {
      href: '/css-drawing/svg-color-change',
      label: 'svg替換顏色測試'
    }
  ];

  return (
    <DefaultLayout nonce={nonce}>
      <section className={style.css_animejs_page}>
        <GTMScnOpen />
        {/* <h1>CSS繪圖相關測試</h1> */}

        <p className={style['css_animejs_page-content']}>
          主要以css繪圖及anime.js整合測試為主
        </p>

        <nav className={style['css_animejs_page-link_list']}>
          {/* <LinkButton
          className={style['css_animejs_page-link_list-link']}
          href="/css-drawing/hexagon-test"
          nonce={nonce}
        >
          css六邊形測試
        </LinkButton> */}
          {linkList.map((link) => (
            <LinkButton
              key={link.href}
              className={style['css_animejs_page-link_list-link']}
              href={link.href}
              nonce={nonce}
            >
              {link.label}
            </LinkButton>
          ))}
        </nav>
      </section>
    </DefaultLayout>
  );
}

export default CssDrawing;
