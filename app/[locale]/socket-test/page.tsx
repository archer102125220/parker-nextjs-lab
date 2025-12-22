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

import styles from './page.module.scss';

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
    <section className={styles.socket_test_page}>
      <Typography variant="h5" gutterBottom>
        Socket 測試列表
      </Typography>

      <Box className={styles['socket_test_page-description']}>
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

      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Socket.IO 伺服器狀態：</strong>
        <br />
        ✅ <strong>本地開發環境：</strong>專案已配置獨立的 Socket.IO 伺服器（預設 port 3002），
        在執行 <code>yarn dev</code> 或 <code>yarn dev-https</code> 時會自動啟動。
        <br />
        ❌ <strong>Vercel 部署環境：</strong>由於 Vercel 等 serverless 平台不支援 WebSocket，
        Socket.IO 功能將無法運作。如需在生產環境使用，請部署獨立的 Socket.IO 伺服器（如 Railway、Render 等）。
      </Alert>

      <Image
        className={styles['socket_test_page-banner']}
        src="/img/socket/socket-v.05.webp"
        alt="Socket Banner"
        width={1200}
        height={400}
        priority
      />

      <nav className={styles['socket_test_page-content']} role="navigation">
        {linkList.map((link) => (
          <Card key={link.to} className={styles['socket_test_page-content-link']}>
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
