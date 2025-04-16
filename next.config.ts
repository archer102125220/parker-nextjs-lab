import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from '@ducanh2912/next-pwa';

// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
const withNextIntl = createNextIntlPlugin();

// https://ducanh-next-pwa.vercel.app/docs
const withPWA = withPWAInit({
  dest: 'public',
  scope: '/',
  cacheStartUrl: true,

  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      // {
      //   urlPattern: new RegExp(`^${process.env.API_BASE || '/api'}`, 'i'),
      //   handler: 'StaleWhileRevalidate',
      //   // POST做快取會因為Service Workers會再背景再叫一次api，而瀏覽器並不允許這種呼叫兩次同隻POST API的行為，
      //   // 因此會出現error並無法有效將資料做快取，經查找資料疑似與幕等性有關
      //   // 關於http的冪等性：https://medium.com/willhanchen/%E9%97%9C%E6%96%BChttp%E7%9A%84%E5%86%AA%E7%AD%89%E6%80%A7-4438381d0a70
      //   // Service Workers 的 Cache API 不能快取 POST https://stackoverflow.com/questions/53639134/request-method-post-is-unsupported
      //   method: 'POST',
      //   options: {
      //     cacheName: 'post-api-cache',
      //     expiration: {
      //       maxEntries: 10,
      //       maxAgeSeconds: 60 * 2
      //     },
      //     plugins: [
      //       {
      //         handlerWillStart: async (willStartResponse) => {
      //           console.log({ willStartResponse });
      //         },
      //         requestWillFetch: async (willFetchResponse) => {
      //           console.log({ willFetchResponse });

      //           return willFetchResponse.request;
      //         },
      //         // handlerDidRespond 之後還會再執行一次 cacheKeyWillBeUsed
      //         cacheKeyWillBeUsed: async (cacheKeyResponse) => {
      //           console.log({ cacheKeyResponse });
      //           const request = cacheKeyResponse.request;

      //           if (
      //             cacheKeyResponse.mode === 'write' ||
      //             (typeof request?.headers?.get === 'function' && request.headers.get('X-Is-Cacheable') === 'true')
      //           ) {

      //             return cacheKeyResponse.request;
      //           }
      //         },
      //         cachedResponseWillBeUsed: async (response) => {
      //           console.log({ response });
      //           const { cachedResponse } = response;

      //           if (typeof cachedResponse?.clone === 'function') {
      //             const responseClone = cachedResponse.clone();
      //             console.log({ response, responseClone });
      //             return responseClone;
      //           }

      //           // return response;
      //         },
      //         fetchDidSucceed: async (fetchResponse) => {
      //           console.log({ fetchResponse });
      //           const { response } = fetchResponse

      //           if (typeof response?.clone === 'function') {
      //             const responseClone = response.clone();
      //             console.log({ response, responseClone });
      //             return responseClone;
      //           }

      //           return response;
      //         },
      //         handlerWillRespond: async (willResponse) => {
      //           console.log({ willResponse });

      //           return willResponse.response;
      //         },
      //         handlerDidRespond: async (didResponse) => {
      //           console.log({ didResponse });
      //         },
      //         cacheWillUpdate: async (cacheWillUpdate) => {
      //           console.log({ cacheWillUpdate });

      //           return cacheWillUpdate.response;
      //         },
      //         handlerDidComplete: async (didCompleteResponse) => {
      //           console.log({ didCompleteResponse });
      //         },

      //         cacheDidUpdate: async (cacheDidUpdate) => {
      //           console.log({ cacheDidUpdate });

      //           return cacheDidUpdate.response;
      //         },
      //         fetchDidFail: async (fetchFailResponse) => {
      //           console.log({ fetchFailResponse });
      //         },
      //         handlerDidError: async (didErrorResponse) => {
      //           console.log({ didErrorResponse });
      //         },
      //       },
      //     ],
      //   }
      // },
      {
        urlPattern: new RegExp(`^${process.env.API_BASE || '/api'}`, 'i'),
        handler: 'CacheFirst',
        method: 'GET',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 2
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
          plugins: [
            {
              cacheKeyWillBeUsed: async function (cacheKeyResponse) {
                const request = cacheKeyResponse.request;
                if (
                  cacheKeyResponse.mode === 'write' ||
                  (typeof request?.headers?.get === 'function' &&
                    request.headers.get('X-Is-Cacheable') === 'true')
                ) {
                  return cacheKeyResponse.request;
                }
                return '';
              }
            }
          ]
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  },
  fallbacks: undefined
});

const nextConfig: NextConfig = withPWA(
  withNextIntl({
    /* config options here */
    sassOptions: {
      additionalData:
        '@use "@/styles/variable.scss" as *; @use "@/styles/mixin.scss" as *;'
    }
  })
);

export default nextConfig;
