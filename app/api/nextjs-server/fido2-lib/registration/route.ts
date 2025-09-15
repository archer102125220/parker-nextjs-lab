import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Base64 as base64Js } from 'js-base64';
import type { Factor, Fido2AttestationResult } from 'fido2-lib';
import { Fido2Lib } from 'fido2-lib';

// https://webauthn-open-source.github.io/fido2-lib/index.html

type expectedType = {
  type: string;
  origin: string;
  challenge: string;
  factor: Factor;
};

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const challengeString = payload.challengeString || '';

  const f2l = new Fido2Lib({
    timeout: 60000,
    rpId:
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'parker-next-lab.vercel.app',
    rpName: 'Next.js Lab',
    // rpIcon: "https://example.com/logo.png",
    challengeSize: 128,
    attestation: 'direct',
    cryptoParams: [-7, -257],
    authenticatorRequireResidentKey: true
    // authenticatorAttachment: "platform",
    // authenticatorRequireResidentKey: false,
    // authenticatorUserVerification: "required"
  });

  // 驗證用物件，大多數資料由後端寫死或透過env做設定，type註冊時固定為webauthn.create
  const expected: expectedType = {
    type: 'webauthn.create',
    origin:
      process.env.NODE_ENV === 'development'
        ? 'https://localhost:3000'
        : 'https://parker-nextjs-lab.vercel.app',
    challenge: challengeString,
    // https://webauthn-open-source.github.io/fido2-lib/Fido2Lib.html#attestationResultＦ
    factor: 'first'
  };
  console.log({ expected });

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let attestationResult: any = {};

  try {
    const _attestationResult = await f2l.attestationResult(
      {
        ...payload.credential,
        rawId: base64Js.toUint8Array(payload.credential.rawId).buffer,
        response: {
          ...payload.credential.response,
          attestationObject: base64Js.toUint8Array(
            payload.credential.response.attestationObject
          ).buffer,
          authenticatorData: base64Js.toUint8Array(
            payload.credential.response.authenticatorData
          ).buffer,
          clientDataJSON: base64Js.toUint8Array(
            payload.credential.response.clientDataJSON
          ).buffer,
          publicKey: base64Js.toUint8Array(
            payload.credential.response.publicKey
          ).buffer
        }
      },
      expected
    );
    attestationResult = _attestationResult;
    console.log({ attestationResult });

    // 可執行可不執行，建立attestationResult實例時會一並檢查是否正確，無回傳值，無效直接拋出例外
    // await attestationResult.validate();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ statusMessage: error }, { status: 401 });
  }

  // 驗證沒問題後，要將使用者資訊、金鑰及金鑰id存入資料庫，大多還是ArrayBuffer型別，因此需要特別注意資料庫欄位型態
  // 需要特別注意的是fido2-lib登入時的驗證金鑰方法是用PEM格式的金鑰，因此需要存的是credentialPublicKeyPem，其餘金鑰可是需求儲存

  const outputClientData = JSON.parse(
    JSON.stringify(Object.fromEntries(attestationResult.clientData))
  );
  const outputAuthnrData = JSON.parse(
    JSON.stringify(Object.fromEntries(attestationResult.authnrData))
  );
  console.log({ outputClientData });
  console.log({ outputAuthnrData });

  const utf8Decoder = new TextDecoder('utf-8');
  const userId = utf8Decoder.decode(base64Js.toUint8Array(payload.user?.id));
  console.log({ userId });

  return NextResponse.json({
    ...payload,
    attestationResult: {
      ...attestationResult,
      audit: {
        ...attestationResult.audit,
        journal: Array.from(attestationResult.audit.journal),
        info: JSON.parse(
          JSON.stringify(Object.fromEntries(attestationResult.audit.info))
        ),
        warning: JSON.parse(
          JSON.stringify(Object.fromEntries(attestationResult.audit.warning))
        )
      },
      requiredExpectations: Array.from(attestationResult.requiredExpectations),
      optionalExpectations: Array.from(attestationResult.optionalExpectations),
      expectations: JSON.parse(
        JSON.stringify(Object.fromEntries(attestationResult.expectations))
      ),
      request: {
        ...attestationResult.request,
        rawId: base64Js.fromUint8Array(
          new Uint8Array(attestationResult.request.rawId),
          true
        ),
        response: {
          ...attestationResult.request.response,
          attestationObject: base64Js.fromUint8Array(
            new Uint8Array(
              attestationResult.request.response.attestationObject
            ),
            true
          ),
          authenticatorData: base64Js.fromUint8Array(
            new Uint8Array(
              attestationResult.request.response.authenticatorData
            ),
            true
          ),
          clientDataJSON: base64Js.fromUint8Array(
            new Uint8Array(attestationResult.request.response.clientDataJSON),
            true
          ),
          publicKey: base64Js.fromUint8Array(
            new Uint8Array(attestationResult.request.response.publicKey),
            true
          )
        }
      },
      clientData: {
        ...outputClientData,
        rawClientDataJson: base64Js.fromUint8Array(
          new Uint8Array(outputClientData.rawClientDataJson),
          true
        ),
        rawId: base64Js.fromUint8Array(
          new Uint8Array(outputClientData.rawId),
          true
        )
      },
      authnrData: {
        ...outputAuthnrData,
        sig: base64Js.fromUint8Array(
          new Uint8Array(outputAuthnrData.sig),
          true
        ),
        rawAuthnrData: base64Js.fromUint8Array(
          new Uint8Array(outputAuthnrData.rawAuthnrData),
          true
        ),
        rpIdHash: base64Js.fromUint8Array(
          new Uint8Array(outputAuthnrData.rpIdHash),
          true
        ),
        flags: Array.from(outputAuthnrData.flags),
        aaguid: base64Js.fromUint8Array(
          new Uint8Array(outputAuthnrData.aaguid),
          true
        ),
        credId: base64Js.fromUint8Array(
          new Uint8Array(outputAuthnrData.credId),
          true
        ),
        credentialPublicKeyCose: base64Js.fromUint8Array(
          new Uint8Array(outputAuthnrData.credentialPublicKeyCose),
          true
        ),
        credentialPublicKeyPem: base64Js.encodeURL(
          outputAuthnrData.credentialPublicKeyPem
        )
      }
    },
    base64URLServerSaveData: {
      resultId: attestationResult.request.id,
      // publicKey: base64Js.fromUint8Array(new Uint8Array(attestationResult.request.response.publicKey), true),
      credentialPublicKeyPem: base64Js.encodeURL(
        attestationResult.authnrData.get('credentialPublicKeyPem')
      ),
      userId,
      counter: outputAuthnrData.counter
    }
  });
}
