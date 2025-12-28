# i18n 國際化實施計畫

> 本文檔描述專案的國際化翻譯實施方案

## 背景

目前專案的 i18n 設定只包含：
- ✅ MUI 組件的基本翻譯
- ✅ Metadata 翻譯
- ❌ 頁面內容翻譯（大量硬編碼中文）

## 語系包結構

```
i18n/locales/
├── zh-tw.json  # 繁體中文
└── en.json     # 英文

結構:
{
  "metadata": { ... },        // SEO metadata
  "components": { ... },      // MUI 組件翻譯
  "pages": {                  // 頁面翻譯
    "home": { ... },
    "components": { ... },
    "cssDrawing": { ... }
  },
  "common": {                 // 通用文字
    "viewDemo": "...",
    "loading": "..."
  }
}
```

## 需要翻譯的頁面

| 頁面 | 路徑 | 優先級 |
|------|------|--------|
| 首頁 | `app/[locale]/page.tsx` | 高 |
| 組件庫 | `app/[locale]/components/page.tsx` | 高 |
| CSS 繪圖 | `app/[locale]/css-drawing/page.tsx` | 中 |
| Firebase | `app/[locale]/firebase/page.tsx` | 中 |
| SSE Test | `app/[locale]/server-sent-event-test/page.tsx` | 低 |
| Socket Test | `app/[locale]/socket-test/page.tsx` | 低 |
| 各組件頁 | `app/[locale]/components/*/page.tsx` | 低 |

## 使用方式

### Server Component
```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('pages.home');
  return <h1>{t('heroTitle')}</h1>;
}
```

### Client Component
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  return <button>{t('viewDemo')}</button>;
}
```

### 帶參數的翻譯
```tsx
// JSON: "subtitle": "{count} 個組件"
t('subtitle', { count: 20 }) // => "20 個組件"
```

## 實施步驟

1. ✅ 建立語系包結構 (`pages`, `common` 區塊)
2. ⬜ 整合首頁翻譯 (`app/[locale]/page.tsx`)
3. ⬜ 整合組件庫翻譯 (`app/[locale]/components/page.tsx`)
4. ⬜ 整合其他頁面

## 驗證方式

1. 切換到 `/en` 測試英文顯示
2. 切換回 `/zh-tw` 確認中文正常
3. 檢查 console 無缺失翻譯警告

## 相關文件

- [進度追蹤](./i18n-progress.md)
- [i18n 設定](../../i18n/routing.ts)
- [中文語系包](../../i18n/locales/zh-tw.json)
- [英文語系包](../../i18n/locales/en.json)
