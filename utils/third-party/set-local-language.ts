import { cookies } from 'next/headers';

// https://nextjs.org/docs/app/api-reference/functions/cookies#setting-a-cookie
export async function setLocalLanguage(newLanguag: string) {
  if (typeof window?.localStorage === 'object') {
    window.localStorage.setItem('usedLang', newLanguag);
  }

  const cookieStore = await cookies();
  cookieStore.set('___i18n_locale', newLanguag);
}

export default setLocalLanguage;
