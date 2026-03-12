export type trackDataType = Record<string, unknown>;
export type GtagFn = (...args: unknown[]) => void;
export type GtmFn = (trackData?: trackDataType) => void;
export type GtagCallback = ((gtag: GtagFn, gtm: GtmFn) => void) | ((...args: unknown[]) => void);

export function googleGtagInit(log = false, callback?: GtagCallback) {
  window.dataLayer = window.dataLayer || [];

  window.gtag =
    window.gtag ||
    function (...arg: unknown[]) {
      if (log === true) {
        console.log('gtag 參數：', arg);
      }
      window.dataLayer.push(arg);
    };

  window.gtm =
    window.gtm ||
    function (trackData: trackDataType = {}) {
      if (log === true) {
        console.log('gtm 參數：', trackData);
      }
      window.dataLayer.push(trackData as unknown);
    };

  if (typeof callback === 'function') {
    callback(window.gtag, window.gtm);
  }
}

export default googleGtagInit;
