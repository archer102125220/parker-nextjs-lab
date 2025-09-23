'use client';
import type { ReactNode, FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import type { FirebaseMessaging } from '@/models/firebasemessaging';

import { useAppDispatch, useAppSelector } from '@/store';

import { POST_pushNotification } from '@/services/client/firebase-admin';

type tokenListType = {
  webTokenList: FirebaseMessaging[];
  androidTokenList: FirebaseMessaging[];
  iosTokenList: FirebaseMessaging[];
};

type CloudMessagingFormProps = {
  serverTokenList: tokenListType;
};

export function CloudMessagingForm(props: CloudMessagingFormProps): ReactNode {
  const { serverTokenList } = props;

  const dispatch = useAppDispatch();

  const [appMessageTitle, setAppMessageTitle] =
    useState<string>('appMessageTitle');
  const [appMessageData, setAppMessageData] =
    useState<string>('appMessageData');
  const [appMessageImg, setAppMessageImg] = useState<string>(
    '/img/ico/favicon.svg'
  );

  const systemLoading = useAppSelector<boolean>(
    (state) => state?.system?.loading
  );

  const setSystemLoading = useCallback(
    (payload: boolean) => dispatch({ type: 'system/setLoading', payload }),
    [dispatch]
  );
  const setMessageInformation = useCallback(
    (payload: string) =>
      dispatch({ type: 'system/message_information', payload }),
    [dispatch]
  );
  const setMessageError = useCallback(
    (payload: string) => dispatch({ type: 'system/message_error', payload }),
    [dispatch]
  );
  const setWebTokenList = useCallback(
    (payload: string[]) =>
      dispatch({ type: 'firebase/setWebTokenList', payload }),
    [dispatch]
  );
  const setAndroidTokenList = useCallback(
    (payload: string[]) =>
      dispatch({ type: 'firebase/setAndroidTokenList', payload }),
    [dispatch]
  );
  const setIosTokenList = useCallback(
    (payload: string[]) =>
      dispatch({ type: 'firebase/setIosTokenList', payload }),
    [dispatch]
  );

  const POST_PushNotification = useCallback(
    async function post_pushNotification() {
      if (typeof window !== 'object') return;

      return await POST_pushNotification({
        title: appMessageTitle,
        data: appMessageData,
        img: appMessageImg
      });
    },
    [appMessageTitle, appMessageData, appMessageImg]
  );

  const handlePushNotification = useCallback(
    async function pushNotification(e: FormEvent) {
      e.preventDefault();

      console.log({
        // isValidSubmit: isValidSubmit.value,
        systemLoading
      });

      if (
        // isValidSubmit.value === false ||
        systemLoading === true
      ) {
        return false;
      }

      console.log('push notification');

      setSystemLoading(true);

      try {
        const response = await POST_PushNotification();

        console.log({ response });

        const { failureCount = 0, successCount = 0 } = response;
        setMessageInformation(
          `執行完畢，成功向${successCount}份裝置發送推播訊息，${failureCount}份裝置發送失敗`
        );
      } catch (error) {
        console.error('Error sending push notification:', error);
        setMessageError('執行失敗');
      } finally {
        setSystemLoading(false);
      }

      return false;
    },
    [systemLoading]
  );

  const handleResetForm = useCallback(function resetForm() {
    setAppMessageTitle('appMessageTitle');
    setAppMessageData('appMessageData');
    setAppMessageImg('/img/ico/favicon.svg');
  }, []);

  useEffect(() => {
    setWebTokenList(serverTokenList?.webTokenList as unknown[] as string[]);
    setAndroidTokenList(
      serverTokenList?.androidTokenList as unknown[] as string[]
    );
    setIosTokenList(serverTokenList?.iosTokenList as unknown[] as string[]);
  }, [serverTokenList]);

  return (
    <Grid
      component="form"
      container
      spacing={2}
      onSubmit={handlePushNotification}
    >
      <Grid size={12}>
        <TextField
          label="推播標題"
          fullWidth
          value={appMessageTitle}
          onChange={(e) => setAppMessageTitle(e.target.value)}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          label="推播訊息"
          fullWidth
          value={appMessageData}
          onChange={(e) => setAppMessageData(e.target.value)}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          label="推播圖片網址"
          fullWidth
          value={appMessageImg}
          onChange={(e) => setAppMessageImg(e.target.value)}
        />
      </Grid>
      <Grid
        container
        spacing={2}
        size={12}
        sx={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            disabled={systemLoading}
            onClick={handleResetForm}
          >
            重置
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={systemLoading}
          >
            送出
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CloudMessagingForm;
