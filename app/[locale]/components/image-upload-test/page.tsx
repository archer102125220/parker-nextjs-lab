import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const ImageUploadTest = dynamic(
  () => import('@/components/Demo/ImageUploadTest'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'ImageUpload 圖片上傳測試',
    description: '展示圖片上傳組件的各種用法'
  };
}

export default function ImageUploadTestPage() {
  return (
    <div className={style.image_upload_test_page}>
      <h1>ImageUpload 圖片上傳測試</h1>
      <p className={style['image_upload_test_page-description']}>
        展示圖片上傳組件的各種用法
      </p>
      <ImageUploadTest />
    </div>
  );
}
