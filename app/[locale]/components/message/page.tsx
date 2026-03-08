import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import MessageDemo from '@/components/Demo/Message';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.message');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

async function MessageDemoPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.message');

  return (
    <section>
      <GTMScnOpen />
      <h1>{t('title')}</h1>
      <MessageDemo />
    </section>
  );
}

export default MessageDemoPage;
