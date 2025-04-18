'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@/components/Dialog/Index'; // 導入 Dialog 元件

export default function DialogDemoPage() {
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
    <div>
      <h1>Dialog 元件演示</h1>
      <Button variant="contained" onClick={handleOpenDialog}>
        打開對話框
      </Button>

      <Dialog
        open={isDialogOpen}
        change={setIsDialogOpen} // 用於 Dialog 內部觸發關閉（例如點擊遮罩層）
        cancel={handleCloseDialog} // 點擊取消按鈕時觸發
        confirm={handleConfirmDialog} // 點擊確認按鈕時觸發
        title="演示對話框標題"
        confirmLabel="確認操作"
        cancelLabel="取消"
        confirmDisabled={false} // 控制確認按鈕是否禁用
        // 其他 props 可以根據需要添加，例如 width, height 等
        // position="fixed" // 預設可能是 fixed
        // zIndex={1300} // MUI Dialog 預設 z-index
      >
        {/* Dialog 的內容 */}
        <p>這是一個基本的對話框內容。</p>
        <p>你可以根據需要自訂這裡的內容和樣式。</p>
      </Dialog>
    </div>
  );
}
