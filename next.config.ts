import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from '@serwist/next';

// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// https://serwist.pages.dev/docs/next/getting-started
const withSerwist = withSerwistInit({
  swSrc: './service-worker/service-worker.ts', // where the service worker src is
  swDest: './public/sw.js', // where the service worker code will end up
  scope: '/'
});

const nextConfig: NextConfig = withSerwist(
  withNextIntl({
    webpack(config, { isServer }) {
      if (isServer) {
        // Add canvas as external for server-side to prevent webpack bundling
        config.externals = config.externals || [];
        if (Array.isArray(config.externals)) {
          config.externals.push('canvas');
        }
      }
      return config;
    },
    transpilePackages: ['mui-color-input', 'jest-axe'],
    /* config options here */
    sassOptions: {
      additionalData:
        '@use "@/styles/variable.scss" as *; @use "@/styles/mixin.scss" as *;'
    },
    // Socket.IO and canvas need to be external for server-side
    serverExternalPackages: ['socket.io', 'engine.io', 'canvas']
  })
);

export default nextConfig;
