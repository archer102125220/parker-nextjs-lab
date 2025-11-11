import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ReduxInit } from '@/components/ReduxInit';
import { MuiCacheProvider } from '@/components/MuiCacheProvider';
import MuiThemeProvider from '@/components/MuiThemeProvider';

import { AxiosInit } from '@/components/AxiosInit';
import { GAInit } from '@/components/Google/GAInit';
import { GTMInit } from '@/components/Google/GTMInit';
import { FirebaseInit } from '@/components/FirebaseInit';
import { NotificationPermission } from '@/components/NotificationPermission';

export type BodyProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
  locale: string;
  nonce?: string;
};

export function Body(props: BodyProps): ReactNode {
  const { children, params, locale, nonce } = props;

  return (
    <body>
      <NextIntlClientProvider locale={locale}>
        <ReduxInit params={params} nonce={nonce}>
          <MuiCacheProvider nonce={nonce}>
            <MuiThemeProvider>
              <AxiosInit apiBase={process.env.NEXT_PUBLIC_API_BASE} />
              <GAInit
                gaId={process.env.NEXT_PUBLIC_GA_ID || ''}
                nonce={nonce}
              />
              <GTMInit
                gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''}
                nonce={nonce}
              />
              <FirebaseInit
                apiKey={process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}
                authDomain="parker-nextjs-lab.firebaseapp.com"
                projectId="parker-nextjs-lab"
                storageBucket="parker-nextjs-lab.firebasestorage.app"
                messagingSenderId={
                  process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || ''
                }
                appId={process.env.NEXT_PUBLIC_APP_ID || ''}
                measurementId={process.env.NEXT_PUBLIC_GA_ID || ''}
              />
              <Analytics />
              <SpeedInsights />
              <NotificationPermission />
              {children}
            </MuiThemeProvider>
          </MuiCacheProvider>
        </ReduxInit>
      </NextIntlClientProvider>
    </body>
  );
}

export default Body;
