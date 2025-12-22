'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box
} from '@mui/material';

import styles from './page.module.scss';

const DEMO_LINKS = [
  {
    path: '/directive-effects/lazyload-test',
    label: '圖片懶載入測試',
    labelEn: 'Lazy Load Test',
    description: '使用 useLazyLoad Hook 實作 Intersection Observer 懶載入'
  },
  {
    path: '/directive-effects/ripple-test',
    label: '點擊波紋效果測試',
    labelEn: 'Ripple Effect Test',
    description: '使用 Ripple Component 實作 Material Design 波紋效果'
  }
];

export default function DirectiveEffectsPage(): React.ReactNode {
  return (
    <section className={styles.directive_effects_page}>
      <Typography variant="body1" paragraph>
        為避免因套件版本相容性或專案性質不合適使用 npm
        上相關工具之狀況，因此自己實作相關效果
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        注意：Vue Directives 在 React 中不存在，這些功能已轉換為 Custom Hooks 或
        Components
      </Typography>

      <Image
        className={styles['directive_effects_page-banner']}
        src="/img/icon/Next.jsLab.v.01.webp"
        alt="Directive Effects Banner"
        width={1200}
        height={400}
        priority
      />

      <Box className={styles['directive_effects_page-content']}>
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
      </Box>
    </section>
  );
}
