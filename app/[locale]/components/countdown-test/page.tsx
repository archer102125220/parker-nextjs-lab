'use client';

import { useState } from 'react';
import Countdown from '@/components/Countdown';

export default function CountdownTestPage() {
  const [countdownValue, setCountdownValue] = useState(10);
  const [countupValue, setCountupValue] = useState(0);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Countdown 倒數計時組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示翻牌動畫效果的倒數/正數計時器
      </p>

      <div style={{ marginBottom: '60px' }}>
        <h2>倒數計時 (Countdown)</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Countdown
            initialSeconds={10}
            endSeconds={0}
            type="countdown"
            onStep={(current) => setCountdownValue(current)}
            onEnd={() => alert('倒數結束!')}
          />
        </div>
        <p style={{ textAlign: 'center', color: '#666' }}>
          當前值: {countdownValue}
        </p>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>正數計時 (Count Up)</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Countdown
            initialSeconds={0}
            endSeconds={10}
            type="countup"
            onStep={(current) => setCountupValue(current)}
            onEnd={() => alert('計時結束!')}
            color="#fff"
            bgColor="#e91e63"
          />
        </div>
        <p style={{ textAlign: 'center', color: '#666' }}>
          當前值: {countupValue}
        </p>
      </div>

      <div>
        <h2>自訂樣式</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Countdown
            initialSeconds={5}
            endSeconds={0}
            type="countdown"
            width={100}
            height={140}
            fontSize={60}
            color="#fff"
            bgColor="#4caf50"
          />
          <Countdown
            initialSeconds={5}
            endSeconds={0}
            type="countdown"
            width={80}
            height={120}
            fontSize={48}
            color="#fff"
            bgColor="#ff9800"
          />
          <Countdown
            initialSeconds={5}
            endSeconds={0}
            type="countdown"
            width={60}
            height={100}
            fontSize={36}
            color="#fff"
            bgColor="#9c27b0"
          />
        </div>
      </div>
    </div>
  );
}
