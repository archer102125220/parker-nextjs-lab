'use client';

import { useState } from 'react';
import Countdown from '@/components/Countdown';

export default function CountdownTestPage() {
  const [countdownValue, setCountdownValue] = useState(10);
  const [countupValue, setCountupValue] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(true);
  const [isCountupRunning, setIsCountupRunning] = useState(true);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Countdown 倒數計時組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示翻牌動畫效果的倒數/正數計時器（基於 Nuxt 版本實現）
      </p>

      <div style={{ marginBottom: '60px' }}>
        <h2>倒數計時 (Down)</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Countdown
            countdownType="down"
            initialSeconds={10}
            endSecond={0}
            isCountdownStart={isCountdownRunning}
            width={200}
            height={100}
            bgColor="#667eea"
            color="#fff"
            onUpdateModelValue={setCountdownValue}
            onUpdateIsCountdownStart={setIsCountdownRunning}
            onCountdownStep={(current) => console.log('Step:', current)}
            onCountdownEnd={() => {
              console.log('倒數結束!');
              setIsCountdownRunning(false);
              // alert('倒數結束!');
            }}
          />
        </div>
        <p style={{ textAlign: 'center', color: '#666' }}>
          當前值: {countdownValue} | 運行中: {isCountdownRunning ? '是' : '否'}
        </p>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2>正數計時 (Up)</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Countdown
            countdownType="up"
            initialSeconds={0}
            endSecond={10}
            isCountdownStart={isCountupRunning}
            width={250}
            height={175}
            bgColor="#e91e63"
            color="#fff"
            onUpdateModelValue={setCountupValue}
            onUpdateIsCountdownStart={setIsCountupRunning}
            onCountdownStep={(current) => console.log('Step:', current)}
            onCountdownEnd={() => {
              console.log('計時結束!');
              // alert('計時結束!');
            }}
          />
        </div>
        <p style={{ textAlign: 'center', color: '#666' }}>
          當前值: {countupValue} | 運行中: {isCountupRunning ? '是' : '否'}
        </p>
      </div>

      <div>
        <h2>自訂樣式</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Countdown
            countdownType="down"
            initialSeconds={5}
            endSecond={0}
            width={150}
            height={80}
            bgColor="#4caf50"
            color="#fff"
          />
          <Countdown
            countdownType="down"
            initialSeconds={5}
            endSecond={0}
            width={120}
            height={70}
            bgColor="#ff9800"
            color="#fff"
          />
          <Countdown
            countdownType="down"
            initialSeconds={5}
            endSecond={0}
            width={100}
            height={60}
            bgColor="#9c27b0"
            color="#fff"
          />
        </div>
      </div>
    </div>
  );
}
