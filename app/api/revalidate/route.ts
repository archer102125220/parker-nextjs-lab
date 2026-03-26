// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. 安全機制：確認呼叫這個 API 的人是我們的後端，而不是惡意攻擊者
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ message: '無效的憑證' }, { status: 401 });
  }

  try {
    // 2. 解析後端傳來的資料，看看是哪個區塊需要更新
    const body = await request.json();
    const tag = body.tag; // 例如後端傳來 { "tag": "product-price-123" }

    if (tag) {
      // 3. 呼叫核心 API：清除指定標籤的快取，並觸發重新渲染
      revalidateTag(tag, 'max');
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    return NextResponse.json({ revalidated: false, message: '缺少 tag 參數' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '重新驗證失敗' }, { status: 500 });
  }
}
