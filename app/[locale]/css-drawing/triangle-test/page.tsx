import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

import '@/components/Triangle/triangle.scss';
import Triangle from '@/components/Triangle';

import style from '@/app/[locale]/css-drawing/triangle-test/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'css三角形測試',
    description: 'css三角形測試'
  };
}

function TriangleTest(): ReactNode {
  return (
    <section className={style.triangle_test_page}>
      <GTMScnOpen />

      <div className={style['triangle_test_page-cases_1']} />
      <div className={style['triangle_test_page-cases_2']} />
      <div className={style['triangle_test_page-cases_3']} />
      <div className={style['triangle_test_page-cases_4']} />
      <div className={style['triangle_test_page-cases_5']} />
      <div className={style['triangle_test_page-cases_6']} />

      <Triangle size="100px" />

      <div className={style['triangle_test_page-cases_7']}>
        <Triangle size="100px" angleUpperLeft={true} />
        <Triangle
          size="100px"
          color="rgb(147, 147, 255)"
          angleLowerRight={true}
        />
      </div>
      <div className={style['triangle_test_page-cases_7']}>
        <Triangle size="100px" angleLowerLeft={true} />
        <Triangle size="100px" angleUpperRight={true} />
      </div>
    </section>
  );
}

export default TriangleTest;
