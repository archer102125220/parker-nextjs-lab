'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Typography, Card, CardContent, CardActionArea } from '@mui/material';
import styles from '@/app/[locale]/server-sent-event-test/page.module.scss';

interface LinkItem {
  to: string;
  label: string;
  icon: string;
  description: string;
}

export default function SSETestIndex(): React.ReactNode {
  const locale = useLocale();

  const linkList: LinkItem[] = [
    {
      to: `/${locale}/server-sent-event-test/global-get`,
      label: 'SSE 全域測試 (GET)',
      icon: '🌐',
      description: '使用 GET 方法的全域 Server-Sent Events'
    },
    {
      to: `/${locale}/server-sent-event-test/global-post`,
      label: 'SSE Post 全域測試',
      icon: '📤',
      description: '使用 POST 方法的全域 Server-Sent Events'
    },
    {
      to: `/${locale}/server-sent-event-test/room-get`,
      label: 'SSE 房間測試 (GET)',
      icon: '🚪',
      description: '依照 route param 分組的 SSE'
    },
    {
      to: `/${locale}/server-sent-event-test/room-post`,
      label: 'SSE 房間測試 (POST)',
      icon: '🏠',
      description: '依照 route param 分組的 POST SSE'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className={styles['sse_test_page-hero']}>
        <span className={styles['sse_test_page-hero-icon']}>📡</span>
        <h1 className={styles['sse_test_page-hero-title']}>
          Server-Sent Events
        </h1>
        <p className={styles['sse_test_page-hero-subtitle']}>
          測試全域及依照 route param 做分組的 SSE 即時通訊
        </p>
      </section>

      <Image
        className={styles['sse_test_page-banner']}
        src="/img/icon/Next.jsLab.v.03.webp"
        alt="SSE Banner"
        width={1200}
        height={400}
        priority
      />

      <nav className={styles['sse_test_page-content']} role="navigation">
        {linkList.map((link) => (
          <Card key={link.to} className={styles['sse_test_page-content-link']}>
            <CardActionArea component={Link} href={link.to}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {link.icon} {link.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {link.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </nav>
    </>
  );
}
