import { googleGtagInit } from '@/utils/third-party/gtag';

export function googleGAInit(
  googleGAID = '',
  nonce: string | null = null,
  debug = process.env.NODE_ENV === 'development',
  log = false,
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callback?: Function
) {
  if (typeof googleGAID !== 'string' || googleGAID === '') {
    console.error('缺少google ga id');
    return;
  } else if (typeof document !== 'object' || document === null) {
    console.error('document API遺失');
    return;
  }
  const src = `https://www.googletagmanager.com/gtag/js?id=${googleGAID}`;

  const gaScript = document.createElement('script');
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function init(gtag: Function, gtm: Function) {
    if (typeof gtag === 'function') {
      gtag('js', new Date());
      gtag('config', googleGAID, {
        debug_mode: debug
      });
    }
    if (typeof callback === 'function') {
      callback(gtag, gtm);
    }
  }
  gaScript.onload = () => googleGtagInit(log, init);
  // gaScript.addEventListener('load', () =>  googleGtagInit(googleGAID, log, init));

  gaScript.id = 'gaScript';
  gaScript.setAttribute('id', 'gaScript');
  gaScript.async = true;
  gaScript.setAttribute('async', 'true');
  gaScript.src = src;
  gaScript.setAttribute('src', src);

  if (typeof nonce === 'string' && nonce !== '') {
    gaScript.nonce = nonce;
    gaScript.setAttribute('nonce', nonce);
  }

  const headDom = document.querySelector('head');
  if (typeof headDom?.append === 'function') {
    headDom.append(gaScript);
  }
}

export default googleGAInit;
