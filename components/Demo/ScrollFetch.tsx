'use client';
import type { ReactNode } from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';

import ScrollFetch from '@/components/ScrollFetch';

import { useAppSelector, useAppDispatch } from '@/store';

import { GET_scrollFetchTest } from '@/services/nuxt-server';

import style from '@/app/[locale]/components/drawer/page.module.scss';

export function ScrollFetchDemo(): ReactNode {
  const dispatch = useAppDispatch();
  const nonce = useAppSelector<string>((state) => state.system.nonce);
  const loading = useAppSelector<boolean>((state) => state.system.loading);

  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
  const [infinityLoading, setInfinityLoading] = useState<boolean>(false);
  // const [infinityEnd, setInfinityEnd] = useState<boolean>(false);
  const [infinityEnd] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const limit = useMemo<number>(() => page * 20, [page]);
  const dataList = useMemo<string[] | number[]>(() => {
    const _dataList = [];
    for (let i = 0; i <= page * limit; i++) {
      _dataList.push(i);
      // let data = '';
      // for (let j = i; j >= 0; j--) {
      //   data += j;
      // }
      // _dataList.push(data);
    }
    return _dataList;
  }, [page, limit]);

  const setLoading = useCallback(
    (payload: boolean) => dispatch({ type: 'system/setLoading', payload }),
    [dispatch]
  );
  // const setMessageSuccess = useCallback(
  //   (payload: string) => dispatch({ type: 'system/message_success', payload }),
  //   [dispatch]
  // );

  const handleRefresh = useCallback(
    async function refresh() {
      if (
        refreshLoading === true ||
        infinityLoading === true ||
        loading === true
      ) {
        return;
      }

      setRefreshLoading(true);
      setLoading(true);
      console.log('handleRefresh');

      const response = await GET_scrollFetchTest(
        { page: 1 },
        { useCache: true, useCacheRefresh: false }
      );
      // await new Promise((resolve) => setTimeout(() => resolve(undefined), 1000));
      console.log({ response });

      console.log('handleRefresh setTimeout');

      setLoading(false);
      setInfinityLoading(false);
      setPage(1);
    },
    [refreshLoading, infinityLoading, loading, setLoading]
  );

  const handleInfinityFetch = useCallback(
    async function infinityFetch() {
      if (
        refreshLoading === true ||
        infinityLoading === true ||
        loading === true
      ) {
        return;
      }

      setInfinityLoading(true);
      setLoading(true);

      console.log('handleInfinityFetch');
      const response = await GET_scrollFetchTest(
        { page: page + 1 },
        { useCache: true, useCacheRefresh: false }
      );
      // await new Promise((resolve) => setTimeout(() => resolve(undefined), 1000));
      console.log({ response });

      // setInfinityEnd(true);
      console.log('handleInfinityFetch setTimeout');
      setLoading(false);
      setInfinityLoading(false);
      setPage(page + 1);
    },
    [refreshLoading, infinityLoading, loading, setLoading, page]
  );

  return (
    <ScrollFetch
      nonce={nonce}
      loading={loading}
      infinityEnd={infinityEnd}
      iosStyle={false}
      refreshDisable={false}
      height="85dvh"
      refreshIcon="/img/icon/refresh/refresh-icon.svg"
      refreshingIcon="/img/icon/refresh/refreshing-icon.svg"
      infinityBuffer={500}
      onRefresh={handleRefresh}
      onInfinityFetch={handleInfinityFetch}
    >
      <div className={style['scroll_fetch_page-content']}>
        {dataList.map((data, index) => (
          <p key={index} className={style['scroll_fetch_page-content-text']}>
            {data}
          </p>
        ))}
      </div>
    </ScrollFetch>
  );
}

export default ScrollFetchDemo;
