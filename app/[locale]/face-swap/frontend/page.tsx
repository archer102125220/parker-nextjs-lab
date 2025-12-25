import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const DemoFaceSwapFrontend = dynamic(
  () => import('@/components/Demo/FaceSwapFrontend')
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '純前端人臉替換',
    description: '使用瀏覽器端 face-api.js 進行即時人臉替換'
  };
}

export default function FaceSwapFrontendPage() {
  return (
    <section className={style.face_swap_frontend_page}>
      <DemoFaceSwapFrontend />
    </section>
  );
}
