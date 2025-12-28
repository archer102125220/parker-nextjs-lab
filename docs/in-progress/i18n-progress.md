# i18n 語系包完善進度表

> 追蹤國際化翻譯的實施進度

## 概覽

| 項目 | 狀態 | 備註 |
|------|------|------|
| 語系包結構建立 | ✅ 完成 | `pages`, `common` 區塊 |
| 首頁 (`/`) | ✅ 完成 | Hero, sections, links |
| 組件庫 (`/components`) | ✅ 完成 | categories, items, stats |
| CSS 繪圖 (`/css-drawing`) | ✅ 完成 | hero, demos |
| Firebase (`/firebase`) | ✅ 完成 | hero, features, demos |
| Directive Effects | ✅ 完成 | hero, note, demos |
| SSE Test | ✅ 完成 | metadata |
| Socket Test | ✅ 完成 | metadata |
| About 頁面 | ⬜ 待處理 | |

## 組件頁面詳細進度

### 表單元件
- [ ] Selector (`/components/selector`)
- [ ] PhoneInput (`/components/phone-input`)
- [ ] ImageUpload (`/components/image-upload-test`)
- [ ] SwitchButton (`/components/switch-button`)

### 展示元件
- [ ] Banner (`/components/banner-demo`)
- [ ] QRCode (`/components/qr-code-test`)
- [ ] Countdown (`/components/countdown-test`)
- [ ] SkeletonLoader (`/components/skeleton-loader`)

### 導航元件
- [ ] Tabs (`/components/tab-test`)
- [ ] SlideInPanel (`/components/slide-in-panel`)
- [ ] Dialog (`/components/dialog`)
- [ ] Drawer (`/components/drawer`)
- [ ] GoTop (`/components/go-top`)

### 滾動元件
- [ ] ScrollFetch (`/components/scroll-fetch`)
- [ ] VirtualScroller (`/components/virtual-scroller`)
- [ ] Swiper (`/components/swiper-test`)
- [ ] SwiperJS (`/components/swiper-js`)

### 富媒體元件
- [ ] YouTube (`/components/youtube-test`)
- [ ] WangEditor (`/components/wang-editor-test`)
- [ ] EnterLabel (`/components/enter-label`)

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
    "cssDrawing": { ... }
  },
  "common": {                 // 通用文字
    "viewDemo": "...",
    "loading": "..."
  }
}
```

## 更新日誌

- **2025-12-28**: 修正 i18n 語系切換問題，所有頁面添加 `setRequestLocale(locale)`
- **2025-12-27**: 建立語系包結構和進度表
