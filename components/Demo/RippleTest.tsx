'use client';

import { Typography, Box, Alert, Button } from '@mui/material';
import { Ripple } from '@/components/Ripple';

import style from '@/app/[locale]/directive-effects/ripple-test/page.module.scss';

export default function RippleTestClient(): React.ReactNode {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Ripple Component 測試
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        此 Component 實作 Material Design
        風格的點擊波紋效果。點擊下方區塊查看效果。
      </Alert>

      <Box className={style['ripple_test_page-demos']}>
        {/* Demo 1: Basic ripple */}
        <Box className={style['ripple_test_page-demos-demo']}>
          <Typography variant="h6" gutterBottom>
            1. 基本波紋效果
          </Typography>
          <Ripple>
            <Box className={style['ripple_test_page-demos-demo-box']}>點擊我測試波紋效果</Box>
          </Ripple>
        </Box>

        {/* Demo 2: Custom color */}
        <Box className={style['ripple_test_page-demos-demo']}>
          <Typography variant="h6" gutterBottom>
            2. 自訂顏色 (紅色)
          </Typography>
          <Ripple color="rgba(255, 0, 0, 0.4)">
            <Box className={`${style['ripple_test_page-demos-demo-box']} ${style['ripple_test_page-demos-demo-box--red']}`}>
              紅色波紋效果
            </Box>
          </Ripple>
        </Box>

        {/* Demo 3: Blue color */}
        <Box className={style['ripple_test_page-demos-demo']}>
          <Typography variant="h6" gutterBottom>
            3. 自訂顏色 (藍色)
          </Typography>
          <Ripple color="rgba(0, 100, 255, 0.4)">
            <Box className={`${style['ripple_test_page-demos-demo-box']} ${style['ripple_test_page-demos-demo-box--blue']}`}>
              藍色波紋效果
            </Box>
          </Ripple>
        </Box>

        {/* Demo 4: With button */}
        <Box className={style['ripple_test_page-demos-demo']}>
          <Typography variant="h6" gutterBottom>
            4. 搭配按鈕使用
          </Typography>
          <Ripple color="rgba(255, 255, 255, 0.5)">
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '100%', py: 2 }}
            >
              按鈕內的波紋效果
            </Button>
          </Ripple>
        </Box>

        {/* Demo 5: Disabled */}
        <Box className={style['ripple_test_page-demos-demo']}>
          <Typography variant="h6" gutterBottom>
            5. 停用波紋效果
          </Typography>
          <Ripple enabled={false}>
            <Box className={`${style['ripple_test_page-demos-demo-box']} ${style['ripple_test_page-demos-demo-box--disabled']}`}>
              波紋效果已停用
            </Box>
          </Ripple>
        </Box>

        {/* Demo 6: With onClick */}
        <Box className={style['ripple_test_page-demos-demo']}>
          <Typography variant="h6" gutterBottom>
            6. 搭配 onClick 事件
          </Typography>
          <Ripple color="rgba(76, 175, 80, 0.5)">
            <Box
              className={`${style['ripple_test_page-demos-demo-box']} ${style['ripple_test_page-demos-demo-box--green']}`}
              onClick={() => alert('點擊事件觸發！')}
              sx={{ cursor: 'pointer' }}
            >
              點擊會觸發 alert
            </Box>
          </Ripple>
        </Box>
      </Box>
    </>
  );
}
