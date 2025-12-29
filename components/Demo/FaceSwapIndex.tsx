'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert
} from '@mui/material';
import MonitorIcon from '@mui/icons-material/Monitor';
import StorageIcon from '@mui/icons-material/Storage';
import style from '@/app/[locale]/face-swap/page.module.scss';

// 檢測是否為 Vercel serverless 環境
const isVercelEnv = process.env.NEXT_PUBLIC_VERCEL === '1' || 
                    process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined;

export default function FaceSwapIndex(): React.ReactNode {
  const locale = useLocale();
  const t = useTranslations('pages.faceSwap');

  return (
    <>
      <Image
        className={style['face_swap_page-banner']}
        src="/img/icon/Next.jsLab.v.01.webp"
        alt="Face Swap Banner"
        width={800}
        height={300}
        priority
      />

      <Typography variant="h4" className={style['face_swap_page-title']}>
        {t('title')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        className={style['face_swap_page-subtitle']}
      >
        {t('subtitle')}
      </Typography>

      <div className={style['face_swap_page-cards']}>
        <Card className={style['face_swap_page-cards-card']}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <MonitorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {t('frontend.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('frontend.description')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              href={`/${locale}/face-swap/frontend`}
              color="primary"
            >
              {t('frontend.button')}
            </Button>
          </CardActions>
        </Card>

        <Card
          className={`${style['face_swap_page-cards-card']} ${style['face_swap_page-cards-card--coming_soon']}`}
        >
          <Chip
            className={style['face_swap_page-cards-card-chip']}
            label={isVercelEnv ? t('backend.chipServerless') : t('backend.chipDeveloping')}
            color={isVercelEnv ? 'error' : 'warning'}
            size="small"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {t('backend.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('backend.description')}
            </Typography>
            {isVercelEnv && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {t('backend.serverlessWarning')}
              </Alert>
            )}
          </CardContent>
          <CardActions>
            {isVercelEnv ? (
              <Button color="primary" disabled>
                {t('backend.serverlessButton')}
              </Button>
            ) : (
              <Button
                component={Link}
                href={`/${locale}/face-swap/backend`}
                color="primary"
              >
                {t('backend.button')}
              </Button>
            )}
          </CardActions>
        </Card>
      </div>
    </>
  );
}

