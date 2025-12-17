import { NextResponse } from 'next/server';

const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

interface VerifyRequest {
  accessToken: string;
}

/**
 * Facebook OAuth 驗證 API
 *
 * 驗證從前端傳入的 Facebook 存取權杖是否有效
 * 透過 Facebook Graph API 驗證權杖並回傳驗證結果
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

    if (!APP_ID) {
      return NextResponse.json(
        { error: 'Facebook App ID not configured' },
        { status: 500 }
      );
    }

    // Verify token with Facebook Graph API
    const url = `https://graph.facebook.com/me?client_id=${APP_ID}&access_token=${accessToken}`;
    const response = await fetch(url);
    const result = await response.json();

    console.log('Facebook OAuth verify:', {
      url: url.replace(accessToken, '***'),
      result
    });

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        name: result.name
      }
    });
  } catch (error) {
    console.error('Facebook OAuth verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
