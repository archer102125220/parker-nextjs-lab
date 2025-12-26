import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

import styles from './page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

const DEMO_LINKS = [
  {
    path: '/directive-effects/lazyload-test',
    label: '🖼️ 圖片懶載入',
    labelEn: 'Lazy Load Test',
    description: '使用 Intersection Observer API 實現的圖片懶載入效果'
  },
  {
    path: '/directive-effects/ripple-test',
    label: '💫 點擊波紋',
    labelEn: 'Ripple Effect Test',
    description: '仿 Material Design 的按鈕點擊波紋動畫效果'
  }
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Directive Effects 效果測試',
    description: '自訂實作的 Directive Effects - 包含懶載入和波紋效果'
  };
}

export default function DirectiveEffectsPage(): React.ReactNode {
  return (
    <main className={styles.directive_effects_page}>
      <GTMScnOpen />

      {/* Hero Section */}
      <section className={styles['directive_effects_page-hero']}>
        <span className={styles['directive_effects_page-hero-icon']}>✨</span>
        <h1 className={styles['directive_effects_page-hero-title']}>
          Directive Effects
        </h1>
        <p className={styles['directive_effects_page-hero-subtitle']}>
          自訂實作的視覺效果 — 避免套件版本相容性問題
        </p>
      </section>

      {/* Note */}
      <div className={styles['directive_effects_page-note']}>
        <span>💡</span>
        <span>
          Vue Directives 在 React 中不存在，這些功能已轉換為 Custom Hooks 或 Components
        </span>
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
                    {link.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {link.description}
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
