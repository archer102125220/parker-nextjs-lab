'use client';
import type { ReactNode } from 'react';
import { useCallback, useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import { useAppSelector } from '@/store';

import Dialog from '@/components/Dialog';

export function DialogDemo(): ReactNode {
  const nonce = useAppSelector<string>((state) => state.system.nonce);

  const [clientNonce, setClientNonce] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    console.log('Dialog Canceled/Closed');
    // setIsDialogOpen(false);
  }, []);

  const handleConfirmDialog = useCallback(() => {
    console.log('Dialog Confirmed');
    // setIsDialogOpen(false);
    // 在這裡執行確認後的操作
  }, []);

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return (
    <>
      <Button
        variant="contained"
        nonce={clientNonce}
        onClick={handleOpenDialog}
      >
        打開對話框
      </Button>

      <Dialog
        nonce={nonce}
        open={isDialogOpen}
        confirmDisabled={false}
        cancelLabel="取消"
        title="演示對話框標題"
        confirmLabel="確認操作"
        change={setIsDialogOpen}
        cancel={handleCloseDialog}
        confirm={handleConfirmDialog}
      >
        <p>這是一個基本的對話框內容。</p>
        <p>你可以根據需要自訂這裡的內容和樣式。</p>
      </Dialog>
    </>
  );
}

export default DialogDemo;
