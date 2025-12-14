'use client';

import { useState } from 'react';
import useThrottle from '@/hooks/useThrottle';
import useLocalStorage from '@/hooks/useLocalStorage';
import useSessionStorage from '@/hooks/useSessionStorage';
import useMediaQuery from '@/hooks/useMediaQuery';

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

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Hooks 測試頁面</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示各種自訂 Hooks 的功能
      </p>

      {/* useThrottle */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>useThrottle Hook</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          節流函數調用,在指定時間內只執行一次
        </p>
        <div
          onScroll={() => {
            setScrollCount(prev => prev + 1);
            handleScroll();
          }}
          style={{
            height: '200px',
            overflow: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
            backgroundColor: 'white'
          }}
        >
          <div style={{ height: '600px' }}>
            <p>滾動這個區域來測試節流效果</p>
            <p>正常滾動次數: {scrollCount}</p>
            <p>節流後次數 (500ms): {throttledScrollCount}</p>
          </div>
        </div>
      </div>

      {/* useLocalStorage */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>useLocalStorage Hook</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          同步 localStorage 和 React state (打開多個 tab 測試跨 tab 同步)
        </p>
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
            fontSize: '14px'
          }}
        />
        <p style={{ marginTop: '10px', color: '#666' }}>
          當前值: {localName}
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>
          💡 提示: 打開另一個 tab 修改值,會自動同步
        </p>
      </div>

      {/* useSessionStorage */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>useSessionStorage Hook</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          同步 sessionStorage 和 React state (刷新頁面會保留)
        </p>
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
            增加計數
          </button>
          <span>計數: {sessionData.count}</span>
        </div>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
          💡 提示: 刷新頁面後計數會保留
        </p>
      </div>

      {/* useMediaQuery */}
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>useMediaQuery Hook</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          監聽 media query 變化,用於響應式設計
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            padding: '10px',
            backgroundColor: isMobile ? '#4caf50' : '#e0e0e0',
            color: isMobile ? 'white' : 'black',
            borderRadius: '4px'
          }}>
            📱 Mobile (≤768px): {isMobile ? '是' : '否'}
          </div>
          <div style={{
            padding: '10px',
            backgroundColor: isTablet ? '#2196f3' : '#e0e0e0',
            color: isTablet ? 'white' : 'black',
            borderRadius: '4px'
          }}>
            📱 Tablet (769px-1024px): {isTablet ? '是' : '否'}
          </div>
          <div style={{
            padding: '10px',
            backgroundColor: isDarkMode ? '#424242' : '#e0e0e0',
            color: isDarkMode ? 'white' : 'black',
            borderRadius: '4px'
          }}>
            🌙 Dark Mode: {isDarkMode ? '是' : '否'}
          </div>
        </div>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
          💡 提示: 調整瀏覽器視窗大小或切換系統主題來測試
        </p>
      </div>
    </div>
  );
}
