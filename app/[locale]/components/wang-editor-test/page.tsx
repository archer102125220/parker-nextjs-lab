'use client';

import { useState } from 'react';
import WangEditor from '@/components/WangEditor';

export default function WangEditorTestPage() {
  const [content, setContent] = useState('<p>請在此輸入內容...</p>');
  const [readOnlyContent] = useState('<h2>唯讀模式</h2><p>這是唯讀的內容,無法編輯。</p>');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>WangEditor 富文本編輯器測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示富文本編輯器的功能
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本用法</h2>
        <WangEditor
          value={content}
          onChange={setContent}
          height={400}
        />
        <div style={{ marginTop: '20px' }}>
          <h3>HTML 輸出:</h3>
          <pre style={{ 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {content}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>唯讀模式</h2>
        <WangEditor
          value={readOnlyContent}
          readOnly={true}
          height={200}
        />
      </div>

      <div>
        <h2>自訂高度</h2>
        <WangEditor
          placeholder="輸入簡短內容..."
          height={200}
        />
      </div>
    </div>
  );
}
