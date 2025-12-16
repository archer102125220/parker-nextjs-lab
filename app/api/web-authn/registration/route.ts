import { NextRequest, NextResponse } from 'next/server';
import { Base64 } from 'js-base64';
import * as fido2Lib from 'fido2-lib';

interface CredentialPayload {
  challengeString: string;
  credential: {
    id: string;
    rawId: string;
    type: string;
    response: {
      attestationObject: string;
      clientDataJSON: string;
      publicKey?: string;
      publicKeyAlgorithm?: number;
      transports?: string[];
    };
  };
}

/**
 * WebAuthn Registration API
 *
 * Validates and processes WebAuthn credential registration requests
 */
export async function POST(request: NextRequest) {
  try {
    const payload: CredentialPayload = await request.json();
    const { challengeString, credential: payloadCredential } = payload;

    // Decode credential data
    const credential = {
      ...payloadCredential,
      id: payloadCredential.id,
      rawId: Base64.toUint8Array(payloadCredential.rawId),
      response: {
        attestationObject: Base64.toUint8Array(
          payloadCredential.response.attestationObject
        ),
        clientDataJSON: Base64.toUint8Array(
          payloadCredential.response.clientDataJSON
        )
      }
    };

    // Decode and parse client data
    const utf8Decoder = new TextDecoder('utf-8');
    const decodedClientData = utf8Decoder.decode(
      credential.response.clientDataJSON
    );
    const clientDataObj = JSON.parse(decodedClientData);

    // Validate client data type
    if (clientDataObj?.type !== 'webauthn.create') {
      return NextResponse.json(
        { error: 'clientData.type error', statusCode: 401 },
        { status: 401 }
      );
    }

    // Validate challenge
    if (challengeString !== clientDataObj.challenge) {
      return NextResponse.json(
        { error: 'challenge error', statusCode: 401 },
        { status: 401 }
      );
    }

    // Parse attestation object using fido2-lib
    const attestationObject = await fido2Lib.parseAttestationObject(
      credential.response.attestationObject.buffer
    );

    // Parse authenticator data
    const decodeAuthData = await fido2Lib.parseAuthenticatorData(
      attestationObject.get('rawAuthnrData')
    );

    // Return success response with credential data for storage
    return NextResponse.json({
      ...payload,
      decodeClientDataObj: clientDataObj,
      success: true,
      base64URLServerSaveData: {
        credentialId: credential.id,
        credentialPublicKeyPem: Base64.encodeURL(
          decodeAuthData.get('credentialPublicKeyPem')
        ),
        credentialPublicKeyJwk: Base64.encodeURL(
          JSON.stringify(decodeAuthData.get('credentialPublicKeyJwk'))
        )
      }
    });
  } catch (error) {
    console.error('WebAuthn registration error:', error);
    return NextResponse.json(
      {
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
