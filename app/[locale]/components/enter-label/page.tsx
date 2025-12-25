import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';

const EnterLabelTestClient = dynamic(() => import('@/components/Demo/EnterLabelTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'EnterLabel 打字機動畫測試',
    description: '展示隨機字符逐漸變成目標文字的打字機動畫效果'
  };
}

export default function EnterLabelTestPage() {
  return (
    <Box sx={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <GTMScnOpen />
      <EnterLabelTestClient />
    </Box>
  );
}
