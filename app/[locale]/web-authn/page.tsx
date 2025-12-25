import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import style from './page.module.scss';

const DemoWebAuthn = dynamic(() => import('@/components/Demo/WebAuthn'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'WebAuthn 生物辨識測試',
    description: '原生方式為主，套件用來編碼、解碼的方式實作'
  };
}

export default function WebAuthnPage() {
  return (
    <section className={style.web_authn_page}>
      <DemoWebAuthn />
    </section>
  );
}
