/**
 * WARNING: 此程式碼是從別的專案複製過來的，建議使用時需要詳細測試
 * - 需要設定有效的 NEXT_PUBLIC_FACEBOOK_APP_ID 環境變數
 * - 需要在 Facebook Developer Console 完成應用程式設定
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { request as axios } from '@/utils/request';

const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { accessToken } = body;

    const url = `https://graph.facebook.com/me?client_id=${APP_ID}&access_token=${accessToken}`;
    const reslut = await axios.get(url);

    console.log({ url, reslut });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 500 }
    );
  }
}
