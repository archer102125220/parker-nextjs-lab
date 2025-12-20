'use client';

import { useState } from 'react';
import Countdown from '@/components/Countdown';

export default function CountdownTestPage() {
  // Test configuration
  const [testSeconds, setTestSeconds] = useState(20);
  const [testInput, setTestInput] = useState('20');
  const [testType, setTestType] = useState<'up' | 'down'>('down');
  const [testRunning, setTestRunning] = useState(false);
  const [testValue, setTestValue] = useState(20);

  // Preset examples
  const [countdown10, setCountdown10] = useState(10);
  const [countdown10Running, setCountdown10Running] = useState(true);
  const [countup10, setCountup10] = useState(0);
  const [countup10Running, setCountup10Running] = useState(true);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const seconds = parseInt(testInput);
    if (isNaN(seconds) || seconds < 0) {
      alert('請輸入有效的秒數');
      return;
    }
    setTestSeconds(seconds);
    setTestValue(testType === 'down' ? seconds : 0);
    setTestRunning(true);
  };

  const handleRestart = () => {
    setCountdown10Running(false);
    setCountup10Running(false);
    setTimeout(() => {
      setCountdown10(10);
      setCountup10(0);
      setCountdown10Running(true);
      setCountup10Running(true);
    }, 100);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Countdown 倒數計時組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示翻牌動畫效果的倒數/正數計時器（基於 Nuxt 版本實現）
      </p>

      {/* Configuration Form */}
      <div style={{ 
        marginBottom: '40px', 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h2 style={{ marginBottom: '20px' }}>測試配置</h2>
        <form onSubmit={handleTestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              測試秒數：
            </label>
            <input
              type="number"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              min="0"
              style={{
                padding: '8px 12px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              倒數類型：
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="up"
                  checked={testType === 'up'}
                  onChange={(e) => setTestType(e.target.value as 'up' | 'down')}
                />
                向上翻
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="down"
                  checked={testType === 'down'}
                  onChange={(e) => setTestType(e.target.value as 'up' | 'down')}
                />
                向下翻
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                fontSize: '16px',
                background: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              更新
            </button>
          </div>
        </form>

        {testRunning && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Countdown
              countdownType={testType}
              initialSeconds={testType === 'down' ? testSeconds : 0}
              endSecond={testType === 'down' ? 0 : testSeconds}
              isCountdownStart={testRunning}
              width={250}
              height={150}
              bgColor="#667eea"
              color="#fff"
              onUpdateModelValue={setTestValue}
              onUpdateIsCountdownStart={setTestRunning}
              onCountdownEnd={() => {
                console.log('測試倒數結束!');
                setTestRunning(false);
              }}
            />
            <p style={{ marginTop: '10px', color: '#666' }}>
              當前值: {testValue} | 運行中: {testRunning ? '是' : '否'}
            </p>
          </div>
        )}
      </div>

      {/* Preset Examples */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>預設範例</h2>
          <button
            onClick={handleRestart}
            style={{
              padding: '8px 16px',
              background: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            重新開始
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Countdown Example */}
          <div>
            <h3 style={{ marginBottom: '15px' }}>倒數計時 (10 → 0)</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <Countdown
                countdownType="down"
                initialSeconds={10}
                endSecond={0}
                isCountdownStart={countdown10Running}
                width={200}
                height={100}
                bgColor="#667eea"
                color="#fff"
                onUpdateModelValue={setCountdown10}
                onUpdateIsCountdownStart={setCountdown10Running}
                onCountdownEnd={() => console.log('倒數結束!')}
              />
            </div>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
              當前: {countdown10} | {countdown10Running ? '運行中' : '已停止'}
            </p>
          </div>

          {/* Countup Example */}
          <div>
            <h3 style={{ marginBottom: '15px' }}>正數計時 (0 → 10)</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <Countdown
                countdownType="up"
                initialSeconds={0}
                endSecond={10}
                isCountdownStart={countup10Running}
                width={200}
                height={100}
                bgColor="#e91e63"
                color="#fff"
                onUpdateModelValue={setCountup10}
                onUpdateIsCountdownStart={setCountup10Running}
                onCountdownEnd={() => console.log('計時結束!')}
              />
            </div>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
              當前: {countup10} | {countup10Running ? '運行中' : '已停止'}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>自訂樣式範例</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Countdown
              countdownType="down"
              initialSeconds={5}
              endSecond={0}
              width={150}
              height={80}
              bgColor="#4caf50"
              color="#fff"
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>綠色 150x80</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Countdown
              countdownType="down"
              initialSeconds={5}
              endSecond={0}
              width={120}
              height={70}
              bgColor="#ff9800"
              color="#fff"
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>橙色 120x70</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Countdown
              countdownType="down"
              initialSeconds={5}
              endSecond={0}
              width={100}
              height={60}
              bgColor="#9c27b0"
              color="#fff"
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>紫色 100x60</p>
          </div>
        </div>
      </div>
    </div>
  );
}
