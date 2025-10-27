import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function contentSecurityPolicyMiddleware(
  request: NextRequest
): NextResponse | void {
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  if (
    process.env.NODE_ENV !== 'production' ||
    response.headers.get('Content-Security-Policy')
  ) {
    return;
  }

  console.log('____contentSecurityPolicy____');

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  console.log('____contentSecurityPolicy____ nonce');
  const cspHeader = `
    default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://www.youtube.com https://connect.facebook.net https://www.googletagmanager.com; // 允許資源來源
    font-src 'self' https://fonts.gstatic.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    img-src 'self' data:;
    object-src 'none';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https://connect.facebook.net https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
    frame-src 'self' https://www.youtube.com https://www.googletagmanager.com;
    upgrade-insecure-requests;
  `;
  console.log('____contentSecurityPolicy____ cspHeader');

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();
  console.log('____contentSecurityPolicy____ contentSecurityPolicyHeaderValue');

  requestHeaders.set('x-nonce', encodeURIComponent(nonce));
  console.log('____contentSecurityPolicy____ requestHeaders.set x-nonce');
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );
  console.log(
    '____contentSecurityPolicy____ requestHeaders.set Content-Security-Policy'
  );

  response.headers.set('x-nonce', encodeURIComponent(nonce));
  console.log('____contentSecurityPolicy____ response.headers.set x-nonce');
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );
  console.log(
    '____contentSecurityPolicy____ response.headers.set Content-Security-Policy'
  );

  return response;
}

export default contentSecurityPolicyMiddleware;
