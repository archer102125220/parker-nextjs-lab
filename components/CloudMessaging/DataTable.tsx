'use client';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CachedIcon from '@mui/icons-material/Cached';

import type { FirebaseMessaging } from '@/models/firebasemessaging';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  GET_getMessageTokens,
  DELETE_cancelMessageToken as DELETE_DeleteToken
} from '@/services/client/firebase-admin';

import style from '@/app/[locale]/firebase/cloud-messaging/page.module.scss';

type tokenListType = {
  webTokenList: FirebaseMessaging[];
  androidTokenList: FirebaseMessaging[];
  iosTokenList: FirebaseMessaging[];
};

type CloudMessagingDataTableProps = {
  serverTokenList: tokenListType;
};

function CloudMessagingDataTable(
  props: CloudMessagingDataTableProps
): ReactNode {
  const { serverTokenList } = props;

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [refreshResponse, setRefreshResponse] = useState<tokenListType | null>(
    null
  );

  const OS_TD_TITLE = useMemo(() => '作業系統', []);
  const TOKEN_TD_TITLE = useMemo(() => 'token', []);
  const ACRION_TITLE = useMemo(() => '操作', []);

  const systemLoading = useAppSelector((state) => state?.system?.loading);

  const webTokenList = useMemo(
    () =>
      Array.isArray(refreshResponse?.webTokenList) === true
        ? refreshResponse.webTokenList
        : Array.isArray(serverTokenList?.webTokenList) === true
          ? serverTokenList?.webTokenList
          : [],
    [refreshResponse, serverTokenList]
  );
  const androidTokenList = useMemo(
    () =>
      Array.isArray(refreshResponse?.androidTokenList) === true
        ? refreshResponse.androidTokenList
        : Array.isArray(serverTokenList?.androidTokenList) === true
          ? serverTokenList?.androidTokenList
          : [],
    [refreshResponse, serverTokenList]
  );
  const iosTokenList = useMemo(
    () =>
      Array.isArray(refreshResponse?.iosTokenList) === true
        ? refreshResponse.iosTokenList
        : Array.isArray(serverTokenList?.iosTokenList) === true
          ? serverTokenList?.iosTokenList
          : [],
    [refreshResponse, serverTokenList]
  );
  const isEmpty = useMemo(
    () =>
      webTokenList.length <= 0 &&
      androidTokenList.length <= 0 &&
      iosTokenList.length <= 0,
    [webTokenList, androidTokenList, iosTokenList]
  );

  const setSystemLoading = useCallback(
    (payload: boolean) => dispatch({ type: 'system/setLoading', payload }),
    [dispatch]
  );
  const setMessageSuccess = useCallback(
    (payload: string) => dispatch({ type: 'system/message_success', payload }),
    [dispatch]
  );
  const setMessageError = useCallback(
    (payload: string) => dispatch({ type: 'system/message_error', payload }),
    [dispatch]
  );

  const handleRefresh = useCallback(
    async function refresh() {
      if (loading === true || systemLoading === true) return;

      setLoading(true);
      setSystemLoading(true);
      try {
        const response = await GET_getMessageTokens();
        setRefreshResponse(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setSystemLoading(false);
      }
    },
    [loading, systemLoading]
  );

  const handleDeleteToken = useCallback(
    async function deleteToken(token: string) {
      if (loading === true || systemLoading === true) {
        return;
      }

      console.log({ token });

      setLoading(true);
      setSystemLoading(true);
      try {
        await DELETE_DeleteToken(token);
        await handleRefresh();
        setMessageSuccess('刪除成功');
      } catch (error) {
        console.error('Error deleting token:', error);
        setMessageError('刪除失敗');
      } finally {
        setLoading(false);
        setSystemLoading(false);
      }
    },
    [loading, systemLoading]
  );

  return (
    <Box sx={{ marginTop: '8px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<CachedIcon />}
          disabled={systemLoading}
          onClick={handleRefresh}
        >
          重新整理
        </Button>
      </Box>

      {loading === true ? (
        <Skeleton sx={{ minHeight: '300px' }} />
      ) : isEmpty === true ? (
        ''
      ) : (
        <table
          className={
            style[
              'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table'
            ]
          }
        >
          <thead
            className={
              style[
                'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-thead'
              ]
            }
          >
            <tr
              className={
                style[
                  'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-thead-title_row'
                ]
              }
            >
              <th
                className={
                  style[
                    'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-thead-title_row-os_th'
                  ]
                }
              >
                {OS_TD_TITLE}
              </th>
              <th
                className={
                  style[
                    'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-thead-title_row-token_th'
                  ]
                }
              >
                {TOKEN_TD_TITLE}
              </th>
              <th
                className={
                  style[
                    'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-thead-title_row-action_th'
                  ]
                }
              >
                {ACRION_TITLE}
              </th>
            </tr>
          </thead>
          <tbody
            className={
              style[
                'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody'
              ]
            }
          >
            {webTokenList.map((webToken, webTokenIndex) => (
              <tr
                key={webToken.token as unknown as string}
                data-title={`web token No.${webTokenIndex + 1}`}
                className={
                  style[
                    'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr'
                  ]
                }
              >
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-os_td'
                    ]
                  }
                  data-title={`${OS_TD_TITLE}：`}
                  data-context={webToken.os}
                >
                  {webToken.os as unknown as string}
                </td>
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-token_td'
                    ]
                  }
                  data-title={`${TOKEN_TD_TITLE}：`}
                  data-context={webToken.token}
                >
                  {webToken.token as unknown as string}
                </td>
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-action_td'
                    ]
                  }
                  data-title={`${ACRION_TITLE}：`}
                >
                  <Button
                    color="error"
                    disabled={systemLoading}
                    onClick={() =>
                      handleDeleteToken(webToken.token as unknown as string)
                    }
                  >
                    刪除
                  </Button>
                </td>
              </tr>
            ))}

            {androidTokenList.map((androidToken, androidTokenIndex) => (
              <tr
                key={androidToken.token as unknown as string}
                data-title={`android token No.${androidTokenIndex + 1}`}
                className={
                  style[
                    'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr'
                  ]
                }
              >
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-os_td'
                    ]
                  }
                  data-title={`${OS_TD_TITLE}：`}
                  data-context={androidToken.os}
                >
                  {androidToken.os as unknown as string}
                </td>
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-token_td'
                    ]
                  }
                  data-title={`${TOKEN_TD_TITLE}：`}
                  data-context={androidToken.token}
                >
                  {androidToken.token as unknown as string}
                </td>
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-action_td'
                    ]
                  }
                  data-title={`${ACRION_TITLE}：`}
                >
                  <Button
                    color="error"
                    disabled={systemLoading}
                    onClick={() =>
                      handleDeleteToken(androidToken.token as unknown as string)
                    }
                  >
                    刪除
                  </Button>
                </td>
              </tr>
            ))}

            {iosTokenList.map((iosToken, iosTokenIndex) => (
              <tr
                key={iosToken.token as unknown as string}
                data-title={`ios token No.${iosTokenIndex + 1}`}
                className={
                  style[
                    'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr'
                  ]
                }
              >
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-os_td'
                    ]
                  }
                  data-title={`${OS_TD_TITLE}：`}
                  data-context={iosToken.os}
                >
                  {iosToken.os as unknown as string}
                </td>
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-token_td'
                    ]
                  }
                  data-title={`${TOKEN_TD_TITLE}：`}
                  data-context={iosToken.token}
                >
                  {iosToken.token as unknown as string}
                </td>
                <td
                  className={
                    style[
                      'cloud_messaging_page-skeleton_loader-scroll_fetch-token_table-tbody-tr-action_td'
                    ]
                  }
                  data-title={`${ACRION_TITLE}：`}
                >
                  <Button
                    color="error"
                    disabled={systemLoading}
                    onClick={() =>
                      handleDeleteToken(iosToken.token as unknown as string)
                    }
                  >
                    刪除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  );
}

export default CloudMessagingDataTable;
