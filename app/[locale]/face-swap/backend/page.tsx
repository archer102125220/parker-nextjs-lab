import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const DemoFaceSwapBackend = dynamic(
  () => import('@/components/Demo/FaceSwapBackend')
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '後端 AI 人臉替換',
    description: '使用 Node.js 後端 + TensorFlow.js 進行高精度人臉替換'
  };
}

export default function FaceSwapBackendPage() {
  return (
    <section className={style.face_swap_backend_page}>
      <DemoFaceSwapBackend />
    </section>
  );
}
