import { useState, useEffect, useCallback } from 'react';
import _cloneDeep from 'lodash/cloneDeep';

import type { errorAdapterType } from '@/utils/request/request.d.ts';
import { useRequestInit } from '@/hooks/useRequest/useRequestInit';
import type { requestInit } from '@/hooks/useRequest/useRequestInit';

// import { axiosInit, request as axiosRequest } from '@/utils/request';

interface requestOptionInterface {
  apiBase: string;
  errorAdapter?: errorAdapterType;
  defaultExtendOption?: { [key: string]: any };
}

type checkPayloadType = (
  payload: any,
  path: string,
  extendOption: { [key: string]: any }
) => boolean;

type useRequestReturnType = {
  cancelRequest: () => void;
  response: any;
  isLoading: boolean;
  error: unknown | null;
  refetch: () => Promise<any>;
};

/**
 * 使用axios呼叫api的hook
 * @param {string} method - 請求HTTP method
 * @param {string} path - 請求url
 * @param {object} payload - 請求參數，會被轉換成query string或body
 * @param {function} checkPayload - 檢查請求參數的函式，如果回傳false，則不會發出請求
 * @param {boolean} hasErrorAdapter - 是否使用錯誤處理函式
 * @param {object} extendOption - 請求配置選項
 * @param {object} extendOption.retry - 重試次數
 * @param {object} extendOption.useCache - 是否使用快取，預設為true
 * @param {object} extendOption.useServiceWorkerCache - 是否使用service worker快取，預設為true
 * @param {object} extendOption.cacheKey - 快取key，預設為path
 * @param {object} extendOption.cacheTime - 快取時間，預設為1000 * 60 * 10
 * @param {object} requestOption - 請求選項，包含apiBase、errorAdapter、defaultExtendOption
 * @param {string} requestOption.apiBase - axios的baseURL，預設為process.env.NEXT_PUBLIC_API_BASE
 * @param {function} requestOption.errorAdapter - 錯誤處理函式，預設為null
 * @param {object} requestOption.defaultExtendOption - 預設的extendOption，預設為{ retry: 3 }
 * @returns {useRequestReturnType} - 包含以下屬性的物件：
 * - cancelRequest: 取消請求的函式
 * - response: 請求的回應
 * - isLoading: 是否正在等待api請求完成
 * - error: 錯誤訊息
 * - refetch: 重新請求的函式
 */
export function useRequest(
  method: string = 'get',
  path: string = '',
  payload: any = {},
  checkPayload: checkPayloadType | null,
  hasErrorAdapter: boolean,
  extendOption: { [key: string]: any } = { retry: 3 },
  requestOption: requestOptionInterface = { apiBase: '' }
): useRequestReturnType {
  const { apiBase = '', errorAdapter, defaultExtendOption } = requestOption;

  const { request: axiosRequest }: requestInit = useRequestInit(
    apiBase || process.env.NEXT_PUBLIC_API_BASE,
    errorAdapter,
    defaultExtendOption
  );

  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const cancelRequest = useCallback(() => {
    const _method = typeof method === 'string' ? method : '';
    return axiosRequest.cancel(_method.toLocaleLowerCase(), path, payload);
  }, [axiosRequest, method, path, payload]);

  const handleRequest = useCallback(async () => {
    if (
      typeof path !== 'string' ||
      path === '' ||
      (typeof checkPayload === 'function' &&
        checkPayload(payload, path, extendOption) === false)
    ) {
      return;
    }

    setIsLoading(true);

    try {
      setError(null);

      const _extendOption = _cloneDeep(extendOption);

      delete _extendOption.retry;

      if (/GET/i.test(method) === true) {
        _extendOption.useCache =
          typeof _extendOption.useCache === 'boolean'
            ? _extendOption.useCache
            : true;
        _extendOption.useServiceWorkerCache =
          typeof _extendOption.useServiceWorkerCache === 'boolean'
            ? _extendOption.useServiceWorkerCache
            : true;
      } else if (/POST|PUT|DELETE/i.test(method) === true) {
        _extendOption.useServiceWorkerCache = false;
      }

      const newResponse = await axiosRequest(
        method,
        path,
        payload,
        _extendOption,
        hasErrorAdapter
      );

      setResponse(newResponse);

      return newResponse;
    } catch (_error) {
      setError(_error);
    } finally {
      setIsLoading(false);
    }
  }, [
    axiosRequest,
    method,
    path,
    payload,
    checkPayload,
    hasErrorAdapter,
    extendOption
  ]);

  const handleRetry = useCallback(async () => {
    if (error !== null && isLoading === false) return response;
    setRetryCount(retryCount + 1);
    return await handleRequest();
  }, [error, isLoading, response, handleRequest, retryCount]);

  useEffect(() => {
    handleRequest();
  }, [payload, handleRequest]);
  useEffect(() => {
    if (error === null) return;
    const { retry } = extendOption;
    const _retry = typeof retry === 'number' ? retry : 3;
    if (retryCount <= _retry) {
      handleRetry();
    }
  }, [error, handleRetry, extendOption, retryCount]);

  return {
    cancelRequest,
    response,
    isLoading,
    error,
    refetch: handleRetry
  };
}

type argType = [
  string, // path: string;
  any, // payload: any;
  checkPayloadType | null, // checkPayload: checkPayloadType | null;
  boolean, // hasErrorAdapter: boolean;
  { [key: string]: any }, // extendOption: { [key: string]: any };
  requestOptionInterface // requestOption: requestOptionInterface;
];

/**
 * 使用axios呼叫GET api的hook
 * @param {string} path - 請求url
 * @param {object} payload - 請求參數，會被轉換成query string
 * @param {function} checkPayload - 檢查請求參數的函式，如果回傳false，則不會發出請求
 * @param {boolean} hasErrorAdapter - 是否使用錯誤處理函式
 * @param {object} extendOption - 請求配置選項
 * @param {object} requestOption - 請求選項，包含apiBase、errorAdapter、defaultExtendOption
 * @returns {useRequestReturnType} - 包含以下屬性的物件：
 * - cancelRequest: 取消請求的函式
 * - response: 請求的回應
 * - isLoading: 是否正在等待api請求完成
 * - error: 錯誤訊息
 * - refetch: 重新請求的函式
 */
export function useGetRequest(...arg: argType): useRequestReturnType {
  return useRequest('get', ...arg);
}

/**
 * 使用axios呼叫POST api的hook
 * @param {string} path - 請求url
 * @param {object} payload - 請求參數，會被轉換成body
 * @param {function} checkPayload - 檢查請求參數的函式，如果回傳false，則不會發出請求
 * @param {boolean} hasErrorAdapter - 是否使用錯誤處理函式
 * @param {object} extendOption - 請求配置選項
 * @param {object} requestOption - 請求選項，包含apiBase、errorAdapter、defaultExtendOption
 * @returns {useRequestReturnType} - 包含以下屬性的物件：
 * - cancelRequest: 取消請求的函式
 * - response: 請求的回應
 * - isLoading: 是否正在等待api請求完成
 * - error: 錯誤訊息
 * - refetch: 重新請求的函式
 */
export function usePostRequest(...arg: argType): useRequestReturnType {
  return useRequest('post', ...arg);
}

/**
 * 使用axios呼叫PATCH api的hook
 * @param {string} path - 請求url
 * @param {object} payload - 請求參數，會被轉換成body
 * @param {function} checkPayload - 檢查請求參數的函式，如果回傳false，則不會發出請求
 * @param {boolean} hasErrorAdapter - 是否使用錯誤處理函式
 * @param {object} extendOption - 請求配置選項
 * @param {object} requestOption - 請求選項，包含apiBase、errorAdapter、defaultExtendOption
 * @returns {useRequestReturnType} - 包含以下屬性的物件：
 * - cancelRequest: 取消請求的函式
 * - response: 請求的回應
 * - isLoading: 是否正在等待api請求完成
 * - error: 錯誤訊息
 * - refetch: 重新請求的函式
 */
export function usePatchRequest(...arg: argType): useRequestReturnType {
  return useRequest('patch', ...arg);
}


/**
 * 使用axios呼叫PUT api的hook
 * @param {string} path - 請求url
 * @param {object} payload - 請求參數，會被轉換成body
 * @param {function} checkPayload - 檢查請求參數的函式，如果回傳false，則不會發出請求
 * @param {boolean} hasErrorAdapter - 是否使用錯誤處理函式
 * @param {object} extendOption - 請求配置選項
 * @param {object} requestOption - 請求選項，包含apiBase、errorAdapter、defaultExtendOption
 * @returns {useRequestReturnType} - 包含以下屬性的物件：
 * - cancelRequest: 取消請求的函式
 * - response: 請求的回應
 * - isLoading: 是否正在等待api請求完成
 * - error: 錯誤訊息
 * - refetch: 重新請求的函式
 */
export function usePutRequest(...arg: argType): useRequestReturnType {
  return useRequest('put', ...arg);
}


/**
 * 使用axios呼叫DELETE api的hook
 * @param {string} path - 請求url
 * @param {object} payload - 請求參數，會被轉換成query string
 * @param {function} checkPayload - 檢查請求參數的函式，如果回傳false，則不會發出請求
 * @param {boolean} hasErrorAdapter - 是否使用錯誤處理函式
 * @param {object} extendOption - 請求配置選項
 * @param {object} requestOption - 請求選項，包含apiBase、errorAdapter、defaultExtendOption
 * @returns {useRequestReturnType} - 包含以下屬性的物件：
 * - cancelRequest: 取消請求的函式
 * - response: 請求的回應
 * - isLoading: 是否正在等待api請求完成
 * - error: 錯誤訊息
 * - refetch: 重新請求的函式
 */
export function useDeleteRequest(...arg: argType): useRequestReturnType {
  return useRequest('delete', ...arg);
}

export default useRequest;
