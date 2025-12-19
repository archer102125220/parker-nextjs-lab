'use client';

import { useState } from 'react';
import Tabs from '@/components/Tabs';
import TabPanel from '@/components/Tabs/TabPanel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function TabTestPage() {
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);
  const [activeTab3, setActiveTab3] = useState(0);
  const [activeTab4, setActiveTab4] = useState(0);

  const basicTabs = [
    { label: 'Tab 1', value: 0 },
    { label: 'Tab 2', value: 1 },
    { label: 'Tab 3', value: 2 },
    { label: 'Tab 4 (Disabled)', value: 3, disabled: true }
  ];

  const manyTabs = Array.from({ length: 15 }, (_, i) => ({
    label: `Tab ${i + 1}`,
    value: i
  }));

  const fullWidthTabs = [
    { label: '首頁', value: 0 },
    { label: '產品', value: 1 },
    { label: '服務', value: 2 },
    { label: '關於', value: 3 }
  ];

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Tabs 分頁組件測試
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        展示重構後的 Tabs 組件功能：導航按鈕、滾動處理、自訂顏色等
      </Typography>

      {/* 基本用法 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          1. 基本用法 - 標準模式
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          基本的 Tab 切換，包含禁用狀態
        </Typography>
        <Tabs
          tabs={basicTabs}
          value={activeTab1}
          onChange={(value) => setActiveTab1(Number(value))}
        />
        <Box sx={{ mt: 2 }}>
          <TabPanel value={0} activeValue={activeTab1}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6">Tab 1 內容</Typography>
              <Typography>這是第一個 Tab 的內容區域</Typography>
            </Box>
          </TabPanel>
          <TabPanel value={1} activeValue={activeTab1}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6">Tab 2 內容</Typography>
              <Typography>這是第二個 Tab 的內容區域</Typography>
            </Box>
          </TabPanel>
          <TabPanel value={2} activeValue={activeTab1}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6">Tab 3 內容</Typography>
              <Typography>這是第三個 Tab 的內容區域</Typography>
            </Box>
          </TabPanel>
        </Box>
      </Paper>

      {/* 多個 Tabs - 展示導航功能 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          2. 多個 Tabs - 自動導航按鈕（絕對定位）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          當 Tabs 過多時，會自動顯示左右導航按鈕。設定 isNavigationAbsolute=true 讓按鈕懸浮，不佔用空間！
        </Typography>
        <Tabs
          tabs={manyTabs}
          value={activeTab2}
          onChange={(value) => setActiveTab2(Number(value))}
          isNavigationAbsolute
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          當前選中: Tab {activeTab2 + 1}
        </Typography>
      </Paper>

      {/* Full Width 模式 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          3. Full Width 模式
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tabs 平均分配寬度，適合固定數量的選項
        </Typography>
        <Tabs
          tabs={fullWidthTabs}
          value={activeTab3}
          onChange={(value) => setActiveTab3(Number(value))}
          variant="fullWidth"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          當前選中: {fullWidthTabs.find(t => t.value === activeTab3)?.label}
        </Typography>
      </Paper>

      {/* 自訂顏色 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          4. 自訂顏色
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          可自訂指示器顏色和選中文字顏色
        </Typography>
        <Tabs
          tabs={basicTabs.slice(0, 3)}
          value={activeTab4}
          onChange={(value) => setActiveTab4(Number(value))}
          indicatorColor="#9c27b0"
          selectedColor="#9c27b0"
        />
      </Paper>

      {/* 無導航按鈕 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          5. 禁用導航按鈕
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          設定 hasNavigation=false 可隱藏導航按鈕
        </Typography>
        <Tabs
          tabs={manyTabs.slice(0, 10)}
          hasNavigation={false}
        />
      </Paper>

      {/* 垂直模式 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          6. 垂直模式（絕對定位）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          設定 vertical=true 可切換為垂直布局，配合 isNavigationAbsolute 讓導航按鈕懸浮
        </Typography>
        <Tabs
          tabs={manyTabs.slice(0, 8)}
          vertical
          isNavigationAbsolute
          indicatorColor="#ff5722"
          selectedColor="#ff5722"
        />
      </Paper>

      {/* 相對定位導航 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          7. 相對定位導航（水平）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          默認模式下，導航按鈕在文檔流中，會保留空白空間
        </Typography>
        <Tabs
          tabs={manyTabs.slice(0, 10)}
          isNavigationAbsolute={false}
        />
      </Paper>

      {/* 垂直模式 - 相對定位 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          8. 垂直模式（相對定位）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          垂直布局 + 相對定位，導航按鈕保留空間
        </Typography>
        <Tabs
          tabs={manyTabs.slice(0, 8)}
          vertical
          isNavigationAbsolute={false}
          indicatorColor="#4caf50"
          selectedColor="#4caf50"
        />
      </Paper>

      {/* Full Width + 導航 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          9. Full Width + 導航按鈕
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Full Width 模式配合導航按鈕（需要較多 tabs）
        </Typography>
        <Tabs
          tabs={manyTabs.slice(0, 12)}
          variant="fullWidth"
          isNavigationAbsolute
        />
      </Paper>
    </Box>
  );
}
