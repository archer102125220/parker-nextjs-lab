'use client';
import type { ReactNode } from 'react';
import { useState, useMemo, useCallback } from 'react';

import ScrollFetch from '@/components/ScrollFetch';

import { useAppSelector, useAppDispatch } from '@/store';

import { GET_scrollFetchTest } from '@/services/nuxt-server';

import style from '@/app/[locale]/components/drawer/page.module.scss';

function ScrollFetchDemo(): ReactNode {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.system.loading);

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [infinityLoading, setInfinityLoading] = useState(false);
  // const [infinityEnd, setInfinityEnd] = useState(false);
  const [infinityEnd] = useState(false);
  const [page, setPage] = useState(1);

  const limit = useMemo(() => page * 20, [page]);
  const dataList = useMemo(() => {
    const _dataList = [];
    for (let i = 0; i <= page * limit; i++) {
      // _dataList.push(i);
      let data = '';
      for (let j = i; j >= 0; j--) {
        data += j;
      }
      _dataList.push(data);
    }
    return _dataList;
  }, [page, limit]);

  const setLoading = useCallback(
    (payload: boolean) => dispatch({ type: 'system/setLoading', payload }),
    [dispatch]
  );

  const handleRefresh = useCallback(
    async function refresh(done: () => void) {
      if (
        refreshLoading === true ||
        infinityLoading === true ||
        loading === true
      ) {
        done();
        return;
      }

      setRefreshLoading(true);
      setLoading(true);
      console.log('handleRefresh');

      setPage(1);
      const response = await GET_scrollFetchTest(
        { page },
        { useCache: false, useCacheRefresh: true }
      );
      // await new Promise((resolve) =>
      //   setTimeout(() => resolve(undefined), 1000)
      // );

      console.log({ response });

      console.log('handleRefresh setTimeout');
      done();
      // nuxtApp.$successMessage('handleRefresh');
      setLoading(false);
      setRefreshLoading(false);
    },
    [refreshLoading, infinityLoading, loading]
  );
  const handleInfinityFetch = useCallback(async function infinityFetch(
    done: () => void
  ) {
    if (
      refreshLoading === true ||
      infinityLoading === true ||
      loading === true
    ) {
      done();
      return;
    }

    setInfinityLoading(true);
    setLoading(true);
    console.log('handleInfinityFetch');

    setPage(page + 1);
    const response = await GET_scrollFetchTest(
      { page: page },
      { useCache: true, useCacheRefresh: false }
    );
    // await new Promise((resolve) => setTimeout(() => resolve(undefined), 1000));

    console.log({ response });

    // setInfinityEnd(true);
    console.log('handleInfinityFetch setTimeout');
    done();
    // nuxtApp.$successMessage('handleInfinityFetch');
    setLoading(false);
    setInfinityLoading(false);
  }, []);

  return (
    <ScrollFetch
      iosStyle={false}
      refreshDisable={false}
      height="85dvh"
      refreshIcon="/img/icon/refresh/refresh-icon.svg"
      refreshingIcon="/img/icon/refresh/refreshing-icon.svg"
      loading={loading}
      infinityBuffer={500}
      infinityEnd={infinityEnd}
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
