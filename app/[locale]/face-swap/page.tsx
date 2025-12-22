'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@mui/material';
import MonitorIcon from '@mui/icons-material/Monitor';
import StorageIcon from '@mui/icons-material/Storage';

import style from '@/app/[locale]/face-swap/page.module.scss';

export default function FaceSwapPage(): React.ReactNode {
  const locale = useLocale();

  return (
    <section className={style.face_swap_page}>
      <Image
        className={style['face_swap_page-banner']}
        src="/img/icon/Next.jsLab.v.01.webp"
        alt="Face Swap Banner"
        width={800}
        height={300}
        style={{
          width: '100%',
          maxWidth: 800,
          height: 'auto',
          maxHeight: 300,
          objectFit: 'cover'
        }}
        priority
      />

      <Typography variant="h4" className={style['face_swap_page-title']}>
        AI 人臉替換
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        className={style['face_swap_page-subtitle']}
      >
        選擇實作版本
      </Typography>

      <div className={style['face_swap_page-cards']}>
        <Card className={style['face_swap_page-cards-card']}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <MonitorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              純前端版本
            </Typography>
            <Typography variant="body2" color="text.secondary">
              使用 face-api.js + Canvas 實現，適合快速測試，效果較基礎。
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              href={`/${locale}/face-swap/frontend`}
              color="primary"
            >
              進入
            </Button>
          </CardActions>
        </Card>

        <Card className={`${style['face_swap_page-cards-card']} ${style['face_swap_page-cards-card--coming_soon']}`}>
          <Chip
            className={style['face_swap_page-cards-card-chip']}
            label="開發中"
            color="warning"
            size="small"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              後端 AI 版本
            </Typography>
            <Typography variant="body2" color="text.secondary">
              使用 Node.js 後端 + AI 模型，效果更精緻，敬請期待！
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              href={`/${locale}/face-swap/backend`}
              color="primary"
            >
              查看
            </Button>
          </CardActions>
        </Card>
      </div>
    </section>
  );
}
