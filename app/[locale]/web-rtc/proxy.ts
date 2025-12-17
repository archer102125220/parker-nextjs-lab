import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// UUID v4 regex pattern
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * WebRTC 房間 UUID 生成 Middleware
 *
 * 當用戶訪問 /web-rtc/{signaling-method}/room 但沒有提供 roomId 時，
 * 自動生成 UUID 並重定向到房間頁面
 *
 * 須至 @/proxy.ts 中註冊 middleware 處理事件
 */
export async function generateRoomUuidProxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 匹配 /[locale]/web-rtc/{method}/room 模式 (結尾是 /room 或 /room/)
  const roomPattern =
    /^\/[a-z]{2}(-[A-Z]{2})?\/web-rtc\/(server-sent-event|socket-io|websocket)\/room\/?$/;

  if (roomPattern.test(pathname)) {
    console.log('[WebRTC Middleware] Generating UUID for room:', pathname);
    const newRoomId = uuidv4();
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `${pathname.replace(/\/$/, '')}/${newRoomId}`;
    return NextResponse.redirect(newUrl);
  }

  return undefined;
}

/**
 * WebRTC 房間 UUID 驗證 Middleware
 *
 * 驗證房間 UUID 格式是否有效
 * 若無效則重定向回房間建立頁面
 *
 * 須至 @/proxy.ts 中註冊 middleware 處理事件
 */
export async function checkRoomUuidProxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 匹配 /[locale]/web-rtc/{method}/room/{roomId} 模式
  const roomWithIdPattern =
    /^\/([a-z]{2}(-[A-Z]{2})?)\/web-rtc\/(server-sent-event|socket-io|websocket)\/room\/(.+)$/;
  const match = pathname.match(roomWithIdPattern);

  if (match) {
    const locale = match[1];
    const method = match[3];
    const roomId = match[4];

    // 驗證 UUID 格式
    if (!UUID_PATTERN.test(roomId)) {
      console.log('[WebRTC Middleware] Invalid UUID format:', roomId);
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/${locale}/web-rtc/${method}`;
      newUrl.searchParams.set('error', 'invalid-room-id');
      return NextResponse.redirect(newUrl);
    }
  }

  return undefined;
}

/**
 * WebRTC 前綴匹配 Middleware (用於一般情況)
 */
export async function proxy(request: NextRequest) {
  // 先執行 UUID 生成檢查
  const generateResponse = await generateRoomUuidProxy(request);
  if (generateResponse) return generateResponse;

  // 再執行 UUID 驗證檢查
  const checkResponse = await checkRoomUuidProxy(request);
  if (checkResponse) return checkResponse;

  return NextResponse.next();
}
