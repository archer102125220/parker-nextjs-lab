/**
 * WARNING: 此程式碼是從別的專案複製過來的，建議使用時需要詳細測試
 * - 需要設定有效的 NEXT_PUBLIC_GOOGLE_CLIENT_ID 環境變數
 * - 需要在 Google Cloud Console 完成 OAuth 設定
 */

import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const client = CLIENT_ID ? new OAuth2Client(CLIENT_ID) : null;

interface VerifyRequest {
  accessToken: string;
}

/**
 * Google OAuth 驗證 API
 *
 * 使用 Google Auth Library 驗證從前端傳入的 Google ID Token
 * 驗證權杖的有效性並回傳驗證結果
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

    if (!client || !CLIENT_ID) {
      return NextResponse.json(
        { error: 'Google Client ID not configured' },
        { status: 500 }
      );
    }

    // Verify ID token with Google Auth Library
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log('Google OAuth payload:', payload);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified
      }
    });
  } catch (error) {
    console.error('Google OAuth verify error:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 401 }
    );
  }
}
