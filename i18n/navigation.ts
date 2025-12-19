'use client';

import { createNavigation } from 'next-intl/navigation';
import {
  usePathname as usePathnameNext,
  useRouter as useRouterNext,
  redirect as redirectNext
} from 'next/navigation';
import { routing } from './routing';

// ==========================================
// next-intl navigation (i18n-aware)
// ==========================================
// These are lightweight wrappers around Next.js' navigation APIs
// that consider the routing configuration and handle locale automatically

const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
  permanentRedirect
} = createNavigation(routing);

// Exports without conflicts - use directly
export { Link, getPathname, permanentRedirect };

// ==========================================
// Aliases for conflicting exports only
// ==========================================

// usePathname - conflicts with next/navigation
// i18n version: Returns pathname WITHOUT locale prefix (e.g., /route/query-back-test)
export const usePathnameWithoutLocale = usePathname;

// useRouter - conflicts with next/navigation
// i18n version: Router methods automatically handle locale
export const useI18nRouter = useRouter;

// redirect - conflicts with next/navigation
// i18n version: Automatically prepends locale to redirect path
export const i18nRedirect = redirect;

// ==========================================
// Re-exports from next/navigation
// ==========================================

// usePathname from next/navigation
// Returns pathname WITH locale prefix (e.g., /zh-tw/route/query-back-test)
export const usePathnameWithLocale = usePathnameNext;

// useRouter from next/navigation
// Standard Next.js router without i18n handling
export const useNextRouter = useRouterNext;

// redirect from next/navigation
// Standard Next.js redirect without i18n handling
export const nextRedirect = redirectNext;
