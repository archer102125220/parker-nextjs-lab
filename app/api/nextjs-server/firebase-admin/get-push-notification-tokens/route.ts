import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// TODO
// import { messagingFindAllToken } from '@/services/server/firebase-messaging';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const os = searchParams.get('os');

  // if (typeof os === 'string' && os !== '') {
  //   return await messagingFindAllToken({ os });
  // }

  const [webTokenList = [], androidTokenList = [], iosTokenList = []] =
    await Promise.all([
      // messagingFindAllToken({ os: 'web' }),
      // messagingFindAllToken({ os: 'android' }),
      // messagingFindAllToken({ os: 'ios' })
    ]);

  const tokenList = { webTokenList, androidTokenList, iosTokenList };

  return NextResponse.json(tokenList);
}
