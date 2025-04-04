import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): void {
  console.log('____log start____');
  const headers = request.headers;
  console.log(`user-agent: ${headers.get('user-agent')}`);
  console.log(`accept-language: ${headers.get('accept-language')}`);
  console.log(`referer: ${headers.get('referer')}`);
  console.log(`host: ${headers.get('host')}`);
  console.log(`url: ${request.nextUrl.href}`);
  console.log('____log end____');
}

export default middleware;
