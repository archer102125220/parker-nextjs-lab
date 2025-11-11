'use client';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Error from 'next/error';

import { DefaultLayout } from '@/layout/default';

// This page renders when a route like `/unknown.txt` is requested.
// In this case, the layout at `app/[locale]/layout.tsx` receives
// an invalid value as the `[locale]` param and calls `notFound()`.

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.'
};

function GlobalNotFound(): ReactNode {
  return (
    <html lang="zh-tw">
      <body>
        <DefaultLayout>
          <Error statusCode={404} />
        </DefaultLayout>
      </body>
    </html>
  );
}

export default GlobalNotFound;
