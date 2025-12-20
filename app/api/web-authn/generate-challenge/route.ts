import { NextResponse } from 'next/server';
import { Base64 } from 'js-base64';

/**
 * WebAuthn Challenge Generation API
 *
 * Generates a cryptographically secure random challenge for WebAuthn authentication
 *
 * @api {GET} /api/web-authn/generate-challenge Generate WebAuthn Challenge
 */
export async function GET() {
  try {
    // Generate 32 bytes of cryptographically secure random values
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    // Return as Base64URL encoded string
    const challengeString = Base64.fromUint8Array(challenge, true);

    return NextResponse.json(challengeString);
  } catch (error) {
    console.error('Error generating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 }
    );
  }
}
