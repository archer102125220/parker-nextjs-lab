'use client';

import { useState } from 'react';
import SwitchButton from '@/components/SwitchButton';

export default function SwitchButtonPage() {
  const [isOn, setIsOn] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [customSwitch, setCustomSwitch] = useState(false);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>SwitchButton 開關組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示開關按鈕的各種用法和狀態
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本用法</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <SwitchButton
            value={isOn}
            onChange={setIsOn}
          />
          <span>狀態: {isOn ? '開啟' : '關閉'}</span>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>停用狀態</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <SwitchButton value={true} disabled={true} />
            <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>開啟 + 停用</p>
          </div>
          <div>
            <SwitchButton value={false} disabled={true} />
            <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>關閉 + 停用</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>自訂顏色</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <SwitchButton
            value={customSwitch}
            onChange={setCustomSwitch}
            checkedBgColor="#4caf50"
          />
          <SwitchButton
            value={customSwitch}
            onChange={setCustomSwitch}
            checkedBgColor="#f44336"
          />
          <SwitchButton
            value={customSwitch}
            onChange={setCustomSwitch}
            checkedBgColor="#ff9800"
          />
        </div>
      </div>

      <div>
        <h2>實際應用範例</h2>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <span>啟用通知</span>
            <SwitchButton value={isEnabled} onChange={setIsEnabled} />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span>深色模式</span>
            <SwitchButton value={isOn} onChange={setIsOn} />
          </div>
        </div>
      </div>
    </div>
  );
}
