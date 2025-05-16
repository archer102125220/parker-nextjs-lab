import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function contentSecurityPolicyMiddleware(
  request: NextRequest
): Promise<NextResponse | void> {
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
  const cspHeader = `
    default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://www.youtube.com https://connect.facebook.net https://www.googletagmanager.com; // 允許資源來源
    font-src 'self' https://fonts.gstatic.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    img-src 'self' data:;
    object-src 'none';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
    frame-src 'self' https://www.youtube.com https://www.googletagmanager.com;
    upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  response.headers.set('x-nonce', nonce);
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return response;
}

export default contentSecurityPolicyMiddleware;
