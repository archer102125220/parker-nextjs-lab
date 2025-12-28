import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const ImageUploadTest = dynamic(
  () => import('@/components/Demo/ImageUploadTest')
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.imageUpload');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ImageUploadTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.imageUpload');

  return (
    <div className={style.image_upload_test_page}>
      <h1>{t('title')}</h1>
      <p className={style['image_upload_test_page-description']}>
        {t('description')}
      </p>
      <ImageUploadTest />
    </div>
  );
}
