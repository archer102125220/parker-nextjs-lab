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
