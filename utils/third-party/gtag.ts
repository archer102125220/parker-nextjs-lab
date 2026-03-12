/* eslint-disable prefer-rest-params */
export type trackDataType = Record<string, unknown>;
export type GtagFn = (...args: unknown[]) => void;
export type GtmFn = (trackData?: trackDataType) => void;
export type GtagCallback = ((gtag: GtagFn, gtm: GtmFn) => void) | ((...args: unknown[]) => void);

export function googleGtagInit(log = false, callback?: GtagCallback) {
  window.dataLayer = window.dataLayer || [];

  window.gtag =
    window.gtag ||
    function () {
      /**
       * 重要：必須使用 `arguments` 物件而非擴展運算子 (...args)。
       * GA4 偵錯工具與部分 gtag.js 版本會專門檢查 `Arguments` 物件來識別數據發送。
       * 若使用陣列（如擴展運算子產生的陣列），會導致偵錯工具顯示
       * 「A GA4 instance was found, waiting for hits」而無法正確接收數據。
       */
      if (log === true) {
        console.log('gtag 參數：', arguments);
      }
      window.dataLayer.push(arguments);
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
