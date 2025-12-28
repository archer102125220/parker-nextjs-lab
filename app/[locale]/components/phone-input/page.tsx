import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const PhoneInputTest = dynamic(
  () => import('@/components/Demo/PhoneInputTest')
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.phoneInput');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PhoneInputPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.phoneInput');

  return (
    <div className={style.phone_input_test_page}>
      <h1>{t('title')}</h1>
      <p className={style['phone_input_test_page-description']}>
        {t('description')}
      </p>
      <PhoneInputTest />
    </div>
  );
}
