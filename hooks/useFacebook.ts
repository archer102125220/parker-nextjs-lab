import getConfig from 'next/config';
import { useState, useEffect } from 'react';

const runtimeConfig = getConfig();

export function useFacebook(initFn: (...args: any[]) => void = () => {}) {
  const APP_ID = runtimeConfig.FACEBOOK_APP_ID;
  const API_VERSION = runtimeConfig.FACEBOOK_API_VERSION;

  const [facebook, setFacebook] = useState(null);

  useEffect(() => {
    if (document.querySelector('#facebookOAuth') === null) {
      window.fbAsyncInit = function (...arg: any[]) {
        setFacebook(window.FB);
        window.FB.init({
          appId: APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: API_VERSION
        });
        window.FB.AppEvents.logPageView();
        initFn(window.FB, ...arg);

        // window.FB.getLoginStatus(function (response) {
        //   // console.log(response);
        //   if (response.status === 'connected') {
        //     handleGetData(response);
        //   }
        // }, true);
        // window.FB.logout();
      };
      const script = document.createElement('script');
      script.id = 'facebookOAuth';
      script.src = 'https://connect.facebook.net/zh_TW/sdk.js';
      // script.crossorigin = 'anonymous';
      script.crossOrigin = 'anonymous';
      script.setAttribute('crossorigin', 'anonymous');
      document.head.append(script);
    } else if (typeof window.FB === 'object') {
      setFacebook(window.FB);
    }
  }, []);

  return facebook;
}
