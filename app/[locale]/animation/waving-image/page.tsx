import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const WavingImageTestClient = dynamic(
  () => import('@/components/Demo/WavingImageTest')
);
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.wavingImage');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WavingImageAnimationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.wavingImage');

  return (
    <div className={style.waving_image_test_page}>
      <GTMScnOpen />
      <h1>{t('title')}</h1>
      <p className={style['waving_image_test_page-description']}>
        {t('description')}
      </p>
      <WavingImageTestClient />
    </div>
  );
}
