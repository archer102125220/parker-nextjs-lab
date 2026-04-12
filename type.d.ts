export declare global {
  interface Window {
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbAsyncInit?: (...args: any[]) => void;

    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB?: any;

    gtag: (...args: unknown[]) => void;
    gtm: (trackData?: Record<string, unknown>) => void;
    dataLayer: Array<unknown>;

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

  export declare module '*.glsl' {
    const value: string;
    export default value;
  }
  export declare module '*.vert' {
    const value: string;
    export default value;
  }
  export declare module '*.frag' {
    const value: string;
    export default value;
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
