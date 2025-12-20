import { createNavigation } from 'next-intl/navigation';
import { redirect as redirectNext } from 'next/navigation';
import { routing } from '../routing';

// ==========================================
// next-intl navigation (i18n-aware) - SERVER ONLY
// ==========================================
// These are server-side navigation functions that handle locale automatically

const {
  redirect,
  getPathname,
  permanentRedirect
} = createNavigation(routing);

// Exports without conflicts - use directly
export { getPathname, permanentRedirect };

// ==========================================
// Aliases for conflicting exports only
// ==========================================

// redirect - conflicts with next/navigation
// i18n version: Automatically prepends locale to redirect path
export const i18nRedirect = redirect;

// ==========================================
// Re-exports from next/navigation
// ==========================================

// redirect from next/navigation
// Standard Next.js redirect without i18n handling
export const nextRedirect = redirectNext;
