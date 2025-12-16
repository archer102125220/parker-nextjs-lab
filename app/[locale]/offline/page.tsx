'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Container,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  AlertTitle,
  Box,
  Typography
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

import '@/app/[locale]/offline/offline.scss';

export default function OfflinePage(): React.ReactNode {
  const t = useTranslations('offline');
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retryLoad = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.reload();
    }
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <Container className="offline-page" maxWidth={false}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Box maxWidth={400} width="100%">
          <Card className="offline-card" elevation={8}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              {/* Offline Icon */}
              <Box className="offline-icon-wrapper" mb={3}>
                {isOnline ? (
                  <WifiIcon
                    className="offline-icon"
                    sx={{ fontSize: 120, color: 'success.main' }}
                  />
                ) : (
                  <WifiOffIcon
                    className="offline-icon"
                    sx={{ fontSize: 120, color: 'grey.500' }}
                  />
                )}
              </Box>

              {/* Title */}
              <Typography variant="h4" fontWeight="bold" mb={2}>
                {isOnline ? t('backOnline') : t('title')}
              </Typography>

              {/* Description */}
              <Typography variant="body1" color="text.secondary" mb={3}>
                {isOnline ? t('canRetry') : t('description')}
              </Typography>

              {/* Status Chip */}
              <Box mb={3}>
                <Chip
                  icon={isOnline ? <CheckCircleIcon /> : <ErrorIcon />}
                  label={isOnline ? t('online') : t('offline')}
                  color={isOnline ? 'success' : 'error'}
                  size="medium"
                />
              </Box>

              {/* Action Buttons */}
              <Box display="flex" flexDirection="column" gap={1.5}>
                {isOnline && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<RefreshIcon />}
                    onClick={retryLoad}
                  >
                    {t('retry')}
                  </Button>
                )}

                <Button
                  variant={isOnline ? 'outlined' : 'contained'}
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<HomeIcon />}
                  onClick={goHome}
                >
                  {t('goHome')}
                </Button>
              </Box>

              {/* Tip Alert */}
              {!isOnline && (
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{ mt: 3, textAlign: 'left' }}
                >
                  <AlertTitle>{t('tipTitle')}</AlertTitle>
                  {t('tipMessage')}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Box textAlign="center" mt={3}>
            <Typography variant="caption" color="text.secondary">
              {t('autoDetect')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
