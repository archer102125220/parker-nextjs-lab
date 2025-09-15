import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Base64 as base64Js } from 'js-base64';
import { parseAuthenticatorData } from '@/utils/third-party/fido2-lib';

// 簽章驗證之部分找不到相關資料，因此此部分略過待完全依賴fido2-lib套件在實作驗證

// https://blog.techbridge.cc/2019/08/17/webauthn-intro
// https://yishiashia.github.io/posts/passkey-and-webauthn-passwordless-authentication/
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API#browser_compatibility
// https://flyhigher.top/develop/2160.html#verify-authenticator

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const challengeString = payload.challengeString || '';
  // const challenge = base64Js.toUint8Array(base64Js.decode(challengeString));

  const utf8Decoder = new TextDecoder('utf-8');

  const base64URLServerSaveDataCredentialPublicKeyPem = base64Js.decode(
    payload.base64URLServerSaveData.credentialPublicKeyPem
  );
  // const base64URLServerSaveDataCredentialPublicKeyJwk = JSON.parse(base64Js.decode(payload.base64URLServerSaveData.credentialPublicKeyJwk));

  const credential = {
    authenticatorAttachment: payload.credential.authenticatorAttachment,
    id: payload.credential.id,
    rawId: base64Js.toUint8Array(payload.credential.rawId),
    authenticatorData: base64Js.toUint8Array(
      payload.credential.authenticatorData
    ),
    clientDataJSON: base64Js.toUint8Array(payload.credential.clientDataJSON),
    userHandle: base64Js.decode(payload.credential.userHandle)
  };
  // console.log(credential.rawId);

  const decodedClientData = utf8Decoder.decode(credential.clientDataJSON);
  const clientDataObj = JSON.parse(decodedClientData);

  console.log(clientDataObj);
  console.log(credential);
  // console.log({ base64URLServerSaveDataCredentialPublicKeyPem, base64URLServerSaveDataCredentialPublicKeyJwk });

  const authenticatorData = await parseAuthenticatorData(
    credential.authenticatorData.buffer
  );
  console.log(authenticatorData);

  if (clientDataObj?.type !== 'webauthn.get') {
    return NextResponse.json(
      { errorMessage: 'clientData.type error' },
      { status: 401 }
    );
  }

  if (challengeString !== clientDataObj.challenge) {
    return NextResponse.json(
      { errorMessage: 'challenge error' },
      { status: 401 }
    );
  }

  if (payload.userId !== credential.userHandle) {
    return NextResponse.json({ errorMessage: 'userId error' }, { status: 401 });
  }

  return NextResponse.json({
    ...payload,
    base64URLServerSaveDataCredentialPublicKeyPem,
    decodeClientDataObj: clientDataObj,
    success: true,
    userHandle: credential.userHandle
  });
}
