/**
 * i18n Navigation - Centralized navigation utilities
 * 
 * This module provides a unified import point for all navigation-related utilities.
 * It re-exports from client.ts and server.ts to ensure proper separation of
 * client and server code.
 * 
 * USAGE GUIDELINES:
 * ================
 * 
 * For CLIENT COMPONENTS (with 'use client'):
 * ------------------------------------------
 * Import from '@/i18n/navigation' or '@/i18n/navigation/client'
 * - usePathnameWithLocale / usePathnameWithoutLocale
 * - useNextRouter / useI18nRouter
 * - Link
 * 
 * For SERVER COMPONENTS:
 * ---------------------
 * Import from '@/i18n/navigation/server'
 * - i18nRedirect / nextRedirect
 * - getPathname
 * - permanentRedirect
 * 
 * IMPORTANT:
 * - Hooks (use*) can ONLY be used in Client Components
 * - Redirect functions can ONLY be used in Server Components or Server Actions
 * - Link component can be used anywhere
 */

// ==========================================
// Re-exports from client.ts
// ==========================================
// These are CLIENT-ONLY exports (hooks and components)
export {
  Link,
  usePathnameWithoutLocale,
  usePathnameWithLocale,
  useI18nRouter,
  useNextRouter
} from './client';

// ==========================================
// Re-exports from server.ts
// ==========================================
// These are SERVER-ONLY exports (redirect functions)
export {
  i18nRedirect,
  nextRedirect,
  getPathname,
  permanentRedirect
} from './server';
