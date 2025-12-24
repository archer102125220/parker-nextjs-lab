/**
 * WARNING: 此程式碼是從別的專案複製過來的，建議使用時需要詳細測試
 * - 需要設定有效的 LINE Login Channel
 * - 需要在 LINE Developers Console 完成應用程式設定
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { request as axios } from '@/utils/request';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { accessToken } = body;

    const url = 'https://api.line.me/oauth2/v2.1/verify';
    const reslut = await axios.get(url, { access_token: accessToken });

    console.log({ url, reslut });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 500 }
    );
  }
}
