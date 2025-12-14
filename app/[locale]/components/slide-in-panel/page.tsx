'use client';

import { useState } from 'react';
import SlideInPanel from '@/components/SlideInPanel';

export default function SlideInPanelPage() {
  const [message, setMessage] = useState<string>('');

  const addMessage = (msg: string) => {
    setMessage(msg);
    // Reset after a short delay to allow the component to process
    setTimeout(() => setMessage(''), 100);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>SlideInPanel 滑入通知面板測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示滑入通知面板的各種類型
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>添加通知</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => addMessage('操作成功!')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            成功訊息
          </button>
          <button
            onClick={() => addMessage('發生錯誤!')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            錯誤訊息
          </button>
          <button
            onClick={() => addMessage('這是一則資訊')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            資訊訊息
          </button>
          <button
            onClick={() => addMessage('請注意!')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            警告訊息
          </button>
        </div>
      </div>

      <SlideInPanel
        value={message}
        timeout={3000}
        maxRow={5}
      />
    </div>
  );
}
