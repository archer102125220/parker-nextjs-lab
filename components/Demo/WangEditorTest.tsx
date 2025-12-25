'use client';

import { useState } from 'react';
import WangEditor from '@/components/WangEditor';
import style from '@/app/[locale]/components/wang-editor-test/page.module.scss';

export default function WangEditorTest() {
  const [content, setContent] = useState('<p>請在此輸入內容...</p>');
  const [readOnlyContent] = useState(
    '<h2>唯讀模式</h2><p>這是唯讀的內容,無法編輯。</p>'
  );

  return (
    <>
      <div className={style['wang_editor_test_page-section']}>
        <h2>基本用法</h2>
        <WangEditor value={content} onChange={setContent} height={400} />
        <div className={style['wang_editor_test_page-output']}>
          <h3>HTML 輸出:</h3>
          <pre className={style['wang_editor_test_page-code']}>{content}</pre>
        </div>
      </div>

      <div className={style['wang_editor_test_page-section']}>
        <h2>唯讀模式</h2>
        <WangEditor value={readOnlyContent} readOnly={true} height={200} />
      </div>

      <div>
        <h2>自訂高度</h2>
        <WangEditor placeholder="輸入簡短內容..." height={200} />
      </div>
    </>
  );
}
