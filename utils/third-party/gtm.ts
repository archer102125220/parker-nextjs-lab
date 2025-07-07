import { googleGtagInit } from '@/utils/third-party/gtag';

export function googleGTMInit(
  googleGTMID = '',
  log = false,
  callback?: Function
) {
  if (typeof googleGTMID !== 'string' || googleGTMID === '') {
    console.error('缺少google gtm id');
    return;
  } else if (typeof document !== 'object' || document === null) {
    console.error('document API遺失');
    return;
  }
  const src = `https://www.googletagmanager.com/gtm.js?id=${googleGTMID}&l=dataLayer`;

  // window.dataLayer = window.dataLayer || [];
  // window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const gtmScript = document.createElement('script');
  function init(gtag: Function, gtm: Function) {
    if (typeof gtm === 'function') {
      gtm({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    }
    if (typeof callback === 'function') {
      callback(gtag, gtm);
    }
  }
  gtmScript.onload = () => googleGtagInit(log, init);
  // gtmScript.addEventListener('load', () =>  googleGtagInit(googleGAID, log, init));

  gtmScript.id = 'gtmScript';
  gtmScript.setAttribute('id', 'gtmScript');
  gtmScript.async = true;
  gtmScript.setAttribute('async', 'true');
  gtmScript.src = src;
  gtmScript.setAttribute('src', src);

  const headDom = document.querySelector('head');
  if (typeof headDom?.append === 'function') {
    headDom.append(gtmScript);
  }
}
// (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f); })(window, document, 'script', 'dataLayer', process.env.GTM_ID);

export default googleGTMInit;
