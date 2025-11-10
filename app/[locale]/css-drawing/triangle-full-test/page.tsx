import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

import '@/components/Triangle/triangle.scss';
import style from '@/app/[locale]/css-drawing/triangle-full-test/page.module.scss';

import Triangle from '@/components/Triangle';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'css三角形滿版測試',
    description: 'css三角形滿版測試'
  };
}

function TriangleFullTest(): ReactNode {
  return (
    <section className={style.triangle_full_test_page}>
      <GTMScnOpen />
      {/* <h1>CSS三角形滿版測試</h1> */}

      <Triangle
        className={style['triangle_full_test_page-left']}
        height="100vh"
        width="100vw"
        angleUpperLeft={true}
      />
      <Triangle
        className={style['triangle_full_test_page-right']}
        height="100vh"
        width="100vw"
        angleLowerRight={true}
        color="rgb(147, 147, 255)"
      />
    </section>
  );
}

export default TriangleFullTest;
