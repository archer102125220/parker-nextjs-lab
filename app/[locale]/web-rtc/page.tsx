'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Alert
} from '@mui/material';

import style from '@/app/[locale]/web-rtc/page.module.scss';

interface LinkItem {
  to: string;
  label: string;
  description: string;
}

export default function WebRTCPage(): React.ReactNode {
  const locale = useLocale();

  const linkList: LinkItem[] = [
    {
      to: `/${locale}/web-rtc/socket-io`,
      label: 'Socket.IO 實作',
      description: '配合 Socket.IO 做為 Signaling Server'
    },
    {
      to: `/${locale}/web-rtc/server-sent-event`,
      label: 'SSE 實作',
      description: '配合 Server-Sent Events 及 @upstash/redis 實作'
    }
  ];

  return (
    <section className={style.web_rtc_page}>
      <Typography variant="h5" gutterBottom>
        WebRTC 測試列表
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        目前視訊功能已初步完成，但是詳細的流程尚未完成，若要測試需手動複製網址才能做測試。
        WebRTC 需要 Signaling Server 支援，在 serverless 環境可能受限。
      </Alert>

      <Image
        className={style['web_rtc_page-banner']}
        src="/banner/web-rtc.png"
        alt="WebRTC Banner"
        width={600}
        height={400}
        priority
      />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        WebRTC 的實作測試，主要分為以下兩種 Signaling 方式：
      </Typography>

      <nav className={style['web_rtc_page-content']} role="navigation">
        {linkList.map((link) => (
          <Card key={link.to} className={style['web_rtc_page-content-link']}>
            <CardActionArea component={Link} href={link.to}>
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
        ))}
      </nav>
    </section>
  );
}
