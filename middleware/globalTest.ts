import type { NextRequest, NextResponse } from 'next/server';

export async function globalTestMiddleware(
  request: NextRequest
): Promise<NextResponse | void> {
  console.log('____global____');
  console.log({ href: request.nextUrl.href });

  // 如果需要提前終止請求或重導向，可以直接 return NextResponse
  // 例如：
  // if (request.headers.get('x-block-global')) {
  //   return NextResponse.json({ error: 'Blocked globally' }, { status: 403 });
  // }

  // 如果沒有 return NextResponse，則繼續執行後續的 Middleware
  return;
}

export default globalTestMiddleware;
