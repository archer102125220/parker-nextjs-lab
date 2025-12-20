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

import '@/app/[locale]/web-rtc/web-rtc.scss';

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
      to: `/${locale}/web-rtc/websocket`,
      label: 'WebSocket 實作',
      description: '配合原生 WebSocket 做為 Signaling'
    },
    {
      to: `/${locale}/web-rtc/server-sent-event`,
      label: 'SSE 實作',
      description: '配合 Server-Sent Events 實作'
    }
  ];

  return (
    <section className="web_rtc_page">
      <Typography variant="h5" gutterBottom>
        WebRTC 測試列表
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        目前視訊功能已初步完成，但是詳細的流程尚未完成，若要測試需手動複製網址才能做測試。
        WebRTC 需要 Signaling Server 支援，在 serverless 環境可能受限。
      </Alert>

      <Image
        className="web_rtc_page-banner"
        src="/img/web-rtc/web-rtc-v.04.webp"
        alt="WebRTC Banner"
        width={1200}
        height={400}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
          objectFit: 'cover'
        }}
        priority
      />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        WebRTC 的實作測試，主要分為以下三種 Signaling 方式：
      </Typography>

      <nav className="web_rtc_page-content" role="navigation">
        {linkList.map((link) => (
          <Card key={link.to} className="web_rtc_page-content-link">
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
