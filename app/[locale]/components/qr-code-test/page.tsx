'use client';

import { useState } from 'react';
import QRCode from '@/components/QRCode';
import style from './page.module.scss';

export default function QRCodeTestPage() {
  const [customValue, setCustomValue] = useState('');

  return (
    <div className={style.qr_code_test_page}>
      <h1>QRCode 組件測試</h1>
      <p className={style['qr_code_test_page-description']}>
        展示 QR Code 生成器的各種用法
      </p>

      <div className={style['qr_code_test_page-section']}>
        <h2>基本用法</h2>
        <QRCode qrCodeValue="https://github.com" />
        <p className={style['qr_code_test_page-section-note']}>
          當前值: https://github.com
        </p>
      </div>

      <div className={style['qr_code_test_page-section']}>
        <h2>自訂大小</h2>
        <div className={style['qr_code_test_page-size_group']}>
          <QRCode qrCodeValue="Small QR Code" width={100} height={100} />
          <QRCode qrCodeValue="Medium QR Code" width={150} height={150} />
          <QRCode qrCodeValue="Large QR Code" width={200} height={200} />
        </div>
      </div>

      <div>
        <h2>動態生成</h2>
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="輸入要生成 QR Code 的內容"
          className={style['qr_code_test_page-input']}
        />
        {customValue && (
          <div>
            <QRCode qrCodeValue={customValue} width={200} height={200} />
          </div>
        )}
      </div>
    </div>
  );
}
