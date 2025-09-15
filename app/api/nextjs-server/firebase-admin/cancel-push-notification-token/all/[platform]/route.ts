/* eslint-disable */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// TODO
import {
  messagingRemoveToken,
  messagingFindAllToken
} from '@/services/server/firebase-messaging';

interface RouteParams {
  params: Promise<{
    platform: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { platform } = await params;

    if (!platform) {
      return NextResponse.json(
        { error: 'platform is required' },
        { status: 400 }
      );
    }

    const tokens = await messagingFindAllToken({ os: platform });
    for (let i = 0; i < tokens.length; i++) {
      const { os, token } = tokens[i];
      if (os === platform) {
        const response = await messagingRemoveToken(token);
        console.log({ ...response, platform });
      }
    }

    return NextResponse.json({ success: true, platform });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
