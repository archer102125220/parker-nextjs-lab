'use client';
import type { ReactNode, FormEvent } from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import type { responseType } from '@/utils/request';

import { useAppSelector, useAppDispatch } from '@/store';

import ScrollFetch from '@/components/ScrollFetch';

import { useGitHubUsersRepos } from '@/hooks/gitHub/useGitHubUsers';
// import { GET_scrollFetchTest } from '@/services/nuxt-server';

import style from '@/app/[locale]/components/scroll-fetch/page.module.scss';

interface ScrollFetchDemoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initDisplayDataList?: any[];
}
export function ScrollFetchDemo(props: ScrollFetchDemoProps): ReactNode {
  const { initDisplayDataList = [] } = props;

  const dispatch = useAppDispatch();
  const nonce = useAppSelector<string>((state) => state.system.nonce);
  const loading = useAppSelector<boolean>((state) => state.system.loading);

  const setLoading = useCallback(
    (payload: boolean) => dispatch({ type: 'system/setLoading', payload }),
    [dispatch]
  );
  // const setMessageSuccess = useCallback(
  //   (payload: string) => dispatch({ type: 'system/message_success', payload }),
  //   [dispatch]
  // );

  const [displayDataList, setDisplayDataList] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any[]>(initDisplayDataList);
  const [userTokenType, setUserTokenType] = useState<string>('default');
  const [userInputToken, setUserInputToken] = useState<string>('');
  const [userAccountType, setUserAccountType] = useState<string>('default');
  const [userInputAccount, setUserInputAccount] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const token = useMemo(
    function () {
      return userTokenType === 'default'
        ? process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
        : userInputToken;
    },
    [userTokenType, userInputToken]
  );
  const account = useMemo(
    function () {
      return userAccountType === 'default'
        ? process.env.NEXT_PUBLIC_GITHUB_ACCOUNT || ''
        : userInputAccount;
    },
    [userAccountType, userInputAccount]
  );

  const { isLoading, hasNext, error, refresh } = useGitHubUsersRepos(
    {
      token,
      account,
      page
    },
    function (_response: responseType) {
      // console.log({ _response });

      if (Array.isArray(_response?.data) && _response.data.length > 0) {
        const newDisplayDataList = Array.isArray(displayDataList)
          ? displayDataList
          : [];
        setDisplayDataList([...newDisplayDataList, ..._response.data]);
      }
    }
  );

  const handleRefresh = useCallback(
    function refresh(e?: FormEvent) {
      if (typeof e?.preventDefault === 'function') {
        e.preventDefault();
      }

      if (isLoading === true || loading === true) {
        return;
      }

      setDisplayDataList([]);
      setPage(1);
    },
    [page, isLoading, loading]
  );

  const handleInfinityFetch = useCallback(
    function infinityFetch() {
      if (page === 0 || isLoading === true || loading === true) {
        return;
      }
      setPage(page + 1);
    },
    [isLoading, loading, page]
  );

  useEffect(
    function () {
      if (error !== null && page > 1) {
        setTimeout(() => {
          setPage(0);
        }, 0);
      }
    },
    [error, page]
  );

  useEffect(
    function () {
      if (loading !== isLoading) {
        setLoading(isLoading);
      }
    },
    [setLoading, loading, isLoading]
  );

  useEffect(
    function () {
      if (page > 0) {
        refresh();
      }
    },
    [page]
  );

  return (
    <>
      <div className={style['scroll_fetch_test_page-description']}>
        <a
          rel="noopener"
          target="_blank"
          href="https://github.com/archer102125220/parker-nuxt-lab/blob/main/app/pages/components/scroll-fetch.vue"
        >
          本頁GitHub
        </a>
        <a
          rel="noopener"
          target="_blank"
          href="https://github.com/archer102125220/parker-nuxt-lab/blob/main/app/components/ScrollFetch.vue"
        >
          本組件GitHub
        </a>
      </div>
      <form
        className={style['scroll_fetch_page-form']}
        onSubmit={handleRefresh}
      >
        <FormControl>
          <RadioGroup
            row
            value={userTokenType}
            onChange={(e, value) => setUserTokenType(value)}
          >
            <FormControlLabel
              value="default"
              control={<Radio />}
              label="使用專案設定GitHub Token"
            />
            <FormControlLabel
              value="input"
              control={<Radio />}
              label={(function () {
                return (
                  <div className={style['scroll_fetch_page-form-token_option']}>
                    <p
                      className={
                        style['scroll_fetch_page-form-token_option-label']
                      }
                    >
                      自行輸入GitHub Token
                    </p>
                    <TextField
                      className={
                        style['scroll_fetch_page-form-token_option-token_input']
                      }
                      variant="filled"
                      value={userInputToken}
                      disabled={userTokenType !== 'input'}
                      onChange={(e) => setUserInputToken(e.target.value)}
                    />
                  </div>
                );
              })()}
            />
          </RadioGroup>
        </FormControl>

        {/* <v-radio-group
        className="scroll_fetch_test_page-form-account_type"
        inline
        v-model="userAccountType"
      >
        <v-radio
          color="primary"
          label="使用專案設定GitHub 帳號"
          value="default"
        />

        <v-radio color="primary" label="自行輸入GitHub帳號" value="input" />
        <v-text-field
          clearable
          label="GitHub帳號"
          v-model="userInputAccount"
          className="scroll_fetch_test_page-form-account_type-account_input"
          :disabled="userAccountType !== 'input'"
        />
      </v-radio-group> */}
        <FormControl>
          <RadioGroup
            row
            value={userAccountType}
            onChange={(e, value) => setUserAccountType(value)}
          >
            <FormControlLabel
              value="default"
              control={<Radio />}
              label="使用專案設定GitHub 帳號"
            />
            <FormControlLabel
              value="input"
              control={<Radio />}
              label={(function () {
                return (
                  <div
                    className={style['scroll_fetch_page-form-account_option']}
                  >
                    <p
                      className={
                        style['scroll_fetch_page-form-account_option-label']
                      }
                    >
                      自行輸入GitHub帳號
                    </p>
                    <TextField
                      className={
                        style[
                          'scroll_fetch_page-form-account_option-account_input'
                        ]
                      }
                      variant="filled"
                      value={userInputAccount}
                      disabled={userAccountType !== 'input'}
                      onChange={(e) => setUserInputAccount(e.target.value)}
                    />
                  </div>
                );
              })()}
            />
          </RadioGroup>
        </FormControl>

        <Button type="submit" fullWidth color="primary" variant="contained">
          重新載入
        </Button>
      </form>

      <ScrollFetch
        nonce={nonce}
        loading={isLoading}
        infinityEnd={hasNext === false}
        iosStyle={false}
        refreshDisable={false}
        className={style['scroll_fetch_page-scroll_fetch']}
        height="85dvh"
        refreshIcon="/img/icon/refresh/refresh-icon.svg"
        refreshingIcon="/img/icon/refresh/refreshing-icon.svg"
        infinityBuffer={500}
        onRefresh={handleRefresh}
        onInfinityFetch={handleInfinityFetch}
      >
        <div className={style['scroll_fetch_page-scroll_fetch-content']}>
          {displayDataList.map((displayData, index) => (
            <div
              key={displayData.id}
              className={style['scroll_fetch_page-scroll_fetch-content-item']}
            >
              <p
                className={
                  style['scroll_fetch_page-scroll_fetch-content-item-number']
                }
              >
                No.{index + 1}
              </p>
              {/* <p
              className={
                style[
                  'scroll_fetch_page-scroll_fetch-content-item-full_name'
                ]
              }
            >
              {displayData.full_name}
            </p> */}
              <p
                className={
                  style['scroll_fetch_page-scroll_fetch-content-item-name']
                }
              >
                respo名稱: {displayData.name}
              </p>
              <p
                className={
                  style[
                    'scroll_fetch_page-scroll_fetch-content-item-description'
                  ]
                }
              >
                repo描述: {displayData.description}
              </p>
              <div
                className={
                  style['scroll_fetch_page-scroll_fetch-content-item-html_link']
                }
              >
                <p>repo連結:</p>
                <a
                  className={
                    style[
                      'scroll_fetch_page-scroll_fetch-content-item-html_link-repo_link'
                    ]
                  }
                  target="_blank"
                  href={displayData.html_url}
                >
                  {displayData.html_url}
                </a>
              </div>
            </div>
          ))}
        </div>
      </ScrollFetch>
    </>
  );
}

export default ScrollFetchDemo;
