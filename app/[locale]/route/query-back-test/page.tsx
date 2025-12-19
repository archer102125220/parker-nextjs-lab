'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePathnameWithLocale } from '@/i18n/navigation';
import { Typography, Button, Box, Paper, Alert } from '@mui/material';

import '@/app/[locale]/route/query-back-test/query-back-test.scss';

export default function QueryBackTestPage(): React.ReactNode {
  const router = useRouter();
  const pathname = usePathnameWithLocale(); // Includes locale: /zh-tw/route/query-back-test
  const searchParams = useSearchParams();

  // Derive state directly from searchParams instead of using useEffect + useState
  const testDataParam = searchParams.get('testData');
  const queryTestData =
    testDataParam !== null && !isNaN(Number(testDataParam))
      ? Number(testDataParam)
      : 0;

  const handleRouteQueryPush = () => {
    const newValue = queryTestData + 1;
    router.push(`${pathname}?testData=${newValue}`);
  };

  const handleRouteQueryReplace = () => {
    const newValue = queryTestData + 1;
    router.replace(`${pathname}?testData=${newValue}`);
  };

  return (
    <section className="query_back_test_page">
      <Typography variant="h5" gutterBottom>
        路由 Query 與上一頁測試
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        測試 URL query 參數的 push 與 replace 行為。Push 會新增歷史記錄，Replace
        則會取代當前記錄。
      </Alert>

      <Paper className="query_back_test_page-display" elevation={2}>
        <Typography variant="h6">當前 testData 值：</Typography>
        <Typography variant="h3" color="primary">
          {queryTestData}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          URL: ?testData={queryTestData || '(無)'}
        </Typography>
      </Paper>

      <Box className="query_back_test_page-actions">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleRouteQueryPush}
        >
          增加 query (Push)
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={handleRouteQueryReplace}
        >
          增加 query (Replace)
        </Button>
      </Box>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <strong>測試方式：</strong>
        <br />
        1. 點擊 Push 按鈕數次，觀察 URL 變化
        <br />
        2. 按瀏覽器「上一頁」，應該能逐一返回
        <br />
        3. 重新測試 Replace 按鈕，按「上一頁」應該直接跳過中間記錄
      </Alert>
    </section>
  );
}
