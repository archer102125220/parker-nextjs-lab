import type { CSSProperties } from 'react';

export declare global {
  interface Window {
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbAsyncInit?: (...args: any[]) => void;

    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB?: any;

    // TODO
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    gtag: Function;
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    gtm: Function;
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: Array<Record<string, any>>;

    YT: {
      // TODO
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: any;
      // TODO
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Events: any;
    };
    onYouTubeIframeAPIReady: () => void;
    youTubeIsCreated?: boolean;
  }
}

export declare module 'fido2-lib' {
  export function parseAuthenticatorData(
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authnrDataArrayBuffer: any
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Map<any, any>>;
  export function parseAttestationObject(
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attestationObject: any
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Map<any, any>>;
  export function parseAuthenticatorData(
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authnrDataArrayBuffer: any
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Map<any, any>>;
}
