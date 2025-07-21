'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';

import Dialog from '@/components/Dialog';

export default function DialogDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('Dialog Canceled/Closed');
    // setIsDialogOpen(false);
  };

  const handleConfirmDialog = () => {
    console.log('Dialog Confirmed');
    // setIsDialogOpen(false);
    // 在這裡執行確認後的操作
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenDialog}>
        打開對話框
      </Button>

      <Dialog
        open={isDialogOpen}
        change={setIsDialogOpen}
        cancel={handleCloseDialog}
        confirm={handleConfirmDialog}
        title="演示對話框標題"
        confirmLabel="確認操作"
        cancelLabel="取消"
        confirmDisabled={false}
      >
        <p>這是一個基本的對話框內容。</p>
        <p>你可以根據需要自訂這裡的內容和樣式。</p>
      </Dialog>
    </>
  );
}
