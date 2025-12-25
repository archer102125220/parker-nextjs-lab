import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const SwiperTest = dynamic(() => import('@/components/Demo/SwiperTest'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SwiperCustom 自訂輪播測試',
    description: '展示自訂 Swiper 輪播組件'
  };
}

export default function SwiperTestPage() {
  return (
    <section className={styles.swiper_test_page}>
      <h1>SwiperCustom 自訂輪播測試</h1>
      <p className={styles['swiper_test_page-description']}>
        展示自訂 Swiper 輪播組件
      </p>
      <SwiperTest />
    </section>
  );
}
