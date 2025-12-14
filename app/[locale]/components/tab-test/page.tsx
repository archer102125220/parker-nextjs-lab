'use client';

import { useState } from 'react';
import Tabs from '@/components/Tabs';

export default function TabTestPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [verticalTab, setVerticalTab] = useState(0);

  const tabs = [
    {
      label: 'Tab 1',
      value: 0,
      content: (
        <div style={{ padding: '20px' }}>
          <h3>Tab 1 內容</h3>
          <p>這是第一個 Tab 的內容區域</p>
        </div>
      )
    },
    {
      label: 'Tab 2',
      value: 1,
      content: (
        <div style={{ padding: '20px' }}>
          <h3>Tab 2 內容</h3>
          <p>這是第二個 Tab 的內容區域</p>
        </div>
      )
    },
    {
      label: 'Tab 3',
      value: 2,
      content: (
        <div style={{ padding: '20px' }}>
          <h3>Tab 3 內容</h3>
          <p>這是第三個 Tab 的內容區域</p>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Tabs 分頁組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示 Tab 切換組件的各種用法
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本用法</h2>
        <Tabs
          tabs={tabs}
          value={activeTab}
          onChange={(value) => setActiveTab(Number(value))}
        />
        <p style={{ marginTop: '10px', color: '#666' }}>
          當前選中: Tab {activeTab + 1}
        </p>
      </div>

      <div>
        <h2>更多 Tabs</h2>
        <Tabs
          tabs={[
            { label: '首頁', value: 0, content: <div style={{ padding: '20px' }}>首頁內容</div> },
            { label: '產品', value: 1, content: <div style={{ padding: '20px' }}>產品列表</div> },
            { label: '服務', value: 2, content: <div style={{ padding: '20px' }}>服務介紹</div> },
            { label: '關於', value: 3, content: <div style={{ padding: '20px' }}>關於我們</div> },
            { label: '聯絡', value: 4, content: <div style={{ padding: '20px' }}>聯絡方式</div> }
          ]}
        />
      </div>
    </div>
  );
}
