type trackDataType = { [key: string]: any };
export function googleGtagInit(log = false, callback?: Function) {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...arg: any[]) {
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
      window.dataLayer.push(trackData);
    };

  if (typeof callback === 'function') {
    callback(window.gtag, window.gtm);
  }
}

export default googleGtagInit;
