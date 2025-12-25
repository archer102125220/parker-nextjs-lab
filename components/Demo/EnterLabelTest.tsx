'use client';

import { useState } from 'react';
import EnterLabel from '@/components/Animation/EnterLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function EnterLabelTest() {
  const [isAnimating1, setIsAnimating1] = useState(false);
  const [isAnimating2, setIsAnimating2] = useState(false);
  const [isAnimating3, setIsAnimating3] = useState(false);
  const [isAnimating4, setIsAnimating4] = useState(false);

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        EnterLabel 打字機動畫測試
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        展示隨機字符逐漸變成目標文字的打字機動畫效果
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          基本示範 - 英文動畫
        </Typography>
        <Box sx={{ mb: 2, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
          <EnterLabel label="Hello World!" tagName="h2" />
        </Box>
        <Typography variant="caption" color="text.secondary">
          自動開始，使用隨機英文大寫字母
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          中文動畫
        </Typography>
        <Box sx={{ mb: 2, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
          <EnterLabel label="你好世界！" randomLen="zh" tagName="h2" />
        </Box>
        <Typography variant="caption" color="text.secondary">
          使用隨機中文字符
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          手動觸發動畫
        </Typography>
        <Box sx={{ mb: 2, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
          <EnterLabel
            label="Click the button to start!"
            autoStart={false}
            value={isAnimating1}
            onValueChange={setIsAnimating1}
            tagName="h3"
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsAnimating1(true)}
          disabled={isAnimating1}
        >
          開始動畫
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          自訂速度 - 快速
        </Typography>
        <Box sx={{ mb: 2, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
          <EnterLabel
            label="Fast Animation"
            speed={5}
            autoStart={false}
            value={isAnimating2}
            onValueChange={setIsAnimating2}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsAnimating2(true)}
          disabled={isAnimating2}
        >
          開始快速動畫
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          自訂速度 - 慢速
        </Typography>
        <Box sx={{ mb: 2, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
          <EnterLabel
            label="Slow Animation"
            speed={30}
            autoStart={false}
            value={isAnimating3}
            onValueChange={setIsAnimating3}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsAnimating3(true)}
          disabled={isAnimating3}
        >
          開始慢速動畫
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          自訂標籤元素
        </Typography>
        <Box sx={{ mb: 2, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
          <EnterLabel
            label="This is a paragraph element"
            tagName="p"
            autoStart={false}
            value={isAnimating4}
            onValueChange={setIsAnimating4}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsAnimating4(true)}
          disabled={isAnimating4}
        >
          開始動畫
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          功能說明
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>✅ 打字機動畫效果</li>
          <li>✅ 隨機字符逐漸變成目標文字</li>
          <li>✅ 支援英文和中文隨機字符</li>
          <li>✅ 可自訂動畫速度</li>
          <li>✅ 可自訂 HTML 標籤</li>
          <li>✅ 閃爍游標效果</li>
          <li>✅ 支援自動開始或手動觸發</li>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          使用範例
        </Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '13px'
          }}
        >
          {`// 基本用法 - 自動開始
<EnterLabel label="Hello World" />

// 中文動畫
<EnterLabel label="你好世界" randomLen="zh" />

// 手動觸發
<EnterLabel
  label="Manual Start"
  autoStart={false}
  value={isAnimating}
  onValueChange={setIsAnimating}
/>

// 自訂速度和標籤
<EnterLabel
  label="Custom Speed"
  speed={20}
  tagName="h1"
/>`}
        </Box>
      </Paper>
    </>
  );
}
