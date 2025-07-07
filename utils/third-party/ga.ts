import { googleGtagInit } from '@/utils/third-party/gtag';

export function googleGAInit(
  googleGAID = '',
  debug = process.env.NODE_ENV === 'development',
  log = false,
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

  const script = document.createElement('script');
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
  script.onload = () => googleGtagInit(log, init);
  // script.addEventListener('load', () =>  googleGtagInit(googleGAID, log, init));

  script.id = 'gaScript';
  script.setAttribute('id', 'gaScript');
  script.async = true;
  script.setAttribute('async', 'true');
  script.src = src;
  script.setAttribute('src', src);

  const headDom = document.querySelector('head');
  if (typeof headDom?.append === 'function') {
    headDom.append(script);
  }
}

export default googleGAInit;
