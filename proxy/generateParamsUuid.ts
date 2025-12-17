import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// UUID v4 regex pattern
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 需要 UUID 的路由清單
 * 格式: { pattern: RegExp, parentPath: string }
 * - pattern: 匹配需要生成 UUID 的路由（結尾是 /room 或類似的）
 * - parentPath: 無效 UUID 時重定向的父路徑
 */
const UUID_ROUTES = [
  // WebRTC routes
  {
    pattern:
      /^\/[a-z]{2}(-[A-Z]{2})?\/web-rtc\/(server-sent-event|socket-io|websocket)\/room\/?$/,
    uuidPattern:
      /^\/([a-z]{2}(-[A-Z]{2})?)\/web-rtc\/(server-sent-event|socket-io|websocket)\/room\/(.+)$/,
    getParentPath: (locale: string, method: string) =>
      `/${locale}/web-rtc/${method}`
  },
  // SSE Test routes
  {
    pattern:
      /^\/[a-z]{2}(-[A-Z]{2})?\/server-sent-event-test\/(room-get|room-post)\/?$/,
    uuidPattern:
      /^\/([a-z]{2}(-[A-Z]{2})?)\/server-sent-event-test\/(room-get|room-post)\/(.+)$/,
    getParentPath: (locale: string, method: string) =>
      `/${locale}/server-sent-event-test/${method}`
  }
];

/**
 * 全域 UUID 生成 Middleware
 *
 * 當用戶訪問需要 UUID 的路由但沒有提供時，
 * 自動生成 UUID 並重定向
 */
export default async function generateParamsUuidMiddleware(
  request: NextRequest
) {
  const pathname = request.nextUrl.pathname;

  // 檢查是否匹配需要生成 UUID 的路由
  for (const route of UUID_ROUTES) {
    if (route.pattern.test(pathname)) {
      console.log('[UUID Middleware] Generating UUID for:', pathname);
      const newRoomId = uuidv4();
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `${pathname.replace(/\/$/, '')}/${newRoomId}`;
      return NextResponse.redirect(newUrl);
    }
  }

  // 檢查已有 UUID 的路由是否格式正確
  for (const route of UUID_ROUTES) {
    const match = pathname.match(route.uuidPattern);
    if (match) {
      const locale = match[1];
      const method = match[3];
      const uuId = match[4];

      // 驗證 UUID 格式
      if (!UUID_PATTERN.test(uuId)) {
        console.log('[UUID Middleware] Invalid UUID format:', uuId);
        const newUrl = request.nextUrl.clone();
        newUrl.pathname = route.getParentPath(locale, method);
        newUrl.searchParams.set('error', 'invalid-room-id');
        return NextResponse.redirect(newUrl);
      }
    }
  }

  return undefined;
}
