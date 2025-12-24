'use client';

import { useState } from 'react';
import Selector from '@/components/Selector';
import style from './page.module.scss';

export default function SelectorPage() {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedObject, setSelectedObject] = useState<
    { code: string; name: string } | undefined
  >(undefined);

  const options = [
    { label: '選項 1', value: '1' },
    { label: '選項 2', value: '2' },
    { label: '選項 3', value: '3' },
    { label: '選項 4', value: '4' },
    { label: '選項 5', value: '5' }
  ];

  const countries = [
    { code: 'TW', name: '台灣' },
    { code: 'US', name: '美國' },
    { code: 'JP', name: '日本' },
    { code: 'KR', name: '韓國' },
    { code: 'CN', name: '中國' }
  ];

  return (
    <div className={style.selector_test_page}>
      <h1>Selector 下拉選單組件測試</h1>
      <p className={style['selector_test_page-description']}>
        展示下拉選單的各種用法和自訂功能
      </p>

      <div className={style['selector_test_page-section']}>
        <h2>基本用法</h2>
        <Selector
          value={selectedValue}
          onChange={(value) => setSelectedValue(String(value))}
          optionList={options}
          valueKey="value"
          displayKey="label"
        />
        <p className={style['selector_test_page-section-note']}>
          選中的值: {selectedValue || '(未選擇)'}
        </p>
      </div>

      <div className={style['selector_test_page-section']}>
        <h2>自訂 valueKey 和 displayKey</h2>
        <Selector
          value={selectedObject?.code}
          onChange={(value) => {
            const country = countries.find((c) => c.code === value);
            setSelectedObject(country);
          }}
          optionList={countries}
          valueKey="code"
          displayKey="name"
          hasShadow={true}
          hasTransition={true}
        />
        <p className={style['selector_test_page-section-note']}>
          選中的國家: {selectedObject?.name || '(未選擇)'}
        </p>
      </div>

      <div className={style['selector_test_page-section']}>
        <h2>空選項列表</h2>
        <Selector optionList={[]} emptyText="沒有可用選項" />
      </div>

      <div>
        <h2>自訂寬度</h2>
        <Selector
          optionList={options}
          valueKey="value"
          displayKey="label"
          optionListWidth="400px"
        />
      </div>
    </div>
  );
}
