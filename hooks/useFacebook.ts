import { useState, useEffect, useEffectEvent } from 'react';

const APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
const API_VERSION = process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION;

/**
 * useFacebook - Hook for integrating Facebook SDK
 * 
 * @param initFn - Callback function called when FB SDK is initialized
 * @param nonce - CSP nonce for script tag
 * @returns Facebook SDK object or null
 * 
 * @example
 * const fb = useFacebook((FB) => {
 *   console.log('Facebook SDK ready', FB);
 * });
 */
export function useFacebook(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initFn: (...args: any[]) => void = () => {},
  nonce: string | null = null
) {
  const [facebook, setFacebook] = useState(null);

  // Use useEffectEvent for stable callback that always has latest initFn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFacebookInit = useEffectEvent((FB: any, ...args: any[]) => {
    initFn(FB, ...args);
  });

  useEffect(() => {
    if (document.querySelector('#facebookOAuth') === null) {
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
        onFacebookInit(window.FB, ...arg); // ✅ useEffectEvent called from Effect
      };

      const fbScript = document.createElement('script');
      fbScript.id = 'facebookOAuth';
      fbScript.src = 'https://connect.facebook.net/zh_TW/sdk.js';
      fbScript.crossOrigin = 'anonymous';
      fbScript.setAttribute('crossorigin', 'anonymous');

      if (typeof nonce === 'string' && nonce !== '') {
        fbScript.nonce = nonce;
        fbScript.setAttribute('nonce', nonce);
      }

      document.head.append(fbScript);
    } else if (typeof window.FB === 'object') {
      // FB SDK already loaded, set state synchronously (intentional)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFacebook(window.FB);
    }
  }, [nonce]); // nonce is now properly in dependencies

  return facebook;
}

export default useFacebook;

