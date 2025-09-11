import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

export const i18nMiddleware = createMiddleware(routing);

// Match all pathnames except for
// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
// - … the ones containing a dot (e.g. `favicon.ico`)
const EXCEPT_PREFIXES: Array<string> = ['/api', '/trpc', '/_next', '/_vercel'];

export function middleware(request: NextRequest): NextResponse {
  if (
    EXCEPT_PREFIXES.some((prefix) =>
      request.nextUrl.pathname.startsWith(prefix)
    ) === false
  ) {
    return i18nMiddleware(request);
  }
  return NextResponse.next();
}

export default middleware;
