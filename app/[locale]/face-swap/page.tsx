import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const FaceSwapIndex = dynamic(
  () => import('@/components/Demo/FaceSwapIndex'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI 人臉替換',
    description: '選擇實作版本：純前端版本或後端 AI 版本'
  };
}

export default function FaceSwapPage() {
  return (
    <section className={style.face_swap_page}>
      <FaceSwapIndex />
    </section>
  );
}
