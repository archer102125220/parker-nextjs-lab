import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { request as axios } from '@/utils/request';

const APP_ID = process.env.FACEBOOK_APP_ID;

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
