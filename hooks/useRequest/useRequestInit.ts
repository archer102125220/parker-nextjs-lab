'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

import type {
  errorAdapterType,
  requestInterface
} from '@/utils/request/request.d.ts';
import { axiosInit, request as axiosRequest } from '@/utils/request';

export interface requestInit {
  request: requestInterface;
  isInitialized: boolean;
  isLoading: boolean;
  error: unknown | null;
  reinitialize: Function;
}

/**
 * 初始化axios
 * @param {string} apiBase - axios的baseURL
 * @param {function} errorAdapter - 錯誤處理函式
 * @param {object} defaultExtendOption - 呼叫api時預設的extendOption
 * @returns {requestInit} - 包含以下屬性的物件：
 * - request: 呼叫api的函式
 * - isInitialized: 是否已經初始化
 * - isLoading: 是否正在初始化
 * - error: 初始化錯誤訊息
 * - reinitialize: 重新初始化axios
 */
export function useRequestInit(
  apiBase: string = '',
  errorAdapter?: errorAdapterType,
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultExtendOption?: { [key: string]: any }
): requestInit {
  const isInitialized = useRef<boolean>(
    typeof axiosRequest.ax === 'object' && axiosRequest.ax !== null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const initialize = useCallback(() => {
    if (
      !isInitialized.current &&
      (typeof axiosRequest.ax !== 'object' || axiosRequest.ax === null)
    ) {
      setIsLoading(true);
      setError(null);

      try {
        const baseURL = apiBase || process.env.NEXT_PUBLIC_API_BASE || '';
        console.log({ baseURL });
        if (typeof baseURL !== 'string' || baseURL === '') {
          console.warn('NEXT_PUBLIC_API_BASE 環境變數未設定');
        }
        axiosInit(baseURL, errorAdapter, defaultExtendOption);
        isInitialized.current = true;
      } catch (err) {
        setError(err);
        console.error('初始化 axios 失敗:', err);
      }

      setIsLoading(false);
    }
  }, [apiBase, errorAdapter, defaultExtendOption]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    request: axiosRequest,
    isInitialized: isInitialized.current,
    isLoading,
    error,
    reinitialize: initialize
  };
}

export default useRequestInit;
