import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from '@serwist/next';

// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
const withNextIntl = createNextIntlPlugin();

// https://serwist.pages.dev/docs/next/getting-started
const withSerwist = withSerwistInit({
  swSrc: './service-worker/service-worker.ts', // where the service worker src is
  swDest: './public/sw.js', // where the service worker code will end up
  scope: '/'
});

const nextConfig: NextConfig = withSerwist(
  withNextIntl({
    /* config options here */
    sassOptions: {
      additionalData:
        '@use "@/styles/variable.scss" as *; @use "@/styles/mixin.scss" as *;'
    }
  })
);

export default nextConfig;
