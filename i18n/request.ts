import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const _locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const locale = _locale.includes('zh') ? 'zh-tw' : 'en';

  return {
    locale,
    messages: (await import(`@/i18n/locales/${locale}.json`)).default
  };
});
