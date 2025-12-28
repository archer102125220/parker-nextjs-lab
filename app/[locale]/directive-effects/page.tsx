import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

import styles from './page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

// Demo 配置
const DEMO_LINKS = [
  { path: '/directive-effects/lazyload-test', demoKey: 'lazyload' },
  { path: '/directive-effects/ripple-test', demoKey: 'ripple' }
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.directiveEffects');
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DirectiveEffectsPage({ params }: Props): Promise<React.ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.directiveEffects');

  return (
    <main className={styles.directive_effects_page}>
      <GTMScnOpen />

      {/* Hero Section */}
      <section className={styles['directive_effects_page-hero']}>
        <span className={styles['directive_effects_page-hero-icon']}>✨</span>
        <h1 className={styles['directive_effects_page-hero-title']}>
          {t('heroTitle')}
        </h1>
        <p className={styles['directive_effects_page-hero-subtitle']}>
          {t('heroSubtitle')}
        </p>
      </section>

      {/* Note */}
      <div className={styles['directive_effects_page-note']}>
        <span>💡</span>
        <span>{t('note')}</span>
      </div>

      {/* Demo Cards */}
      <nav className={styles['directive_effects_page-content']}>
        {DEMO_LINKS.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={styles['directive_effects_page-link']}
          >
            <Card className={styles['directive_effects_page-content-card']}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t(`demos.${link.demoKey}.label`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`demos.${link.demoKey}.description`)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        ))}
      </nav>
    </main>
  );
}
