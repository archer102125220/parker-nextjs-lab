import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import CloudMessagingForm from '@/components/CloudMessaging/Form';

import style from '@/app/[locale]/firebase/cloud-messaging/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FCM推播通知後台',
    description: 'FCM推播通知後台'
  };
}

function FirebaseCloudMessagingPage(): ReactNode {
  return (
    <main className={style.firebase_cloud_messaging_page}>
      <GTMScnOpen />
      <h1>尚未串接完成</h1>
      <h1>FCM推播通知後台</h1>
      <CloudMessagingForm />
    </main>
  );
}

export default FirebaseCloudMessagingPage;
