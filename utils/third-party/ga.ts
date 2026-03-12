import { googleGtagInit, type GtagFn, type GtmFn ,type GtagCallback} from '@/utils/third-party/gtag';

export function googleGAInit(
  googleGAID = '',
  nonce: string | null = null,
  debug = process.env.NODE_ENV === 'development',
  log = false,
  callback?: GtagCallback
) {
  if (typeof googleGAID !== 'string' || googleGAID === '') {
    console.error('缺少google ga id');
    return;
  } else if (typeof document !== 'object' || document === null) {
    console.error('document API遺失');
    return;
  }

  function init(gtag: GtagFn, gtm: GtmFn) {
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
  googleGtagInit(log, init)

  const src = `https://www.googletagmanager.com/gtag/js?id=${googleGAID}`;

  const gaScript = document.createElement('script');
  // gaScript.onload = () => googleGtagInit(log, init);
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
