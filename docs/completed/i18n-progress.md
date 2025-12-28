# i18n 語系包完善進度表

> 追蹤國際化翻譯的實施進度

## 概覽

| 項目 | 狀態 | 備註 |
|------|------|------|
| 語系包結構建立 | ✅ 完成 | `pages`, `common`, `componentPages` 區塊 |
| 首頁 (`/`) | ✅ 完成 | Hero, sections, links |
| 組件庫 (`/components`) | ✅ 完成 | categories, items, stats |
| CSS 繪圖 (`/css-drawing`) | ✅ 完成 | hero, demos |
| Firebase (`/firebase`) | ✅ 完成 | hero, features, demos |
| Directive Effects | ✅ 完成 | hero, note, demos |
| SSE Test | ✅ 完成 | metadata |
| Socket Test | ✅ 完成 | metadata |
| About 頁面 | ✅ 完成 | metadata, error message |
| 全部組件子頁面 | ✅ 完成 | 20 頁已完成 |

## 組件頁面詳細進度

### 表單元件
- [x] Selector (`/components/selector`)
- [x] PhoneInput (`/components/phone-input`)
- [x] ImageUpload (`/components/image-upload-test`)
- [x] SwitchButton (`/components/switch-button`)

### 展示元件
- [x] Banner (`/components/banner-demo`)
- [x] QRCode (`/components/qr-code-test`)
- [x] Countdown (`/components/countdown-test`)
- [x] SkeletonLoader (`/components/skeleton-loader`)

### 導航元件
- [x] Tabs (`/components/tab-test`)
- [x] SlideInPanel (`/components/slide-in-panel`)
- [x] Dialog (`/components/dialog`)
- [x] Drawer (`/components/drawer`)
- [x] GoTop (`/components/go-top`)

### 滾動元件
- [x] ScrollFetch (`/components/scroll-fetch`)
- [x] VirtualScroller (`/components/virtual-scroller`)
- [x] Swiper (`/components/swiper-test`)
- [x] SwiperJS (`/components/swiper-js`)

### 富媒體元件
- [x] YouTube (`/components/youtube-test`)
- [x] WangEditor (`/components/wang-editor-test`)
- [x] EnterLabel (`/components/enter-label`)

## 使用方式

### Server Component
```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.selector');
  return <h1>{t('title')}</h1>;
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

## 語系包結構

```
i18n/locales/
├── zh-tw.json  # 繁體中文
└── en.json     # 英文

結構:
{
  "metadata": { ... },
  "components": { ... },      // MUI 組件
  "pages": {                  // 頁面翻譯
    "home": { ... },
    "components": { ... },
    "componentPages": {       // 組件子頁面
      "selector": { "title": "...", "description": "..." },
      ...
    },
    "cssDrawing": { ... }
  },
  "common": { ... }           // 通用文字
}
```

## 更新日誌

- **2025-12-28**: 完成全部 20 個組件子頁面 i18n (setRequestLocale + 翻譯)
- **2025-12-28**: 完成 About 頁面 i18n (metadata, error message)
- **2025-12-28**: 修正 i18n 語系切換問題，所有頁面添加 `setRequestLocale(locale)`
- **2025-12-27**: 建立語系包結構和進度表
