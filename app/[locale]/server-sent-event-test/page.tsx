'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Typography, Card, CardContent, CardActionArea } from '@mui/material';

import '@/app/[locale]/server-sent-event-test/server-sent-event-test.scss';

interface LinkItem {
  to: string;
  label: string;
  description: string;
}

export default function ServerSentEventTestPage(): React.ReactNode {
  const locale = useLocale();

  const linkList: LinkItem[] = [
    {
      to: `/${locale}/server-sent-event-test/global-get`,
      label: 'SSE 全域測試 (GET)',
      description: '使用 GET 方法的全域 Server-Sent Events'
    },
    {
      to: `/${locale}/server-sent-event-test/global-post`,
      label: 'SSE Post 全域測試',
      description: '使用 POST 方法的全域 Server-Sent Events'
    },
    {
      to: `/${locale}/server-sent-event-test/room-get`,
      label: 'SSE 房間測試 (GET)',
      description: '依照 route param 分組的 SSE'
    },
    {
      to: `/${locale}/server-sent-event-test/room-post`,
      label: 'SSE 房間測試 (POST)',
      description: '依照 route param 分組的 POST SSE'
    }
  ];

  return (
    <section className="server_sent_event_test_page">
      <Typography variant="h5" gutterBottom>
        Server-Sent Events 測試列表
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        測試全域及依照 route param 做分組的 Server-Sent Event
      </Typography>

      <Image
        className="server_sent_event_test_page-banner"
        src="/img/server-sent-event/server-sent-event-v.04.webp"
        alt="SSE Banner"
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

      <nav className="server_sent_event_test_page-content" role="navigation">
        {linkList.map((link) => (
          <Card
            key={link.to}
            className="server_sent_event_test_page-content-link"
          >
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
