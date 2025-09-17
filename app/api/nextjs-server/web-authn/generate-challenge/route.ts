import { NextResponse } from 'next/server';
import { Base64 as base64Js } from 'js-base64';

export function GET() {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  // console.log({ challenge }, challenge.toLocaleString());

  return NextResponse.json(base64Js.fromUint8Array(challenge, true));
}
