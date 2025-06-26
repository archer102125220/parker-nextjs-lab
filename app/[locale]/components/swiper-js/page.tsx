import type { Metadata } from 'next';
import SwiperJsDemo from './SwiperJsDemo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Swiper.js 元件演示',
    description: 'Swiper.js 元件演示'
  };
}

export default function SwiperJsDemoPage() {
  return <SwiperJsDemo />;
}
