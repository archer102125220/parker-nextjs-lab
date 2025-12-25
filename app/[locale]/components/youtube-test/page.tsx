import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const YoutubeTestClient = dynamic(() => import('@/components/Demo/YoutubeTest'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Youtube 播放器測試',
    description: '測試 YouTube 影片嵌入播放功能'
  };
}

export default function YoutubeTestPage() {
  return (
    <section className={styles.youtube_test_page}>
      <GTMScnOpen />
      <YoutubeTestClient />
    </section>
  );
}
