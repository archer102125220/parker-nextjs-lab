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
import styles from '@/app/[locale]/hooks-test/page.module.scss';

export default function DemoHooks() {
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
    <div className={styles['hooks_test_page-grid']}>
      
      {/* useWindowSize */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useWindowSize</h2>
        <p className={styles['hooks_test_page-section-description']}>即時追蹤視窗尺寸</p>
        <div className={styles['hooks_test_page-section-content_box']}>
          <div className={styles['hooks_test_page-section-value_display']}>
            {width} x {height}
          </div>
          <div className={styles['hooks_test_page-section-value_meta']}>
            調整視窗大小來測試
          </div>
        </div>
      </div>

      {/* useEventListener */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useEventListener</h2>
        <p className={styles['hooks_test_page-section-description']}>簡化事件監聽器管理</p>
        <div className={styles['hooks_test_page-section-content_box']}>
          <div className={styles['hooks_test_page-section-value_meta']}>滑鼠位置:</div>
          <div className={styles['hooks_test_page-section-value_display']}>
            X: {mousePosition.x}, Y: {mousePosition.y}
          </div>
        </div>
      </div>

      {/* useClickOutside */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useClickOutside</h2>
        <p className={styles['hooks_test_page-section-description']}>偵測點擊元素外部</p>
        <div className={styles['hooks_test_page-dropdown']}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={styles['hooks_test_page-button']}
          >
            {isDropdownOpen ? '關閉' : '開啟'} 下拉選單
          </button>
          {isDropdownOpen && (
            <div ref={dropdownRef} className={styles['hooks_test_page-dropdown-menu']}>
              <div className={styles['hooks_test_page-dropdown-menu-item']}>選項 1</div>
              <div className={styles['hooks_test_page-dropdown-menu-item']}>選項 2</div>
              <div className={styles['hooks_test_page-dropdown-menu-item']}>選項 3</div>
            </div>
          )}
        </div>
        <p className={styles['hooks_test_page-section-hint']}>
          點擊外部會自動關閉
        </p>
      </div>

      {/* useKeyPress */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useKeyPress</h2>
        <p className={styles['hooks_test_page-section-description']}>監聽特定按鍵</p>
        <div className={styles['hooks_test_page-section-flex_column']}>
          <div 
            className={styles['hooks_test_page-key_status']}
            data-pressed={isEscapePressed ? 'true' : 'false'}
            data-key="escape"
          >
            ESC: {isEscapePressed ? '按下' : '未按下'}
          </div>
          <div 
            className={styles['hooks_test_page-key_status']}
            data-pressed={isEnterPressed ? 'true' : 'false'}
            data-key="enter"
          >
            Enter: {isEnterPressed ? '按下' : '未按下'}
          </div>
        </div>
      </div>

      {/* useTimeout */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useTimeout</h2>
        <p className={styles['hooks_test_page-section-description']}>延遲執行函數</p>
        <button
          onClick={() => {
            setShowTimeoutMessage(false);
            setTimeoutDelay(2000);
          }}
          className={styles['hooks_test_page-button']}
        >
          啟動 2 秒倒數
        </button>
        {showTimeoutMessage && (
          <div className={styles['hooks_test_page-section-success_message']}>
            ✅ 時間到了!
          </div>
        )}
      </div>

      {/* useInterval */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useInterval</h2>
        <p className={styles['hooks_test_page-section-description']}>定時執行函數</p>
        <div className={styles['hooks_test_page-section-flex_row']}>
          <button
            onClick={() => setIsIntervalRunning(!isIntervalRunning)}
            className={isIntervalRunning ? styles['hooks_test_page-button_danger'] : styles['hooks_test_page-button_success']}
          >
            {isIntervalRunning ? '暫停' : '開始'}
          </button>
          <button
            onClick={() => setCounter(0)}
            className={styles['hooks_test_page-button_neutral']}
          >
            重置
          </button>
        </div>
        <div className={styles['hooks_test_page-section-counter_display']}>
          {counter}
        </div>
      </div>

      {/* useThrottle */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useThrottle</h2>
        <p className={styles['hooks_test_page-section-description']}>節流函數調用</p>
        <div
          onScroll={() => {
            setScrollCount(prev => prev + 1);
            handleScroll();
          }}
          className={styles['hooks_test_page-scroll_test']}
        >
          <div className={styles['hooks_test_page-scroll_test-content']}>
            <p>滾動測試</p>
            <p>正常: {scrollCount}</p>
            <p>節流 (500ms): {throttledScrollCount}</p>
          </div>
        </div>
      </div>

      {/* useLocalStorage */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useLocalStorage</h2>
        <p className={styles['hooks_test_page-section-description']}>同步 localStorage</p>
        <input
          type="text"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          placeholder="輸入名稱"
          className={styles['hooks_test_page-section-input_field']}
        />
        <p className={styles['hooks_test_page-section-hint']}>
          💡 打開另一個 tab 測試同步
        </p>
      </div>

      {/* useSessionStorage */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useSessionStorage</h2>
        <p className={styles['hooks_test_page-section-description']}>同步 sessionStorage</p>
        <div className={styles['hooks_test_page-section-flex_row']}>
          <button
            onClick={() => setSessionData({ count: sessionData.count + 1 })}
            className={styles['hooks_test_page-button']}
          >
            增加
          </button>
          <span className={styles['hooks_test_page-section-value_display']}>{sessionData.count}</span>
        </div>
        <p className={styles['hooks_test_page-section-hint']}>
          💡 刷新頁面會保留
        </p>
      </div>

      {/* useMediaQuery */}
      <div className={styles['hooks_test_page-section']}>
        <h2 className={styles['hooks_test_page-section-title']}>useMediaQuery</h2>
        <p className={styles['hooks_test_page-section-description']}>監聽 media query</p>
        <div className={styles['hooks_test_page-section-flex_column']}>
          <div 
            className={styles['hooks_test_page-media_badge']}
            data-active={isMobile ? 'true' : 'false'}
            data-type="mobile"
          >
            📱 Mobile: {isMobile ? '是' : '否'}
          </div>
          <div 
            className={styles['hooks_test_page-media_badge']}
            data-active={isTablet ? 'true' : 'false'}
            data-type="tablet"
          >
            📱 Tablet: {isTablet ? '是' : '否'}
          </div>
          <div 
            className={styles['hooks_test_page-media_badge']}
            data-active={isDarkMode ? 'true' : 'false'}
            data-type="dark"
          >
            🌙 Dark: {isDarkMode ? '是' : '否'}
          </div>
        </div>
      </div>

    </div>
  );
}
