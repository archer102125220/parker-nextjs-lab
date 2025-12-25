'use client';

import { useState } from 'react';
import SlideInPanel from '@/components/SlideInPanel';
import style from '@/app/[locale]/components/slide-in-panel/page.module.scss';

export default function SlideInPanelTest() {
  const [message, setMessage] = useState<{
    text: string;
    timestamp: number;
  } | null>(null);

  const addMessage = (msg: string) => {
    setMessage({ text: msg, timestamp: Date.now() });
  };

  return (
    <>
      <div className={style['slide_in_panel_test_page-section']}>
        <h2>添加通知</h2>
        <div className={style['slide_in_panel_test_page-button_group']}>
          <button
            onClick={() => addMessage('✅ 操作成功!')}
            className={`${style['slide_in_panel_test_page-button']} ${style['slide_in_panel_test_page-button--success']}`}
          >
            成功訊息
          </button>
          <button
            onClick={() => addMessage('❌ 發生錯誤!')}
            className={`${style['slide_in_panel_test_page-button']} ${style['slide_in_panel_test_page-button--error']}`}
          >
            錯誤訊息
          </button>
          <button
            onClick={() => addMessage('ℹ️ 這是一則資訊')}
            className={`${style['slide_in_panel_test_page-button']} ${style['slide_in_panel_test_page-button--info']}`}
          >
            資訊訊息
          </button>
          <button
            onClick={() => addMessage('⚠️ 請注意!')}
            className={`${style['slide_in_panel_test_page-button']} ${style['slide_in_panel_test_page-button--warning']}`}
          >
            警告訊息
          </button>
        </div>
      </div>

      <SlideInPanel value={message?.text} timeout={3000} maxRow={5} />
    </>
  );
}
