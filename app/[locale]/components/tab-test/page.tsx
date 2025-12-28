import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TabTest = dynamic(() => import('@/components/Demo/TabTest'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.tabs');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TabTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.tabs');

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('description')}
      </Typography>
      <TabTest />
    </Box>
  );
}
