import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Base64 as base64Js } from 'js-base64';
import type { ExpectedAssertionResult } from 'fido2-lib';
import { Fido2Lib } from 'fido2-lib';

// https://webauthn-open-source.github.io/fido2-lib/index.html

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const challengeString = payload.challengeString || '';

  const f2l = new Fido2Lib({
    timeout: 60000,
    // rpId: "example.com",
    rpId:
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'parker-nextjs-lab.vercel.app',
    rpName: 'Next.js Lab',
    // rpIcon: "https://example.com/logo.png",
    challengeSize: 128,
    attestation: 'direct',
    cryptoParams: [-7, -257]
    // authenticatorAttachment: "platform",
    // authenticatorRequireResidentKey: false,
    // authenticatorUserVerification: "required"
  });

  const signature = base64Js.toUint8Array(
    payload.credential.response.signature
  ).buffer;

  // 驗證用物件，大多數資料由後端寫死或透過env做設定，其餘公鑰及使用者資訊需由資料庫取出，使用者資訊需轉成Uint8Array後再帶入
  // type登入時固定為webauthn.get
  const expected: ExpectedAssertionResult = {
    // type: 'webauthn.get',
    origin:
      process.env.NODE_ENV === 'development'
        ? 'https://localhost:3000'
        : 'https://parker-nextjs-lab.vercel.app',
    // https://webauthn-open-source.github.io/fido2-lib/Fido2Lib.html#assertionResult
    factor: 'second',
    challenge: challengeString,
    publicKey: base64Js.decode(
      payload.base64URLServerSaveData.credentialPublicKeyPem
    ),
    // prevCounter: signature.byteLength,
    // prevCounter: 0,
    prevCounter: payload.base64URLServerSaveData.counter,
    userHandle: base64Js.fromUint8Array(
      base64Js.toUint8Array(payload.base64URLServerSaveData.userId)
    )
  };
  console.log({ expected });

  let output = {
    ...payload
  };

  try {
    const assertionResult = await f2l.assertionResult(
      {
        ...payload.credential,
        rawId: base64Js.toUint8Array(payload.credential.rawId).buffer,
        response: {
          ...payload.credential.response,
          authenticatorData: base64Js.toUint8Array(
            payload.credential.response.authenticatorData
          ).buffer,
          clientDataJSON: base64Js.toUint8Array(
            payload.credential.response.clientDataJSON
          ).buffer,
          signature,
          userHandle: base64Js.toUint8Array(
            payload.credential.response.userHandle
          ).buffer
        }
      },
      expected
    );
    console.log({ assertionResult });

    // 可執行可不執行，建立assertionResult實例時會一並檢查是否正確，無回傳值，無效直接拋出例外
    // await assertionResult.validate();

    output = {
      ...output,
      assertionResult
      // base64URLServerSaveDataCredentialPublicKeyPem,
      // decodeClientDataObj: clientDataObj,
      // success: true,
      // userHandle: credential.userHandle
    };
  } catch (error) {
    console.error(error);
    return NextResponse.json({ statusMessage: error }, { status: 401 });
  }

  return NextResponse.json(output);
}
