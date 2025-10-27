import { useState, useEffect } from 'react';

const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
const API_VERSION = process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION;

export function useFacebook(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initFn: (...args: any[]) => void = () => {},
  nonce: string | null = null
) {
  const [facebook, setFacebook] = useState(null);

  useEffect(() => {
    if (document.querySelector('#facebookOAuth') === null) {
      // TODO
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const fbScript = document.createElement('script');
      fbScript.id = 'facebookOAuth';
      fbScript.src = 'https://connect.facebook.net/zh_TW/sdk.js';
      // fbScript.crossorigin = 'anonymous';
      fbScript.crossOrigin = 'anonymous';
      fbScript.setAttribute('crossorigin', 'anonymous');

      if (typeof nonce === 'string' && nonce !== '') {
        fbScript.nonce = nonce;
        fbScript.setAttribute('nonce', nonce);
      }

      document.head.append(fbScript);
    } else if (typeof window.FB === 'object') {
      // TODO
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFacebook(window.FB);
    }
  }, []);

  return facebook;
}

export default useFacebook;
