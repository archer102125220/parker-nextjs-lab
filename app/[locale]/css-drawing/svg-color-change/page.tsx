import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

import '@/components/Triangle/triangle.scss';

import { SvgColorChabge as DemoSvgColorChabge } from '@/components/Demo/SvgColorChabge';

import style from '@/app/[locale]/css-drawing/svg-color-change/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'svg替換顏色測試',
    description: 'svg替換顏色測試'
  };
}

function SvgColorChabge(): ReactNode {
  return (
    <section className={style.svg_color_change_page}>
      <GTMScnOpen />
      <DemoSvgColorChabge />
    </section>
  );
}

export default SvgColorChabge;
