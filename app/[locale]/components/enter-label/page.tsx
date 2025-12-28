import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Box from '@mui/material/Box';

const EnterLabelTestClient = dynamic(() => import('@/components/Demo/EnterLabelTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.enterLabel');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EnterLabelTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box sx={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <GTMScnOpen />
      <EnterLabelTestClient />
    </Box>
  );
}
