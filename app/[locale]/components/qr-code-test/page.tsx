'use client';

import { useState } from 'react';
import QRCode from '@/components/QRCode';

export default function QRCodeTestPage() {
  const [customValue, setCustomValue] = useState('');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>QRCode 組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示 QR Code 生成器的各種用法
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本用法</h2>
        <QRCode qrCodeValue="https://github.com" />
        <p style={{ marginTop: '10px', color: '#666' }}>
          當前值: https://github.com
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>自訂大小</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
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
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
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
