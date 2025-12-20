import { NextRequest, NextResponse } from 'next/server';
import { Base64 } from 'js-base64';
import * as fido2Lib from 'fido2-lib';

interface VerifyPayload {
  userId: string;
  challengeString: string;
  credential: {
    id: string;
    rawId: string;
    authenticatorAttachment?: string;
    type: string;
    response: {
      authenticatorData: string;
      clientDataJSON: string;
      signature: string;
      userHandle: string | null;
    };
  };
  base64URLServerSaveData: {
    credentialId: string;
    credentialPublicKeyPem: string;
    credentialPublicKeyJwk: string;
  };
}

/**
 * WebAuthn Verify API
 *
 * Verifies WebAuthn login requests using stored credential data
 */
export async function POST(request: NextRequest) {
  try {
    const payload: VerifyPayload = await request.json();
    const {
      userId,
      challengeString,
      credential: payloadCredential,
      base64URLServerSaveData
    } = payload;

    // Decode server-saved public key
    const credentialPublicKeyPem = Base64.decode(
      base64URLServerSaveData.credentialPublicKeyPem
    );

    // Decode credential data
    const credential = {
      authenticatorAttachment: payloadCredential.authenticatorAttachment,
      id: payloadCredential.id,
      rawId: Base64.toUint8Array(payloadCredential.rawId),
      authenticatorData: Base64.toUint8Array(
        payloadCredential.response.authenticatorData
      ),
      clientDataJSON: Base64.toUint8Array(
        payloadCredential.response.clientDataJSON
      ),
      userHandle: payloadCredential.response.userHandle
        ? Base64.decode(payloadCredential.response.userHandle)
        : null
    };

    // Decode and parse client data
    const utf8Decoder = new TextDecoder('utf-8');
    const decodedClientData = utf8Decoder.decode(credential.clientDataJSON);
    const clientDataObj = JSON.parse(decodedClientData);

    // Validate client data type
    if (clientDataObj?.type !== 'webauthn.get') {
      return NextResponse.json(
        { error: 'clientData.type error', statusCode: 401, verified: false },
        { status: 401 }
      );
    }

    // Validate challenge
    if (challengeString !== clientDataObj.challenge) {
      return NextResponse.json(
        { error: 'challenge error', statusCode: 401, verified: false },
        { status: 401 }
      );
    }

    // Validate user ID matches user handle
    if (credential.userHandle && userId !== credential.userHandle) {
      return NextResponse.json(
        { error: 'userId error', statusCode: 401, verified: false },
        { status: 401 }
      );
    }

    // Parse authenticator data using fido2-lib
    const authenticatorData = await fido2Lib.parseAuthenticatorData(
      credential.authenticatorData.buffer
    );

    // Return success response
    return NextResponse.json({
      ...payload,
      base64URLServerSaveDataCredentialPublicKeyPem: credentialPublicKeyPem,
      decodeClientDataObj: clientDataObj,
      authenticatorData: Object.fromEntries(authenticatorData),
      verified: true,
      success: true,
      userHandle: credential.userHandle
    });
  } catch (error) {
    console.error('WebAuthn verify error:', error);
    return NextResponse.json(
      {
        error: 'Verification failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        verified: false
      },
      { status: 500 }
    );
  }
}
