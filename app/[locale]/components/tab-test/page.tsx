'use client';

import { useState } from 'react';
import { TabsBar, TabsContent } from '@/components/Tabs';
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
          1. 基本用法 - Bar + Content 組合
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          TabsBar 負責導航，TabsContent 負責內容顯示（函數式 children）
        </Typography>
        <TabsBar
          tabs={basicTabs}
          value={activeTab1}
          onChange={(value) => setActiveTab1(Number(value))}
        />
        <TabsContent
          tabs={basicTabs}
          value={activeTab1}
          onChange={(value) => setActiveTab1(Number(value))}
          height="200px"
        >
          {(tab, index, isActive) => (
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6">{tab.label} 內容</Typography>
              <Typography>這是第 {index + 1} 個 Tab 的內容區域</Typography>
              <Typography variant="caption" color="text.secondary">
                狀態: {isActive ? '✅ 活躍' : '⚪ 非活躍'}
              </Typography>
            </Box>
          )}
        </TabsContent>
      </Paper>

      {/* 多個 Tabs - 展示導航功能 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          2. 多個 Tabs - 自動導航按鈕（絕對定位）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          當 Tabs 過多時，會自動顯示左右導航按鈕。設定 isNavigationAbsolute=true
          讓按鈕懸浮，不佔用空間！
        </Typography>
        <TabsBar
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
        <TabsBar
          tabs={fullWidthTabs}
          value={activeTab3}
          onChange={(value) => setActiveTab3(Number(value))}
          variant="fullWidth"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          當前選中: {fullWidthTabs.find((t) => t.value === activeTab3)?.label}
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
        <TabsBar
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
        <TabsBar tabs={manyTabs.slice(0, 10)} hasNavigation={false} />
      </Paper>

      {/* 垂直模式 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          6. 垂直模式（絕對定位）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          設定 vertical=true 可切換為垂直布局，配合 isNavigationAbsolute
          讓導航按鈕懸浮
        </Typography>
        <TabsBar
          tabs={manyTabs}
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
        <TabsBar tabs={manyTabs.slice(0, 10)} isNavigationAbsolute={false} />
      </Paper>

      {/* 垂直模式 - 相對定位 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          8. 垂直模式（相對定位）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          垂直布局 + 相對定位，導航按鈕保留空間
        </Typography>
        <TabsBar
          tabs={manyTabs}
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
        <TabsBar
          tabs={manyTabs.slice(0, 12)}
          variant="fullWidth"
          isNavigationAbsolute
        />
      </Paper>

      {/* 滾動事件 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          10. 滾動事件監聽 ⭐ NEW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          支持 onScroll 和 onScrollEnd 事件回調
        </Typography>
        <TabsBar tabs={manyTabs} />
      </Paper>

      {/* 漸變陰影 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          11. 漸變陰影提示 ⭐ NEW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          邊緣漸變陰影提示可滾動區域（默認開啟）
        </Typography>
        <TabsBar tabs={manyTabs} limitShadow={true} />
      </Paper>

      {/* 禁用滾動 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          12. 禁用滾動功能
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          禁用滾輪和拖動滾動
        </Typography>
        <TabsBar tabs={manyTabs.slice(0, 10)} scrollDisable={true} />
      </Paper>

      {/* Ripple 波紋效果 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          13. Ripple 波紋效果 ⭐ NEW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Material Design 點擊波紋（默認淡灰色，可自訂顏色）
        </Typography>
        <TabsBar
          tabs={basicTabs.slice(0, 3)}
          ripple={true}
          rippleColor="rgba(25, 118, 210, 0.3)"
        />
      </Paper>

      {/* Hover 臨時指示器 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          14. Hover 臨時指示器 ⭐ NEW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          鼠標懸停時顯示臨時指示器預覽
        </Typography>
        <TabsBar
          tabs={basicTabs.slice(0, 3)}
          hover={true}
          indicatorColor="#ff5722"
          selectedColor="#ff5722"
        />
      </Paper>

      {/* 進階樣式配置 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          15. 進階樣式配置 ⭐ NEW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          自訂 gap、justifyContent、alignItems
        </Typography>
        <TabsBar
          tabs={fullWidthTabs}
          gap={24}
          justifyContent="center"
          alignItems="center"
          indicatorColor="#9c27b0"
          selectedColor="#9c27b0"
        />
      </Paper>

      {/* 完整功能組合 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          16. TabsContent 靜態內容 ⭐ NEW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          使用 tab.content 屬性提供靜態內容
        </Typography>
        <TabsBar
          tabs={[
            {
              label: '介紹',
              value: 'intro',
              content: (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    歡迎使用 Tabs 組件
                  </Typography>
                  <Typography>
                    這是一個功能完整的 Tabs 組件，支持多種模式和配置。
                  </Typography>
                </Box>
              )
            },
            {
              label: '功能',
              value: 'features',
              content: (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    主要功能
                  </Typography>
                  <ul>
                    <li>導航按鈕自動顯示/隱藏</li>
                    <li>滾輪和拖動滾動</li>
                    <li>Ripple 波紋效果</li>
                    <li>Hover 臨時指示器</li>
                  </ul>
                </Box>
              )
            },
            {
              label: '文檔',
              value: 'docs',
              content: (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    使用文檔
                  </Typography>
                  <Typography>
                    查看完整的 API 文檔和使用示例。
                  </Typography>
                </Box>
              )
            }
          ]}
          value={activeTab2}
          onChange={(value) => setActiveTab2(Number(value))}
        />
        <TabsContent
          tabs={[
            {
              label: '介紹',
              value: 'intro',
              content: (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    歡迎使用 Tabs 組件
                  </Typography>
                  <Typography>
                    這是一個功能完整的 Tabs 組件，支持多種模式和配置。
                  </Typography>
                </Box>
              )
            },
            {
              label: '功能',
              value: 'features',
              content: (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    主要功能
                  </Typography>
                  <ul>
                    <li>導航按鈕自動顯示/隱藏</li>
                    <li>滾輪和拖動滾動</li>
                    <li>Ripple 波紋效果</li>
                    <li>Hover 臨時指示器</li>
                  </ul>
                </Box>
              )
            },
            {
              label: '文檔',
              value: 'docs',
              content: (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    使用文檔
                  </Typography>
                  <Typography>
                    查看完整的 API 文檔和使用示例。
                  </Typography>
                </Box>
              )
            }
          ]}
          value={activeTab2}
          onChange={(value) => setActiveTab2(Number(value))}
          height="300px"
        />
      </Paper>

      {/* 完整功能組合 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          17. 完整功能組合 🎉
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          所有功能一起使用：導航、陰影、波紋、懸停、自訂樣式
        </Typography>
        <TabsBar
          tabs={manyTabs}
          isNavigationAbsolute
          limitShadow={true}
          ripple={true}
          hover={true}
          gap={8}
          indicatorColor="#4caf50"
          selectedColor="#4caf50"
        />
      </Paper>
    </Box>
  );
}
