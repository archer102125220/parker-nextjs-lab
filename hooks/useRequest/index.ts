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

export function useRequest(
  method: string = 'get',
  path: string = '',
  payload: any = {},
  checkPayload: checkPayloadType | null,
  hasErrorAdapter: boolean,
  extendOption: { [key: string]: any } = { retry: 3 },
  requestOption: requestOptionInterface = { apiBase: '' }
) {
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

export function useGetRequest(...arg: argType) {
  return useRequest('get', ...arg);
}

export const usePostRequest = (...arg: argType) => {
  return useRequest('post', ...arg);
};

export const usePatchRequest = (...arg: argType) => {
  return useRequest('patch', ...arg);
};

export const usePutRequest = (...arg: argType) => {
  return useRequest('put', ...arg);
};

export const useDeleteRequest = (...arg: argType) => {
  return useRequest('delete', ...arg);
};

export default useRequest;
