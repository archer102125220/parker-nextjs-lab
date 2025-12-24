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
- **使用 `-`（連字號）** 連接區塊與元素：`.block-element`
- **使用 `_`（底線）** 用於單一區段內的多詞名稱：`.image_upload`, `.content_box`
- **永遠不要使用 `__`**（雙底線）- 使用單一連字號替代
- **狀態用 HTML 屬性必須以 `css-` 開頭**：`css-is-active`, `css-is-dragging`
- **CSS 變數必須使用 `_`（底線）**：`--editor_height`, `--offset_y`

```scss
// ✅ 正確
.image_upload {
  &-preview {        // .image_upload-preview
    &-img { }        // .image_upload-preview-img
  }
  &[css-is-dragging='true'] { }
}

// ❌ 錯誤
.image__upload { }   // 不要使用 __
.image-upload__preview { }  // 不要使用 __
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
