'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Typography, Card, CardContent, CardActionArea } from '@mui/material';

import styles from './page.module.scss';

const LINK_LIST = [
  {
    to: '/route/query-back-test',
    label: '路由query與上一頁測試',
    description: '測試 URL query 參數的 push 與 replace 行為'
  },
  {
    to: '/route/params-back-test/0',
    label: '路由參數與上一頁測試',
    description: '測試動態路由參數的 push 與 replace 行為'
  }
];

export default function RouteTestPage(): React.ReactNode {
  return (
    <section className={styles.route_test_page}>
      <Typography variant="body1" paragraph>
        主要用作複現狀況，編筆記用途的測試
      </Typography>

      <Image
        className={styles['route_test_page-banner']}
        src="/img/icon/Next.jsLab.v.01.webp"
        alt="Route Test Banner"
        width={1200}
        height={400}
        priority
      />

      <nav className={styles['route_test_page-content']} role="navigation">
        {LINK_LIST.map((link) => (
          <Link key={link.to} href={link.to} className={styles['route_page-link']}>
            <Card className={styles['route_test_page-content-link']}>
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
    </section>
  );
}
