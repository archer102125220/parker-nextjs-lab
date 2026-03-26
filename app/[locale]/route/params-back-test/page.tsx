import { i18nRedirect } from '@/i18n/navigation/server';

type Props = {
  params: Promise<{ locale: string }>;
};

async function ParamsBackTestPage({ params }: Props): Promise<void> {
  const { locale } = await params;
  i18nRedirect({ href: '/route', locale });
}

export default ParamsBackTestPage;
