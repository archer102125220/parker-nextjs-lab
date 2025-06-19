import type { InternalAxiosRequestConfig } from 'axios';

export type getRequestKey = (
  method: string,
  url: string | undefined,
  params: any
) => string;
export type addRequestCanceler = (
  cancel: AbortController,
  method: string | undefined,
  url: string | undefined,
  params: any
) => void;
export type getRequestCanceler = (
  method: string,
  url: string,
  params: any
) => AbortController | null;
export type removeRequestCanceler = (
  method: string | undefined,
  url: string | undefined,
  params: any
) => void;
export type handlerCancel = (method: string, url: string, params: any) => void;
export type handlerCancelAll = () => void;
export type requestCanceler = AbortController | null;

export type requestType = (
  _method: string,
  url: string,
  _params: any,
  _extendOption: any,
  errorAdapter: boolean
) => Promise<any>;

export type requestArg = [string, string, any, any];
export type cancelArg = [string, any];
export type errorAdapterType = (error: any, headers?: any) => any;

export type expandReques = (...arg: requestArg) => Promise<any>;
export type expandCancel = (...arg: cancelArg) => void;

export interface requestCancelerList {
  [key: string]: requestCanceler;
}
export interface cancelRequestInterface {
  requestCancelerList: requestCancelerList;
  getRequestKey: getRequestKey;
  addRequestCanceler: addRequestCanceler;
  getRequestCanceler: getRequestCanceler;
  removeRequestCanceler: removeRequestCanceler;
  handlerCancel: handlerCancel;
  handlerCancelAll: handlerCancelAll;
}

export interface requestInterface extends requestType {
  ax?: AxiosInstance;
  axios?: typeof axios;
  baseURL?: string;
  errorAdapter?: errorAdapterType | boolean;
  defaultExtendOption?: { [key: string]: any };

  get: expandReques;
  post: expandReques;
  put: expandReques;
  delete: expandReques;
  patch: expandReques;
  cancel: cancelRequestInterface['handlerCancel'];
  getCancel: expandCancel;
  postCancel: expandCancel;
  putCancel: expandCancel;
  deleteCancel: expandCancel;
  patchCancel: expandCancel;
  cancelAll: cancelRequestInterface['handlerCancelAll'];
}
export interface requestParams {
  data?: any;
  params?: any;
}

export type generateReqKey = (config: config) => string | undefined;

export interface options {
  enabledByDefault: boolean;
  cacheFlag: string;
  getCache: Function;
  setCache: Function;
  deleteCache: Function;
}

export interface config extends InternalAxiosRequestConfig {
  [key: string]: any;
  forceUpdate?: boolean;
  // method: string;
  // url: string;
  ttlConfig?: { [key: string]: string | undefined };
}

export type requestKey = string | undefined;
