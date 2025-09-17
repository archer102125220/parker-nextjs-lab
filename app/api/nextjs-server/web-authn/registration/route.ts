import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// import { decode } from 'cbor-x';
import { Base64 as base64Js } from 'js-base64';

import {
  // parseClientResponse,
  parseAttestationObject,
  parseAuthenticatorData
} from 'fido2-lib';

// 簽章驗證之部分找不到相關資料，因此此部分略過待完全依賴fido2-lib套件在實作驗證

// https://blog.techbridge.cc/2019/08/17/webauthn-intro
// https://yishiashia.github.io/posts/passkey-and-webauthn-passwordless-authentication/
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API#browser_compatibility
// https://flyhigher.top/develop/2160.html#verify-authenticator

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const challengeString = payload.challengeString || '';
    // const challenge = base64Js.toUint8Array(base64Js.decode(challengeString));

    const credential = {
      ...payload.credential,
      id: payload.credential.id,
      rawId: base64Js.toUint8Array(payload.credential.rawId),
      response: {
        attestationObject: base64Js.toUint8Array(
          payload.credential.response.attestationObject
        ),
        clientDataJSON: base64Js.toUint8Array(
          payload.credential.response.clientDataJSON
        )
      }
    };

    // const clientResponse = parseClientResponse(credential);
    // console.log(clientResponse);

    // validateSignature

    const utf8Decoder = new TextDecoder('utf-8');

    const decodedClientData = utf8Decoder.decode(
      credential.response.clientDataJSON
    );
    const clientDataObj = JSON.parse(decodedClientData);

    if (clientDataObj?.type !== 'webauthn.create') {
      return NextResponse.json(
        { errorMessage: 'clientData.type error' },
        { status: 401 }
      );
    }

    // const attestationObject = credential.response.attestationObject;
    // const decodedAttestationObj = decode(attestationObject);
    // console.log(Object.keys(decodedAttestationObj));
    // console.log(decodedAttestationObj.fmt);
    // console.log(decodedAttestationObj.attStmt.alg);
    // console.log(decodedAttestationObj.attStmt.sig);
    // console.log(decodedAttestationObj.attStmt.x5c);
    // console.log(decodedAttestationObj.attStmt.ecdaaKeyId);

    // const alg = decodedAttestationObj.attStmt.alg;
    // if (alg !== -7) {
    //   return NextResponse.json(
    //     { errorMessage: 'Unsupported algorithm' },
    //     { status: 401 }
    //   );
    // }

    const attestationObject = await parseAttestationObject(
      credential.response.attestationObject.buffer
    );
    // console.log(attestationObject);

    const alg = attestationObject.get('alg');
    if (alg?.hashAlg !== 'SHA-256') {
      return NextResponse.json(
        { errorMessage: 'Unsupported algorithm' },
        { status: 401 }
      );
    }

    if (challengeString !== clientDataObj.challenge) {
      return NextResponse.json(
        { errorMessage: 'challenge error' },
        { status: 401 }
      );
    }

    // const { authData } = decodedAttestationObj;
    // console.log(authData);
    const decodeAuthData = await parseAuthenticatorData(
      attestationObject.get('rawAuthnrData')
    );
    // console.log(decodeAuthData);

    // console.log(base64Js.encodeURL(challenge), clientDataObj, base64Js.encodeURL(challenge) === clientDataObj.challenge);

    // console.log(await fido2Lib.validateSignature(
    //   credential.response.clientDataJSON,
    //   decodeAuthData.get('rawAuthnrData'),
    //   decodeAuthData.get('sig'),
    //   alg.hashAlg
    // ));

    return NextResponse.json({
      ...payload,
      decodeClientDataObj: clientDataObj,
      success: true,
      base64URLServerSaveData: {
        credentialId: credential.id,
        credentialPublicKeyPem: base64Js.encodeURL(
          decodeAuthData.get('credentialPublicKeyPem')
        ),
        credentialPublicKeyJwk: base64Js.encodeURL(
          JSON.stringify(decodeAuthData.get('credentialPublicKeyJwk'))
        )
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', errorMessage: error },
      { status: 400 }
    );
  }
}
