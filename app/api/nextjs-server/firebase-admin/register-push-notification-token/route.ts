import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// TODO
// import { messagingFindAllToken } from '@/services/server/firebase-messaging';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log({ body });
    // await messagingAddToken({ token: body.token, os: body.os });

    return NextResponse.json({ success: true, token: body.token });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 400 }
    );
  }
}
