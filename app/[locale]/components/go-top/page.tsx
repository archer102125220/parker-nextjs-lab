'use client';

import GoTop from '@/components/GoTop';
import '../page.scss';
import style from './page.module.scss';

export default function GoTopTestPage() {
  const content = Array.from(
    { length: 50 },
    (_, i) =>
      `段落 ${i + 1}: 這是一段測試文字,用來產生足夠的內容讓頁面可以滾動。`
  );

  return (
    <div className={style.go_top_test_page}>
      <h1>GoTop 回到頂部測試</h1>
      <p className={style['go_top_test_page-description']}>
        向下滾動頁面,當滾動超過 100px 時會出現回到頂部按鈕
      </p>

      <div className={style['go_top_test_page-section']}>
        <h2>功能說明</h2>
        <ul>
          <li>✅ 自動偵測滾動位置</li>
          <li>✅ 平滑滾動回到頂部</li>
          <li>✅ 可自訂顯示/隱藏閾值</li>
          <li>✅ 支援自訂按鈕樣式</li>
        </ul>
      </div>

      <div className={style['go_top_test_page-section']}>
        <h2>測試內容</h2>
        <p>以下是大量文字內容,用於測試滾動功能:</p>
      </div>

      {content.map((text, index) => (
        <p key={index} className={style['go_top_test_page-paragraph']}>
          {text}
        </p>
      ))}

      <div className={style['go_top_test_page-footer']}>
        <h3>頁面底部</h3>
        <p>您已經滾動到頁面底部,點擊右下角的按鈕可以快速回到頂部!</p>
      </div>

      {/* GoTop Component */}
      <GoTop
        limit={100}
        position="fixed"
        right="25px"
        showBottom="25px"
        heddinBottom="-50px"
      />
    </div>
  );
}
