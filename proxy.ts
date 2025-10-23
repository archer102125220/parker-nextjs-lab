import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import contentSecurityPolicyMiddleware from '@/middleware/contentSecurityPolicy';
import globalTestMiddleware from '@/middleware/globalTest';
import i18nMiddleware from '@/middleware/i18n';
import logMiddleware from '@/middleware/log';

import {
  proxy as middlewareOne,
  exactProxy as exactMiddlewareOne
} from '@/app/[locale]/one/proxy';

// 靜態檔案相關設定
const STATIC_FILE_EXTENSIONS: RegExp =
  /\.(js|css|svg|jpg|jpeg|png|ico|gif|webp|txt|json|woff2?|ttf|eot|map)$/;
const STATIC_FILE_PREFIXES: Array<string> = [
  '/_next/static',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt'
];

// TODO
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const POLICY_MIDDLEWARE_SETTINGS: Array<Function> = [
  contentSecurityPolicyMiddleware
];

// TODO
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const GLOBAL_MIDDLEWARE_SETTINGS: Array<Function> = [
  globalTestMiddleware,
  i18nMiddleware,
  logMiddleware
];

type MiddlewareSetting = {
  patch: string;
  handler: (request: NextRequest) => Promise<NextResponse>;
  exact?: boolean;
};
const MIDDLEWARE_SETTINGS: Array<MiddlewareSetting> = [
  {
    patch: '/one',
    handler: exactMiddlewareOne,
    exact: true
  },
  {
    patch: '/one',
    handler: middlewareOne
  }
];

export async function proxy(request: NextRequest) {
  for (const middlewareHandler of POLICY_MIDDLEWARE_SETTINGS) {
    const middlewareResponse = await middlewareHandler(request);
    if (middlewareResponse) {
      return middlewareResponse; // 確保 CSP相關 Middleware 回傳了 NextResponse 在 return
    }
  }

  // 排除靜態檔案
  if (
    STATIC_FILE_EXTENSIONS.test(request.nextUrl.pathname) ||
    STATIC_FILE_PREFIXES.some((prefix) =>
      request.nextUrl.pathname.startsWith(prefix)
    )
  ) {
    return NextResponse.next();
  }

  for (const middlewareHandler of GLOBAL_MIDDLEWARE_SETTINGS) {
    const middlewareResponse = await middlewareHandler(request);
    if (middlewareResponse) {
      return middlewareResponse; // 如果全域 Middleware 回傳了 NextResponse，則直接返回
    }
  }

  const pathname = request.nextUrl.pathname;
  const middlewareSetting = MIDDLEWARE_SETTINGS.find(
    ({ patch, exact = false }) =>
      exact === false ? pathname.startsWith(patch) : pathname === patch
  );
  if (typeof middlewareSetting?.handler === 'function') {
    return await middlewareSetting.handler(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};
