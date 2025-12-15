'use client';

import { useState } from 'react';
import useThrottle from '@/hooks/useThrottle';
import useLocalStorage from '@/hooks/useLocalStorage';
import useSessionStorage from '@/hooks/useSessionStorage';
import useMediaQuery from '@/hooks/useMediaQuery';
import useWindowSize from '@/hooks/useWindowSize';
import useEventListener from '@/hooks/useEventListener';
import useClickOutside from '@/hooks/useClickOutside';
import useKeyPress from '@/hooks/useKeyPress';
import useTimeout from '@/hooks/useTimeout';
import useInterval from '@/hooks/useInterval';

export default function HooksTestPage() {
  // useThrottle demo
  const [scrollCount, setScrollCount] = useState(0);
  const [throttledScrollCount, setThrottledScrollCount] = useState(0);

  const handleScroll = useThrottle(() => {
    setThrottledScrollCount(prev => prev + 1);
  }, 500);

  // useLocalStorage demo
  const [localName, setLocalName] = useLocalStorage('userName', 'Guest');
  
  // useSessionStorage demo
  const [sessionData, setSessionData] = useSessionStorage('sessionData', { count: 0 });

  // useMediaQuery demo
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // useWindowSize demo
  const { width, height } = useWindowSize();

  // useEventListener demo
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEventListener('mousemove', (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  });

  // useClickOutside demo
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  });

  // useKeyPress demo
  const isEscapePressed = useKeyPress('Escape');
  const isEnterPressed = useKeyPress('Enter', () => {
    console.log('Enter key pressed!');
  });

  // useTimeout demo
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [timeoutDelay, setTimeoutDelay] = useState<number | null>(null);
  
  useTimeout(() => {
    setShowTimeoutMessage(true);
    setTimeoutDelay(null);
  }, timeoutDelay);

  // useInterval demo
  const [counter, setCounter] = useState(0);
  const [isIntervalRunning, setIsIntervalRunning] = useState(false);
  
  useInterval(() => {
    setCounter(c => c + 1);
  }, isIntervalRunning ? 1000 : null);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Hooks 測試頁面</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示各種自訂 Hooks 的功能
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
        
        {/* useWindowSize */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useWindowSize</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>即時追蹤視窗尺寸</p>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {width} x {height}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              調整視窗大小來測試
            </div>
          </div>
        </div>

        {/* useEventListener */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useEventListener</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>簡化事件監聽器管理</p>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>滑鼠位置:</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>
              X: {mousePosition.x}, Y: {mousePosition.y}
            </div>
          </div>
        </div>

        {/* useClickOutside */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useClickOutside</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>偵測點擊元素外部</p>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isDropdownOpen ? '關閉' : '開啟'} 下拉選單
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                style={{
                  position: 'absolute',
                  top: '45px',
                  left: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  minWidth: '200px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 10
                }}
              >
                <div style={{ padding: '8px', cursor: 'pointer' }}>選項 1</div>
                <div style={{ padding: '8px', cursor: 'pointer' }}>選項 2</div>
                <div style={{ padding: '8px', cursor: 'pointer' }}>選項 3</div>
              </div>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
            點擊外部會自動關閉
          </p>
        </div>

        {/* useKeyPress */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useKeyPress</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>監聽特定按鍵</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              padding: '10px',
              backgroundColor: isEscapePressed ? '#f44336' : 'white',
              color: isEscapePressed ? 'white' : 'black',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}>
              ESC: {isEscapePressed ? '按下' : '未按下'}
            </div>
            <div style={{
              padding: '10px',
              backgroundColor: isEnterPressed ? '#4caf50' : 'white',
              color: isEnterPressed ? 'white' : 'black',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}>
              Enter: {isEnterPressed ? '按下' : '未按下'}
            </div>
          </div>
        </div>

        {/* useTimeout */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useTimeout</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>延遲執行函數</p>
          <button
            onClick={() => {
              setShowTimeoutMessage(false);
              setTimeoutDelay(2000);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            啟動 2 秒倒數
          </button>
          {showTimeoutMessage && (
            <div style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', borderRadius: '4px' }}>
              ✅ 時間到了!
            </div>
          )}
        </div>

        {/* useInterval */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useInterval</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>定時執行函數</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <button
              onClick={() => setIsIntervalRunning(!isIntervalRunning)}
              style={{
                padding: '10px 20px',
                backgroundColor: isIntervalRunning ? '#f44336' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isIntervalRunning ? '暫停' : '開始'}
            </button>
            <button
              onClick={() => setCounter(0)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              重置
            </button>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>
            {counter}
          </div>
        </div>

        {/* useThrottle */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useThrottle</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>節流函數調用</p>
          <div
            onScroll={() => {
              setScrollCount(prev => prev + 1);
              handleScroll();
            }}
            style={{
              height: '150px',
              overflow: 'auto',
              border: '1px solid #ddd',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '4px'
            }}
          >
            <div style={{ height: '400px' }}>
              <p>滾動測試</p>
              <p>正常: {scrollCount}</p>
              <p>節流 (500ms): {throttledScrollCount}</p>
            </div>
          </div>
        </div>

        {/* useLocalStorage */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useLocalStorage</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>同步 localStorage</p>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="輸入名稱"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
            💡 打開另一個 tab 測試同步
          </p>
        </div>

        {/* useSessionStorage */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useSessionStorage</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>同步 sessionStorage</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setSessionData({ count: sessionData.count + 1 })}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              增加
            </button>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{sessionData.count}</span>
          </div>
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
            💡 刷新頁面會保留
          </p>
        </div>

        {/* useMediaQuery */}
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>useMediaQuery</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>監聽 media query</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              padding: '8px',
              backgroundColor: isMobile ? '#4caf50' : '#e0e0e0',
              color: isMobile ? 'white' : 'black',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              📱 Mobile: {isMobile ? '是' : '否'}
            </div>
            <div style={{
              padding: '8px',
              backgroundColor: isTablet ? '#2196f3' : '#e0e0e0',
              color: isTablet ? 'white' : 'black',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              📱 Tablet: {isTablet ? '是' : '否'}
            </div>
            <div style={{
              padding: '8px',
              backgroundColor: isDarkMode ? '#424242' : '#e0e0e0',
              color: isDarkMode ? 'white' : 'black',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              🌙 Dark: {isDarkMode ? '是' : '否'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
