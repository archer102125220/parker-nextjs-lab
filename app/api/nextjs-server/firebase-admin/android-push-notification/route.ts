import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import firebaseAdmin from 'firebase-admin';
import type { firebaseAdminAppType } from '@/utils/third-party/firebase-admin';
import { getFirebaseAdminAndroid } from '@/utils/third-party/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.data === undefined || body.data === null) {
      return NextResponse.json(
        { errorMessage: 'Missing parameter: data' },
        { status: 500 }
      );
    } else if (Array.isArray(body.token) === false || body.token.length <= 0) {
      return NextResponse.json(
        { errorMessage: 'Missing parameter: token' },
        { status: 500 }
      );
    }

    const firebaseAdminAndroid: firebaseAdminAppType =
      getFirebaseAdminAndroid() as firebaseAdminAppType;

    const response = await firebaseAdmin
      .messaging(firebaseAdminAndroid)
      .sendEachForMulticast({
        data: { msg: body.data, title: body.title, img: body.img },
        tokens: body.token
      });
    console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 400 }
    );
  }
}
