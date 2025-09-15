/* eslint-disable */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// TODO
// import { messagingRemoveToken } from '@/services/server/firebase-messaging';

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // const response = await messagingRemoveToken(token);
    // console.log(response);

    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
