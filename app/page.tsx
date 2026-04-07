// Root page redirects to the user's preferred locale
import { headers } from 'next/headers';
import { nextRedirect } from '@/i18n/navigation/server';
import { locales, defaultLang } from '@/i18n';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') ?? '';

  // Parse Accept-Language header and pick the first supported locale
  // e.g. "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7" → ["zh-TW", "zh", "en-US", "en"]
  const preferred = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0].trim().toLowerCase());

  const resolvedLocale =
    preferred.find((lang) =>
      (locales as string[]).some(
        (supported) =>
          lang === supported.toLowerCase() ||
          lang.startsWith(supported.toLowerCase().split('-')[0] + '-') ||
          lang === supported.toLowerCase().split('-')[0]
      )
    ) ?? null;

  // Map the matched language tag back to a supported locale value
  let targetLocale: string = defaultLang;
  if (resolvedLocale !== null) {
    const matched = (locales as string[]).find(
      (supported) =>
        resolvedLocale === supported.toLowerCase() ||
        resolvedLocale.startsWith(supported.toLowerCase().split('-')[0] + '-') ||
        resolvedLocale === supported.toLowerCase().split('-')[0]
    );
    if (matched !== undefined) {
      targetLocale = matched;
    }
  }

  nextRedirect(`/${targetLocale}`);
}
