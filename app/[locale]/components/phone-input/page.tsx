import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const PhoneInputTest = dynamic(
  () => import('@/components/Demo/PhoneInputTest'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PhoneInput 電話輸入組件測試',
    description: '展示電話號碼輸入、國碼選擇和驗證功能'
  };
}

export default function PhoneInputPage() {
  return (
    <div className={style.phone_input_test_page}>
      <h1>PhoneInput 電話輸入組件測試</h1>
      <p className={style['phone_input_test_page-description']}>
        展示電話號碼輸入、國碼選擇和驗證功能
      </p>
      <PhoneInputTest />
    </div>
  );
}

