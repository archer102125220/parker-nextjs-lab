import { cookies } from 'next/headers';
// import { defaultLang } from '@/i18n';

// https://nextjs.org/docs/app/api-reference/functions/cookies#setting-a-cookie
export async function getLocalLanguage(defaultLanguag = 'zh-tw') {
  if (typeof window?.localStorage === 'object') {
    const usedLang = window.localStorage.getItem('usedLang');
    if (typeof usedLang === 'string' && usedLang !== '') {
      return usedLang;
    }
  }
  if (typeof window?.navigator?.languages === 'object') {
    // TODO
    // eslint-disable-next-line
    // @ts-ignore
    const _lang = window.navigator.userLanguage || window.navigator.language;
    const langArr = _lang.split('-');
    const lang =
      langArr[0] +
      (langArr.length >= 2 && langArr[0] !== 'en' && langArr[0] !== 'zh-tw'
        ? '-' + langArr[1].toLocaleUpperCase()
        : langArr[0] !== 'zh-tw'
          ? '-TW'
          : '');

    return lang;
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get('___i18n_locale');
  if (typeof locale === 'string' && locale !== '') {
    return locale;
  }
  return defaultLanguag;
}

export default getLocalLanguage;
