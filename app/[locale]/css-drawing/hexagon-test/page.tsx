import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import Hexagon from '@/components/Hexagon';
import HexagonContainer from '@/components/Hexagon/Container';

import style from '@/app/[locale]/css-drawing/hexagon-test/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'css六邊形測試',
    description: 'css六邊形測試'
  };
}

function HexagonTest(): ReactNode {
  return (
    <section className={style.hexagon_page}>
      <GTMScnOpen />
      <Hexagon className={style['hexagon_page-component']} />
      <HexagonContainer className={style['hexagon_page-hexagon_container']}>
        <p>987654321</p>
        <p>87654321</p>
        <p>7654321</p>
        <p>654321</p>
        <p>54321</p>
        <p>4321</p>
        <p>321</p>
        <p>21</p>
        <p>1</p>
      </HexagonContainer>
      <HexagonContainer
        width="50px"
        height="60px"
        className={style['hexagon_page-hexagon_container']}
        maskColor="#fff"
      >
        <p>987654321</p>
        <p>87654321</p>
        <p>7654321</p>
        <p>654321</p>
        <p>54321</p>
        <p>4321</p>
        <p>321</p>
        <p>21</p>
        <p>1</p>
      </HexagonContainer>
      <div className={style['hexagon_page-drawing_container']}>
        <div className={style['hexagon_page-drawing_container-drawing']} />
      </div>
    </section>
  );
}

export default HexagonTest;
