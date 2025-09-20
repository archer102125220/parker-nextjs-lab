import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { messagingFindAllToken } from '@/services/server/firebase-messaging';

import GTMScnOpen from '@/components/Google/GTMScnOpen';
import CloudMessagingForm from '@/components/CloudMessaging/Form';
import CloudMessagingDataTable from '@/components/CloudMessaging/DataTable';

import style from '@/app/[locale]/firebase/cloud-messaging/page.module.scss';

export function generateMetadata(): Metadata {
  return {
    title: 'FCM推播通知後台',
    description: 'FCM推播通知後台'
  };
}

async function FirebaseCloudMessagingPage(): Promise<ReactNode> {
  const tokenList = await messagingFindAllToken();
  console.log(tokenList);

  return (
    <main className={style.cloud_messaging_page}>
      <GTMScnOpen />
      <h1>尚未串接完成</h1>
      <h1>FCM推播通知後台</h1>
      <CloudMessagingForm />
      <CloudMessagingDataTable tokenList={tokenList} />
    </main>
  );
}

export default FirebaseCloudMessagingPage;
