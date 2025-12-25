# Parker Next.js Lab - 程式碼規範 (Agent Rules)

> 本文件定義了本專案必須遵守的程式碼規範。
> 這些規則是強制性的，應由 AI agent 和人類開發者共同遵守。

---

## 1. TypeScript 規範

### 1.1 型別安全 (強制)

- **永遠不要使用 `any` 型別** - 使用精確的型別定義、泛型或 `unknown` 替代
- **使用 `as unknown as TargetType`** 進行型別斷言（雙重斷言）
- **永遠不要使用 `as any`** - 始終使用 `as unknown as TargetType` 更安全的斷言
- **添加解釋性註解** - 使用型別斷言時解釋原因

```typescript
// ❌ 禁止
function processData(data: any) { }
const element = document.getElementById('id') as any;

// ✅ 正確
function processData<T extends { value: unknown }>(data: T) { }
const element = document.getElementById('id') as unknown as CustomElement;
```

---

## 2. CSS/SCSS 規範

### 2.1 CSS 屬性順序 (強制)

屬性必須按以下順序排列：
1. **定位** (position, top, left, z-index...)
2. **顯示與盒模型** (display, flex, width, margin, padding, border...)
3. **排版** (font, color, text-align...)
4. **視覺效果** (background, box-shadow, opacity...)
5. **動畫** (transition, animation...)
6. **其他** (cursor, content...)

```scss
.example {
  /* Positioning */
  position: relative;
  top: 0;
  z-index: 10;

  /* Display & Box Model */
  display: flex;
  width: 100%;
  padding: 20px;

  /* Typography */
  font-size: 16px;
  color: #333;

  /* Visual */
  background-color: #fff;

  /* Animation */
  transition: all 0.3s;

  /* Misc */
  cursor: pointer;
}
```

### 2.2 BEM 命名規範 (強制)

本專案使用**改良版 BEM** 命名規範：

| 元素類型 | 格式 | 範例 |
|----------|------|------|
| Block（區塊） | 單一名稱 | `.countdown` |
| Element（元素） | 連字號 `-` | `.countdown-title` |
| Sub-Element（子元素） | 連字號 `-` | `.countdown-title-icon` |
| 多詞名稱 | 底線 `_` | `.image_upload`, `.content_box` |
| 狀態/修飾符 | HTML 屬性 | `[css-is-active='true']` |

#### 關鍵規則：
- **每個元素都必須有自己的唯一 class** - 這對於以下兩個關鍵原因至關重要：
  1. **CSS 主要依賴 class name 進行樣式設定**（而非標籤選擇器）
  2. **快速定位 DOM 問題** - 在瀏覽器 DevTools 中立即識別哪個元素有問題
  - ❌ 不好：`.footer-links a { ... }`（針對標籤）
  - ✅ 好：`.footer-link { ... }`（唯一 class）
  - ✅ 例外：動態內容區域（如：`.content p { ... }`）
  - ✅ 例外：第三方內容（如：WangEditor 中的 `:global a { ... }`）
- **使用 `-`（連字號）** 連接區塊與元素：`.block-element`
- **使用 `_`（底線）** 用於單一區段內的多詞名稱：`.image_upload`, `.content_box`
- **永遠不要使用 `__`（雙底線）或 `--`（雙連字號）** - 使用 HTML 屬性替代
- **狀態用 HTML 屬性必須以 `css-` 開頭**：`css-is-active`, `css-is-dragging`
- **CSS 變數必須使用 `_`（底線）**：`--editor_height`, `--offset_y`

#### HTML 屬性使用規範：

**何時使用 HTML 屬性**：
1. **狀態**: `[css-is-active='true']`, `[css-is-disabled='true']`
2. **顏色變體**: `[css-color='red']`, `[css-color='blue']`
3. **大小變體**: `[css-size='small']`, `[css-size='large']`

**何時使用獨立 class**：
當 class name 本身具有**明確語義**時（不只描述外觀）：
```scss
// ✅ 語義化的 class name
.alert {
  &-success { }  // 成功提示（語義明確）
  &-error { }    // 錯誤提示（語義明確）
}
```

```scss
// ✅ 正確：使用 HTML 屬性
.image_upload {
  &-preview {        // .image_upload-preview
    &-img { }        // .image_upload-preview-img
  }
  &[css-is-dragging='true'] { }
}

.demo_box {
  background: #f5f5f5;
  
  &[css-color='red'] {
    background: #ffcdd2;
  }
}
```

```tsx
// ✅ 正確：單一 className + HTML 屬性
<Box className={style.demo_box} css-color="red">
  紅色示範
</Box>

// ❌ 錯誤：多個 className
<Box className={`${style.demo_box} ${style['demo_box--red']}`}>
```

```scss
// ❌ 錯誤
.image__upload { }   // 不要使用 __
.image-upload__preview { }  // 不要使用 __
.button--red { }     // 不要使用 --（應改用 HTML 屬性）
```

### 2.3 頁面根類別命名 (強制)

- **頁面根元素必須使用**：`[頁面名稱]_page` 格式
  - 範例：`.hooks_test_page`, `.socket_io_page`, `.web_rtc_page`
- **組件根元素必須使用**：`[組件名稱]` 格式
  - 範例：`.scroll_fetch`, `.image_upload`, `.countdown`
- **每個頁面必須有唯一的根類別名稱** - 不可在頁面間共用

```scss
// ✅ 正確 - 所有元素嵌套在頁面根類別下
.hooks_test_page {
  &-description { }    // .hooks_test_page-description
  &-grid { }           // .hooks_test_page-grid
  &-section {          // .hooks_test_page-section
    &-title { }        // .hooks_test_page-section-title
  }
}

// ❌ 錯誤 - 元素未嵌套
.hooks_test_page { }
.description { }    // 無法識別屬於哪個頁面
.grid { }
```

### 2.4 樣式檔案組織 (強制)

| 樣式類型 | 位置 | 格式 |
|----------|------|------|
| 全域工具 | `styles/` | `.scss` |
| Placeholders | `styles/placeholders/` | `_*.scss` |
| 組件樣式 | 組件目錄內 | `.scss` 或 `.module.scss` |
| 頁面樣式 | `app/` 目錄內 | `.module.scss` |

#### 禁止事項：
- ❌ **永遠不要在 `app/` 內建立 `_shared` SCSS 目錄**
- ❌ **永遠不要在頁面間共用 CSS 類別名稱**
- ❌ **永遠不要在多個頁面間共用單一 CSS 檔案**

#### 必須事項：
- ✅ 跨頁面共用樣式必須定義在 `styles/placeholders/`
- ✅ 透過 `@use '@/styles/placeholders' as *;` 引入 placeholders
- ✅ 如果頁面有相似 DOM，建立接受 `pageClassName` prop 的**組件**

### 2.5 組件與頁面識別模式 (強制)

當組件封裝整個頁面內容時：

```tsx
// components/MyCard/index.tsx
import './index.scss';  // 組件自己的樣式

interface MyCardProps {
  title: string;
  pageClassName?: string;  // 僅用於頁面識別
}

export default function MyCard({ title, pageClassName }: MyCardProps) {
  const rootClassName = pageClassName 
    ? `${pageClassName} my_card` 
    : 'my_card';

  return (
    <div className={rootClassName}>
      <h2 className="my_card-title">{title}</h2>
    </div>
  );
}
```

```tsx
// app/[locale]/page-a/page.tsx
import MyCard from '@/components/MyCard';
import style from './page.module.scss';

export default function PageA() {
  return <MyCard title="標題" pageClassName={style.page_a} />;
}
```

### 2.6 內聯樣式 (限制使用)

#### 允許的內聯樣式：
- ✅ **MUI `sx` prop** - Material-UI 官方樣式方法
- ✅ **CSS 變數傳遞** - `style={{ '--editor_height': '300px' }}`
- ✅ **第三方庫需求** - 例如 GTM 隱藏容器

#### 禁止的內聯樣式：
- ❌ 靜態樣式值 - 使用 CSS 類別
- ❌ 動態計算值 - 使用 CSS 變數傳遞
- ❌ 條件樣式 - 使用 CSS 屬性選擇器
- ❌ 重複模式 - 提取為 placeholders

---

## 3. 檔案組織規範

### 3.1 SCSS 引入順序 (建議)

```scss
// 1. 全域工具
@use '@/styles/placeholders' as *;
@use '@/styles/mixin' as *;

// 2. 組件樣式
.my_component { }
```

### 3.2 組件結構 (建議)

```
components/
└── MyComponent/
    ├── index.tsx       # 組件實作
    ├── index.scss      # 組件樣式（如需要）
    └── types.ts        # 型別定義（如複雜）
```

### 3.3 Demo 組件組織 (`components/Demo/`) (強制)

用於展示頁面功能的完整 Client Component，採用 PascalCase 命名：

#### 命名規則：
- **整頁內容的 Client Component** → `components/Demo/[PageName].tsx`
  - 範例：`BannerDemo.tsx`, `LazyLoadTest.tsx`, `RippleTest.tsx`
- **有多個子組件的頁面** → `components/[PageName]/` 資料夾
  - 範例：`components/ScrollFetch/`, `components/WebRTC/`

#### 使用範例：

```tsx
// app/[locale]/components/banner-demo/page.tsx (Server Component)
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const BannerDemoClient = dynamic(() => import('@/components/Demo/BannerDemo'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Banner 輪播組件測試',
    description: '展示 Banner 組件的各種用法'
  };
}

export default function BannerDemoPage() {
  return <BannerDemoClient />;
}
```

```tsx
// components/Demo/BannerDemo.tsx (Client Component)
'use client';

import { useState } from 'react';
import Banner from '@/components/Banner';
import style from '@/app/[locale]/components/banner-demo/page.module.scss';

export default function BannerDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ... component logic
}
```

---

## 4. 快速參考

### 命名範例

| 項目 | 格式 | 範例 |
|------|------|------|
| 頁面根類別 | `[名稱]_page` | `.hooks_test_page` |
| 組件根類別 | `[名稱]` | `.image_upload` |
| 元素 | `block-element` | `.image_upload-preview` |
| 子元素 | `block-element-child` | `.image_upload-preview-img` |
| 多詞區段 | `word_word` | `.content_box`, `.section_title` |
| 狀態屬性 | `css-is-[狀態]` | `css-is-active`, `css-is-dragging` |
| CSS 變數 | `--word_word` | `--editor_height`, `--offset_y` |

### 該做與不該做

| ✅ 該做 | ❌ 不該做 |
|---------|----------|
| 使用 `as unknown as Type` | 使用 `as any` |
| 使用 `-` 連接 BEM 元素 | 使用 `__` 連接 BEM 元素 |
| 使用 `_` 連接多詞名稱 | 在區段內使用 `-` 連接多詞名稱 |
| 狀態屬性使用 `css-` 前綴 | 使用任意屬性名稱做 CSS 狀態 |
| CSS 變數名稱使用 `_` | CSS 變數名稱使用 `-` |
| 在 `styles/placeholders/` 建立 placeholders | 在 `app/` 內建立 `_shared` 資料夾 |
| 每個頁面給予唯一根類別 | 在頁面間共用 CSS 類別名稱 |
| 為共用 DOM 建立組件 | 在頁面間共用 CSS 檔案 |
