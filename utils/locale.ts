export function getLocaleFromPath(pathname: string): string {
  const localeMatch = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)/);
  return localeMatch ? localeMatch[1] : 'zh-tw';
} 