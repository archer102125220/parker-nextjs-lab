'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Alert
} from '@mui/material';

import '@/app/[locale]/socket-test/socket-test.scss';

interface LinkItem {
  to: string;
  label: string;
  description: string;
}

export default function SocketTestPage(): React.ReactNode {
  const locale = useLocale();

  const linkList: LinkItem[] = [
    {
      to: `/${locale}/socket-test/socket-io`,
      label: 'Socket.IO 測試',
      description: '前後端皆由 socket.io 做處理'
    },
    {
      to: `/${locale}/socket-test/websocket`,
      label: 'WebSocket 測試',
      description: '使用原生 WebSocket API'
    }
  ];

  return (
    <section className="socket_test_page">
      <Typography variant="h5" gutterBottom>
        Socket 測試列表
      </Typography>

      <Box className="socket_test_page-description">
        <Typography variant="body2">
          紀錄原生 WebSocket 以及由{' '}
          <a
            href="https://socket.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            socket.io
          </a>{' '}
          實作的結果
        </Typography>
      </Box>

      <Image
        className="socket_test_page-banner"
        src="/img/socket/socket-v.05.webp"
        alt="Socket Banner"
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

      <Alert severity="warning" sx={{ mb: 2 }}>
        當前部署環境可能不支援 WebSocket（如：Vercel 等 serverless
        平台），Socket.IO 功能可能會無效。 建議在本地開發環境測試。
      </Alert>

      <nav className="socket_test_page-content" role="navigation">
        {linkList.map((link) => (
          <Card key={link.to} className="socket_test_page-content-link">
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
