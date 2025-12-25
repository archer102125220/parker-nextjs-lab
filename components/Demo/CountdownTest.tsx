'use client';

import { useState } from 'react';
import Countdown from '@/components/Countdown';
import style from '@/app/[locale]/components/countdown-test/page.module.scss';

export default function CountdownTest() {
  // Test configuration
  const [testSeconds, setTestSeconds] = useState(20);
  const [testInput, setTestInput] = useState('20');
  const [testType, setTestType] = useState<'up' | 'down'>('down');
  const [testRunning, setTestRunning] = useState(false);
  const [testValue, setTestValue] = useState(20);

  // Preset examples
  const [countdown10, setCountdown10] = useState(10);
  const [countdown10Running, setCountdown10Running] = useState(true);
  const [countup10, setCountup10] = useState(10); // Up mode also starts from 10
  const [countup10Running, setCountup10Running] = useState(true);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const seconds = parseInt(testInput);
    if (isNaN(seconds) || seconds < 0) {
      alert('請輸入有效的秒數');
      return;
    }
    setTestSeconds(seconds);
    setTestValue(seconds); // Both modes start from testSeconds
    setTestRunning(true);
  };

  const handleRestart = () => {
    // Force state change by toggling values
    setCountdown10Running(false);
    setCountup10Running(false);
    setCountdown10(0); // Change value first
    setCountup10(0);

    setTimeout(() => {
      setCountdown10(10);
      setCountup10(10);
      setCountdown10Running(true);
      setCountup10Running(true);
    }, 50);
  };

  return (
    <>
      <h1>Countdown 倒數計時組件測試</h1>
      <p className={style['countdown_test_page-description']}>
        展示翻牌動畫效果的倒數/正數計時器（基於 Nuxt 版本實現）
      </p>

      {/* Configuration Form */}
      <div className={style['countdown_test_page-config_box']}>
        <h2 className={style['countdown_test_page-config_title']}>測試配置</h2>
        <form
          onSubmit={handleTestSubmit}
          className={style['countdown_test_page-form']}
        >
          <div>
            <label className={style['countdown_test_page-label']}>
              測試秒數：
            </label>
            <input
              type="number"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              min="0"
              className={style['countdown_test_page-input']}
            />
          </div>

          <div>
            <label className={style['countdown_test_page-label']}>
              倒數類型：
            </label>
            <div className={style['countdown_test_page-radio_group']}>
              <label className={style['countdown_test_page-radio_label']}>
                <input
                  type="radio"
                  value="up"
                  checked={testType === 'up'}
                  onChange={(e) => setTestType(e.target.value as 'up' | 'down')}
                />
                向上翻
              </label>
              <label className={style['countdown_test_page-radio_label']}>
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
              className={style['countdown_test_page-submit_btn']}
            >
              更新
            </button>
          </div>
        </form>

        {testRunning && (
          <div className={style['countdown_test_page-preview']}>
            <Countdown
              countdownType={testType}
              initialSeconds={testSeconds}
              endSecond={0}
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
            <p className={style['countdown_test_page-preview-note']}>
              當前值: {testValue} | 運行中: {testRunning ? '是' : '否'}
            </p>
          </div>
        )}
      </div>

      {/* Preset Examples */}
      <div className={style['countdown_test_page-section']}>
        <div className={style['countdown_test_page-section_header']}>
          <h2>預設範例</h2>
          <button
            onClick={handleRestart}
            className={style['countdown_test_page-restart_btn']}
          >
            重新開始
          </button>
        </div>

        <div className={style['countdown_test_page-grid']}>
          {/* Countdown Example */}
          <div className={style['countdown_test_page-grid_item']}>
            <h3 className={style['countdown_test_page-grid_item-title']}>
              倒數計時 (10 → 0)
            </h3>
            <div className={style['countdown_test_page-grid_item-countdown']}>
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
            <p className={style['countdown_test_page-grid_item-note']}>
              當前: {countdown10} | {countdown10Running ? '運行中' : '已停止'}
            </p>
          </div>

          {/* Countup Example */}
          <div className={style['countdown_test_page-grid_item']}>
            <h3 className={style['countdown_test_page-grid_item-title']}>
              向上翻動畫 (10 → 0)
            </h3>
            <div className={style['countdown_test_page-grid_item-countdown']}>
              <Countdown
                countdownType="up"
                initialSeconds={10}
                endSecond={0}
                isCountdownStart={countup10Running}
                width={200}
                height={100}
                bgColor="#e91e63"
                color="#fff"
                onUpdateModelValue={setCountup10}
                onUpdateIsCountdownStart={setCountup10Running}
                onCountdownEnd={() => console.log('倒數結束!')}
              />
            </div>
            <p className={style['countdown_test_page-grid_item-note']}>
              當前: {countup10} | {countup10Running ? '運行中' : '已停止'}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <div>
        <h2 className={style['countdown_test_page-config_title']}>
          自訂樣式範例
        </h2>
        <div className={style['countdown_test_page-custom_group']}>
          <div className={style['countdown_test_page-custom_item']}>
            <Countdown
              countdownType="down"
              initialSeconds={5}
              endSecond={0}
              width={150}
              height={80}
              bgColor="#4caf50"
              color="#fff"
            />
            <p className={style['countdown_test_page-custom_item-label']}>
              綠色 150x80
            </p>
          </div>
          <div className={style['countdown_test_page-custom_item']}>
            <Countdown
              countdownType="down"
              initialSeconds={5}
              endSecond={0}
              width={120}
              height={70}
              bgColor="#ff9800"
              color="#fff"
            />
            <p className={style['countdown_test_page-custom_item-label']}>
              橙色 120x70
            </p>
          </div>
          <div className={style['countdown_test_page-custom_item']}>
            <Countdown
              countdownType="down"
              initialSeconds={5}
              endSecond={0}
              width={100}
              height={60}
              bgColor="#9c27b0"
              color="#fff"
            />
            <p className={style['countdown_test_page-custom_item-label']}>
              紫色 100x60
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
