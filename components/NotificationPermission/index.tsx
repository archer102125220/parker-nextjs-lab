'use client';
import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '@/store';

import { firebase } from '@/utils/third-party/firebase';
import { useFirebase } from '@/hooks/useFirebase';

import style from '@/components/NotificationPermission/style.module.scss';

interface NotificationPermissionProps {
  nonce?: string;
}

export function NotificationPermission({
  nonce
}: NotificationPermissionProps): ReactNode {
  const Firebase = useFirebase();

  const [isShow, setIsShow] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const agreeNotification = useAppSelector<boolean>(
    (state) => state.system.agreeNotification
  );
  const firebaseCroeInited = useAppSelector<boolean>(
    (state) => state.system.firebaseCroeInited
  );
  const dispatch = useAppDispatch();

  const setLoading = useCallback(
    function setLoading(payload: boolean) {
      dispatch({ type: 'system/setLoading', payload });
    },
    [dispatch]
  );
  const setAgreeNotification = useCallback(
    function setAgreeNotification(payload: boolean) {
      dispatch({ type: 'system/setAgreeNotification', payload });
    },
    [dispatch]
  );
  const setFirebaseMessagingInited = useCallback(
    function setFirebaseMessagingInited(payload: boolean) {
      dispatch({ type: 'system/setFirebaseMessagingInited', payload });
    },
    [dispatch]
  );

  const handleCancel = useCallback(function cancel() {
    setIsShow(false);
  }, []);
  // TODO
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const handleCofirm = useCallback(function cofirm() {
    setProcessing(true);
    setAgreeNotification(true);
  }, []);

  const handleFirebase = useCallback(
    // TODO
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    async function _firebase() {
      console.log('handleFirebase');
      setLoading(true);

      if (
        Firebase instanceof firebase === true &&
        Firebase.messagingInited === false
      ) {
        const result = await Firebase.requestNotificationPermission();
        if (result === true) {
          const firebaseCroe = Firebase.croe;
          console.log({ Firebase, firebaseCroe });
          if (typeof firebaseCroe === 'undefined' || firebaseCroe === null) {
            await Firebase.croeInit();
            await Firebase.appInit();
          } else {
            await Firebase.messagingInit(firebaseCroe);
          }
        }
        setProcessing(false);
        setIsShow(false);
        setFirebaseMessagingInited(true);
      }

      setLoading(false);
    },
    [Firebase]
  );

  useEffect(() => {
    console.log({ firebaseCroeInited, agreeNotification });
    if (firebaseCroeInited === true && Firebase instanceof firebase === true) {
      if (agreeNotification === false) {
        // TODO
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsShow(true);
      } else if (Firebase.croeInited === false) {
        handleFirebase();
      }
    }
  }, [firebaseCroeInited, agreeNotification, Firebase]);

  return (
    <Snackbar
      nonce={`nonce-${nonce}`}
      open={isShow}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <div className={style.notification_permission}>
        <div className={style['notification_permission-content']}>
          <p>
            本專案有整合firebase 的 FCM 功能，若想測試該功能需要啟用推播權限
          </p>
        </div>
        <div className={style['notification_permission-actions']}>
          <Button
            nonce={`nonce-${nonce}`}
            color="error"
            variant="contained"
            disabled={processing}
            onClick={handleCancel}
          >
            不同意
          </Button>
          <Button
            nonce={`nonce-${nonce}`}
            color="primary"
            variant="contained"
            loading={processing}
            onClick={handleCofirm}
          >
            同意
          </Button>
        </div>
      </div>
    </Snackbar>
  );
}

export default NotificationPermission;
