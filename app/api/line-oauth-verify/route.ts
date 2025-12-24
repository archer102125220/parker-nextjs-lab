/**
 * WARNING: 此程式碼是從別的專案複製過來的，建議使用時需要詳細測試
 * - 需要設定有效的 LINE Login Channel
 * - 需要在 LINE Developers Console 完成應用程式設定
 */

import { NextResponse } from 'next/server';

interface VerifyRequest {
  accessToken: string;
}

interface LineVerifyResponse {
  scope?: string;
  client_id?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

/**
 * LINE OAuth 驗證 API
 *
 * 驗證從前端傳入的 LINE 存取權杖是否有效
 * 透過 LINE OAuth API 驗證權杖並回傳驗證結果
 */
export async function POST(request: Request) {
  try {
    const body: VerifyRequest = await request.json();
    const { accessToken } = body;

    if (!accessToken || typeof accessToken !== 'string') {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Verify token with LINE API
    const url = `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`;
    const response = await fetch(url);
    const result: LineVerifyResponse = await response.json();

    console.log('LINE OAuth verify:', { result });

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error_description || result.error },
        { status: 401 }
      );
    }

    // Get user profile
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const profile = await profileResponse.json();

    return NextResponse.json({
      success: true,
      expiresIn: result.expires_in,
      user: {
        id: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      }
    });
  } catch (error) {
    console.error('LINE OAuth verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
