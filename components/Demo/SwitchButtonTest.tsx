'use client';

import { useState } from 'react';
import SwitchButton from '@/components/SwitchButton';
import style from '@/app/[locale]/components/switch-button/page.module.scss';

export default function SwitchButtonTest() {
  const [isOn, setIsOn] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [customSwitch, setCustomSwitch] = useState(false);

  return (
    <>
      <h1>SwitchButton 開關組件測試</h1>
      <p className={style['switch_button_test_page-description']}>
        展示開關按鈕的各種用法和狀態
      </p>

      <div className={style['switch_button_test_page-section']}>
        <h2>基本用法</h2>
        <div className={style['switch_button_test_page-row']}>
          <SwitchButton value={isOn} onChange={setIsOn} />
          <span>狀態: {isOn ? '開啟' : '關閉'}</span>
        </div>
      </div>

      <div className={style['switch_button_test_page-section']}>
        <h2>停用狀態</h2>
        <div className={style['switch_button_test_page-row_group']}>
          <div>
            <SwitchButton value={true} disabled={true} />
            <p className={style['switch_button_test_page-item_label']}>
              開啟 + 停用
            </p>
          </div>
          <div>
            <SwitchButton value={false} disabled={true} />
            <p className={style['switch_button_test_page-item_label']}>
              關閉 + 停用
            </p>
          </div>
        </div>
      </div>

      <div className={style['switch_button_test_page-section']}>
        <h2>自訂顏色</h2>
        <div className={style['switch_button_test_page-row_group']}>
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
        <div className={style['switch_button_test_page-settings_box']}>
          <div className={style['switch_button_test_page-settings_row']}>
            <span>啟用通知</span>
            <SwitchButton value={isEnabled} onChange={setIsEnabled} />
          </div>
          <div className={style['switch_button_test_page-settings_row']}>
            <span>深色模式</span>
            <SwitchButton value={isOn} onChange={setIsOn} />
          </div>
        </div>
      </div>
    </>
  );
}
