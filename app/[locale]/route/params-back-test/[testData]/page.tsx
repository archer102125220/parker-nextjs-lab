'use client';

import { useParams } from 'next/navigation';
import { useNextRouter } from '@/i18n/navigation';
import { Typography, Button, Box, Paper, Alert } from '@mui/material';

import '@/app/[locale]/route/params-back-test/params-back-test.scss';

export default function ParamsBackTestPage(): React.ReactNode {
  const router = useNextRouter();
  const params = useParams<{ locale: string; testData: string }>();

  const testDataValue = params.testData;
  const paramsTestData = !isNaN(Number(testDataValue))
    ? Number(testDataValue)
    : 0;

  const handleRouteParamsPush = () => {
    const newValue = paramsTestData + 1;
    router.push(`/${params.locale}/route/params-back-test/${newValue}`);
  };

  const handleRouteParamsReplace = () => {
    const newValue = paramsTestData + 1;
    router.replace(`/${params.locale}/route/params-back-test/${newValue}`);
  };

  return (
    <section className="params_back_test_page">
      <Typography variant="h5" gutterBottom>
        路由參數與上一頁測試
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        測試動態路由參數的 push 與 replace 行為。Push 會新增歷史記錄，Replace
        則會取代當前記錄。
      </Alert>

      <Paper className="params_back_test_page-display" elevation={2}>
        <Typography variant="h6">當前 testData 值：</Typography>
        <Typography variant="h3" color="primary">
          {paramsTestData}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          URL: /route/params-back-test/{paramsTestData}
        </Typography>
      </Paper>

      <Box className="params_back_test_page-actions">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleRouteParamsPush}
        >
          增加 params (Push)
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={handleRouteParamsReplace}
        >
          增加 params (Replace)
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
