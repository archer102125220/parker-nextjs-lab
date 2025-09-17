import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import firebaseAdmin from 'firebase-admin';

import type { firebaseAdminAppType } from '@/utils/third-party/firebase-admin';
import {
  getFirebaseAdminWeb,
  getFirebaseAdminAndroid,
  getFirebaseAdminIos
} from '@/utils/third-party/firebase-admin';

import { messagingFindAllToken } from '@/services/server/firebase-messaging';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.data === undefined || body.data === null) {
      return NextResponse.json(
        { errorMessage: 'Missing parameter: data' },
        { status: 500 }
      );
    }

    const [webTokens, androidTokens, iosTokens] = await Promise.all([
      messagingFindAllToken({ os: 'web' }),
      messagingFindAllToken({ os: 'android' }),
      messagingFindAllToken({ os: 'ios' })
    ]);

    const firebaseAdminWeb = getFirebaseAdminWeb() as firebaseAdminAppType;
    const firebaseAdminAndroid =
      getFirebaseAdminAndroid() as firebaseAdminAppType;
    const firebaseAdminIos = getFirebaseAdminIos() as firebaseAdminAppType;

    const promiseArray = [];

    if (webTokens.length > 0) {
      promiseArray.push(
        firebaseAdmin
          .messaging(firebaseAdminWeb)
          .sendEachForMulticast({
            data: { msg: body.data, title: body.title, img: body.img },

            // TODO
            // eslint-disable-next-line
            // @ts-ignore
            tokens: webTokens.map(({ token }) => token)
          })
          .catch((error) =>
            console.error('Error sending message to web tokens:', error)
          )
      );
    }
    if (androidTokens.length > 0) {
      promiseArray.push(
        firebaseAdmin
          .messaging(firebaseAdminAndroid)
          .sendEachForMulticast({
            data: { msg: body.data, title: body.title, img: body.img },

            // TODO
            // eslint-disable-next-line
            // @ts-ignore
            tokens: androidTokens.map(({ token }) => token)
          })
          .catch((error) =>
            console.error('Error sending message to android tokens:', error)
          )
      );
    }
    if (iosTokens.length > 0) {
      promiseArray.push(
        firebaseAdmin
          .messaging(firebaseAdminIos)
          .sendEachForMulticast({
            data: { msg: body.data, title: body.title, img: body.img },
            // TODO
            // eslint-disable-next-line
            // @ts-ignore
            tokens: iosTokens.map(({ token }) => token)
          })
          .catch((error) =>
            console.error('Error sending message to ios tokens:', error)
          )
      );
    }

    const responseArray = await Promise.all(promiseArray);

    const response = { failureCount: 0, successCount: 0, responses: [] };
    responseArray.forEach((_response) => {
      // TODO
      // eslint-disable-next-line
      // @ts-ignore
      response.failureCount += _response.failureCount;

      // TODO
      // eslint-disable-next-line
      // @ts-ignore
      response.successCount += _response.successCount;

      const responses = [...response.responses];

      // TODO
      // eslint-disable-next-line
      // @ts-ignore
      response.responses = responses.concat(_response.responses);
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 400 }
    );
  }
}
