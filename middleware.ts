import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { middleware as middlewareOne } from '@/middleware/one';

// 定義靜態檔案的附檔名或路徑模式
const staticFileExtensions =
  /\.(js|css|svg|jpg|png|ico|gif|webp|txt|json|woff2?|ttf|eot|map)$/;
const staticFilePrefixes = [
  '/_next/static',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt'
];

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // 檢查是否為靜態檔案附檔名
  if (staticFileExtensions.test(pathname)) {
    return NextResponse.next(); // 允許 Next.js 處理靜態檔案
  }

  // 檢查是否為靜態檔案路徑前綴
  if (staticFilePrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next(); // 允許 Next.js 處理靜態檔案
  }

  // 如果不是靜態檔案，則執行你的其他 Middleware 邏輯
  console.log({ href: request.nextUrl?.href });

  if (pathname.startsWith('/one')) {
    return middlewareOne(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};
