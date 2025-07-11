import { CSSProperties } from 'react';

export declare global {
  interface Window {
    fbAsyncInit?: (...args: any[]) => void;
    FB?: any;

    gtag: Function;
    gtm: Function;
    dataLayer: Array<Record<string, any>>;

    YT: {
      Player: any;
      Events: any;
    };
    onYouTubeIframeAPIReady: () => void;
    youTubeIsCreated?: boolean;
  }
}

export declare module 'next/config' {
  interface NextConfig {
    publicRuntimeConfig: {
      FACEBOOK_APP_ID: string;
      FACEBOOK_API_VERSION: string;
    };
  }
  function getConfig(): NextConfig;
  export default getConfig;
}
