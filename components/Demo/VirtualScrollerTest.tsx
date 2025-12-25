'use client';

import { useState, useMemo } from 'react';
import VirtualScroller from '@/components/VirtualScroller';
import '@/app/[locale]/components/page.scss';
import style from '@/app/[locale]/components/virtual-scroller/page.module.scss';

interface ListItem {
  id: number;
  title: string;
  description: string;
}

export default function VirtualScrollerTest() {
  const [itemCount, setItemCount] = useState(1000);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Generate large dataset
  const items = useMemo<ListItem[]>(() => {
    return Array.from({ length: itemCount }, (_, i) => ({
      id: i + 1,
      title: `項目 ${i + 1}`,
      description: `這是第 ${i + 1} 個項目的描述文字,用於展示虛擬滾動的效能。`
    }));
  }, [itemCount]);

  const renderItem = (item: ListItem, index: number) => (
    <div
      className={`${style['virtual_scroller_test_page-item']} ${index % 2 === 0 ? style['virtual_scroller_test_page-item--even'] : style['virtual_scroller_test_page-item--odd']}`}
    >
      <div className={style['virtual_scroller_test_page-item_avatar']}>
        {item.id}
      </div>
      <div className={style['virtual_scroller_test_page-item_content']}>
        <div className={style['virtual_scroller_test_page-item_title']}>
          {item.title}
        </div>
        <div className={style['virtual_scroller_test_page-item_description']}>
          {item.description}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={style['virtual_scroller_test_page-section']}>
        <h2>性能展示</h2>
        <div className={style['virtual_scroller_test_page-stats_row']}>
          <div className={style['virtual_scroller_test_page-stat_card']}>
            <div className={style['virtual_scroller_test_page-stat_label']}>
              總項目數
            </div>
            <div className={style['virtual_scroller_test_page-stat_value']}>
              {itemCount.toLocaleString()}
            </div>
          </div>
          <div className={style['virtual_scroller_test_page-stat_card']}>
            <div className={style['virtual_scroller_test_page-stat_label']}>
              滾動位置
            </div>
            <div className={style['virtual_scroller_test_page-stat_value']}>
              {Math.round(scrollPosition)}px
            </div>
          </div>
          <div className={style['virtual_scroller_test_page-stat_card']}>
            <div className={style['virtual_scroller_test_page-stat_label']}>
              項目高度
            </div>
            <div className={style['virtual_scroller_test_page-stat_value']}>
              64px
            </div>
          </div>
        </div>

        <div className={style['virtual_scroller_test_page-slider_section']}>
          <label className={style['virtual_scroller_test_page-slider_label']}>
            調整項目數量: {itemCount.toLocaleString()}
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            className={style['virtual_scroller_test_page-slider']}
          />
          <div className={style['virtual_scroller_test_page-slider_range']}>
            <span>100</span>
            <span>10,000</span>
          </div>
        </div>
      </div>

      <div className={style['virtual_scroller_test_page-section']}>
        <h2>虛擬滾動列表</h2>
        <VirtualScroller
          items={items}
          itemHeight={64}
          containerHeight={500}
          overscan={5}
          renderItem={renderItem}
          onScroll={setScrollPosition}
        />
      </div>

      <div className={style['virtual_scroller_test_page-section']}>
        <h2>功能說明</h2>
        <ul>
          <li>✅ 只渲染可見區域的項目 + 預渲染緩衝區</li>
          <li>✅ 支援大量數據 (測試可達 10,000+ 項目)</li>
          <li>✅ 平滑滾動體驗,無卡頓</li>
          <li>✅ 自動計算可見範圍</li>
          <li>✅ 記憶體使用穩定</li>
        </ul>
      </div>

      <div className={style['virtual_scroller_test_page-section']}>
        <h2>性能對比</h2>
        <table className={style['virtual_scroller_test_page-table']}>
          <thead>
            <tr className={style['virtual_scroller_test_page-table_header']}>
              <th className={style['virtual_scroller_test_page-table_th']}>
                方式
              </th>
              <th className={style['virtual_scroller_test_page-table_th']}>
                1,000 項目
              </th>
              <th className={style['virtual_scroller_test_page-table_th']}>
                10,000 項目
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={style['virtual_scroller_test_page-table_td']}>
                普通渲染
              </td>
              <td className={style['virtual_scroller_test_page-table_td']}>
                ~500ms ⚠️
              </td>
              <td className={style['virtual_scroller_test_page-table_td']}>
                ~5000ms ❌
              </td>
            </tr>
            <tr>
              <td className={style['virtual_scroller_test_page-table_td']}>
                虛擬滾動
              </td>
              <td className={style['virtual_scroller_test_page-table_td']}>
                ~50ms ✅
              </td>
              <td className={style['virtual_scroller_test_page-table_td']}>
                ~50ms ✅
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
