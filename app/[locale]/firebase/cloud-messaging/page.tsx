import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import Box from '@mui/material/Box';

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
  const nonce = (await headers()).get('x-nonce') || '';

  const [webTokenList, androidTokenList, iosTokenList] = await Promise.all([
    messagingFindAllToken({ os: 'web' }),
    messagingFindAllToken({ os: 'android' }),
    messagingFindAllToken({ os: 'ios' })
  ]);
  const tokenList = {
    webTokenList: JSON.parse(JSON.stringify(webTokenList)),
    androidTokenList: JSON.parse(JSON.stringify(androidTokenList)),
    iosTokenList: JSON.parse(JSON.stringify(iosTokenList))
  };

  return (
    <main className={style.cloud_messaging_page}>
      <GTMScnOpen />
      <Box component="h1" sx={{ marginBottom: '8px' }} nonce={`nonce-${nonce}`}>
        FCM推播通知後台
      </Box>
      <CloudMessagingForm
        serverTokenList={tokenList}
        nonce={`nonce-${nonce}`}
      />
      <CloudMessagingDataTable
        serverTokenList={tokenList}
        nonce={`nonce-${nonce}`}
      />
    </main>
  );
}

export default FirebaseCloudMessagingPage;
