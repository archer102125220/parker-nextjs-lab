// import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, CacheFirst, StaleWhileRevalidate } from 'serwist';
import { cleanupOutdatedCaches } from '@serwist/precaching';

import '@/service-worker/firebase-messaging';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// https://unminify.com/ // minify 還原用網址

cleanupOutdatedCaches();

const serwist = new Serwist({
  // 這裡的 __SW_MANIFEST 會在打包時由 @serwist/next 自動注入
  // 包含了所有需要預先快取的檔案列表，預先快取靜態檔案
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // runtimeCaching: defaultCache,
  runtimeCaching: [
    // POST做快取會因為Service Workers會再背景再叫一次api，而瀏覽器並不允許這種兩個不同JS線程重複呼叫相同POST API的行為，
    // 因此會出現error並無法有效將資料做快取，經查找資料疑似與幕等性有關
    // 關於http的冪等性：https://medium.com/willhanchen/%E9%97%9C%E6%96%BChttp%E7%9A%84%E5%86%AA%E7%AD%89%E6%80%A7-4438381d0a70
    // Service Workers 的 Cache API 不能快取 POST https://stackoverflow.com/questions/53639134/request-method-post-is-unsupported
    // {
    //   method: 'POST',
    //   matcher: new RegExp(
    //     `^${process.env.NEXT_PUBLIC_API_BASE || '/api'}`,
    //     'i'
    //   ),
    //   handler: new StaleWhileRevalidate({
    //     cacheName: 'post-api-cache',
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
    //             (typeof request?.headers?.get === 'function' &&
    //               request.headers.get('X-Is-Cacheable') === 'true')
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
    //           const { response } = fetchResponse;

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
    //         }
    //       }
    //     ]
    //   })
    // },
    {
      method: 'GET',
      matcher: new RegExp(
        `^${process.env.NEXT_PUBLIC_API_BASE || '/api'}`,
        'i'
      ),
      handler: new CacheFirst({
        cacheName: 'api-cache',
        plugins: [
          {
            cacheKeyWillBeUsed(cacheKeyResponse) {
              const request = cacheKeyResponse.request;
              if (
                cacheKeyResponse.mode === 'write' ||
                (typeof request?.headers?.get === 'function' &&
                  request.headers.get('X-Is-Cacheable') === 'true')
              ) {
                return cacheKeyResponse.request;
              }
            }
          }
        ]
      })
    },
    {
      method: 'GET',
      matcher: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'google-fonts-cache'
      })
    },
    {
      method: 'GET',
      matcher: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'gstatic-fonts-cache'
      })
    }
  ]
});

serwist.addEventListeners();
