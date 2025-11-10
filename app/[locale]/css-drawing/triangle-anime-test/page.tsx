import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

import style from '@/app/[locale]/css-drawing/triangle-anime-test/page.module.scss';

import TriangleAnimation from '@/components/Demo/TriangleAnimation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'css三角形滿版動畫測試',
    description: 'css三角形滿版動畫測試'
  };
}

function TriangleAnimeTest(): ReactNode {
  return (
    <main className={style.triangle_anime_test_page}>
      <GTMScnOpen />
      {/* <h1>CSS三角形滿版動畫測試</h1> */}

      <TriangleAnimation />
    </main>
  );
}

export default TriangleAnimeTest;
