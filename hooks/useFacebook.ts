import { useState, useEffect } from 'react';

const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
const API_VERSION = process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION;

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacebook(initFn: (...args: any[]) => void = () => {}) {
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
      const script = document.createElement('script');
      script.id = 'facebookOAuth';
      script.src = 'https://connect.facebook.net/zh_TW/sdk.js';
      // script.crossorigin = 'anonymous';
      script.crossOrigin = 'anonymous';
      script.setAttribute('crossorigin', 'anonymous');
      document.head.append(script);
    } else if (typeof window.FB === 'object') {
      // TODO
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFacebook(window.FB);
    }
  }, []);

  return facebook;
}

export default useFacebook;
