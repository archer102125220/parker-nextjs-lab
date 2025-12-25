import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TabTest = dynamic(() => import('@/components/Demo/TabTest'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tabs 分頁組件測試',
    description: '展示重構後的 Tabs 組件功能：導航按鈕、滾動處理、自訂顏色等'
  };
}

export default function TabTestPage() {
  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Tabs 分頁組件測試
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        展示重構後的 Tabs 組件功能：導航按鈕、滾動處理、自訂顏色等
      </Typography>
      <TabTest />
    </Box>
  );
}
