import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import TriangleAnimation from '@/components/Demo/TriangleAnimation';

import style from './page.module.scss';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'CSS Triangle Animation',
    description: 'CSS triangle full-screen animation with anime.js integration'
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

async function TriangleAnimeTestPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className={style.triangle_anime_test_page}>
      <GTMScnOpen />
      <TriangleAnimation />
    </section>
  );
}

export default TriangleAnimeTestPage;
