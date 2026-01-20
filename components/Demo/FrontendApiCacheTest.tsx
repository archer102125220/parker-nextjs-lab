'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
  Link
} from '@mui/material';
import style from '@/app/[locale]/frontend-api-cache-test/page.module.scss';

export default function FrontendApiCacheTest(): React.ReactNode {
  const [queryData, setQueryData] = useState('queryTest');
  const [payloadData, setPayloadData] = useState('payloadTest');
  const [isPost, setIsPost] = useState(true);
  const [timeConsuming, setTimeConsuming] = useState<number | null>(null);
  const [useCache, setUseCache] = useState(false);
  const [useServiceWorkerCache, setUseServiceWorkerCache] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const startTime = Date.now();
    setLoading(true);

    try {
      const url = isPost
        ? `/api/frontend-api-cache-test`
        : `/api/frontend-api-cache-test?data=${encodeURIComponent(queryData)}`;

      const options: RequestInit = {
        method: isPost ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (isPost) {
        options.body = JSON.stringify({
          query: { data: queryData },
          payload: { data: payloadData }
        });
      }

      // Add cache headers if useCache is enabled
      if (useCache) {
        options.headers = {
          ...options.headers,
          'X-Use-Cache': 'true'
        };
      }

      // For service worker cache, we rely on the service worker configuration
      if (useServiceWorkerCache && !isPost) {
        options.cache = 'force-cache';
      }

      const fetchResponse = await fetch(url, options);
      const result = await fetchResponse.json();
      setResponse(result);
    } catch (error) {
      console.error('API Error:', error);
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
      setTimeConsuming(Date.now() - startTime);
    }
  };

  return (
    <>
      <Box className={style['frontend_api_cache_test_page-outbound_link']}>
        <Typography component="span">
          漸進式網頁（Progressive Web Apps，PWA）記錄筆記：
        </Typography>
        <Link
          href="https://valley-hortensia-084.notion.site/Nuxt3-Progressive-Web-Apps-PWA-1906dcd96fa280acaafbeaec0828cfad"
          target="_blank"
          rel="noopener noreferrer"
        >
          notion筆記連結
        </Link>
      </Box>

      <Image
        className={style['frontend_api_cache_test_page-banner']}
        src="/img/icon/Next.jsLab.v.03.webp"
        alt="Frontend API Cache Test Banner"
        width={1200}
        height={400}
        priority
      />

      <form
        className={style['frontend_api_cache_test_page-form']}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="GET參數"
          value={queryData}
          onChange={(e) => setQueryData(e.target.value)}
          className={style['frontend_api_cache_test_page-form-query']}
          margin="normal"
        />

        <TextField
          fullWidth
          label="POST參數"
          value={payloadData}
          onChange={(e) => setPayloadData(e.target.value)}
          className={style['frontend_api_cache_test_page-form-payload']}
          margin="normal"
        />

        <RadioGroup
          className={style['frontend_api_cache_test_page-form-http_method']}
          value={isPost}
          onChange={(e) => setIsPost(e.target.value === 'true')}
        >
          <FormControlLabel
            value={true}
            control={<Radio color="primary" />}
            label="使用HTTP POST"
          />
          <FormControlLabel
            value={false}
            control={<Radio color="primary" />}
            label="使用HTTP GET"
          />
        </RadioGroup>

        <FormControlLabel
          control={
            <Checkbox
              checked={useCache}
              onChange={(e) => setUseCache(e.target.checked)}
              color="primary"
            />
          }
          label="啟用快取(同時使用情況下優先生效)"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={useServiceWorkerCache}
              onChange={(e) => setUseServiceWorkerCache(e.target.checked)}
              color="primary"
            />
          }
          label="啟用ServiceWorker快取(只適用production模式底下的HTTP GET方法)"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? '測試中...' : '測試'}
        </Button>
      </form>

      <Box className={style['frontend_api_cache_test_page-content']}>
        <Typography component="span">耗時約：</Typography>
        <Typography component="span" fontWeight="bold">
          {timeConsuming !== null ? timeConsuming : '-'}
        </Typography>
        <Typography component="span">ms</Typography>
      </Box>

      <Box mt={2}>
        <Typography>回傳值：</Typography>
        <Typography
          component="pre"
          sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {JSON.stringify(response, null, 2)}
        </Typography>
      </Box>
    </>
  );
}
