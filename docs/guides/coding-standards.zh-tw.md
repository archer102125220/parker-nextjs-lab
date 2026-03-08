# Parker Next.js Lab - 程式碼規範 (Agent Rules)

> 本文件定義了本專案必須遵守的程式碼規範。
> 這些規則是強制性的，應由 AI agent 和人類開發者共同遵守。

---

## 0. AI Agent 規則與設定 (AI Agent Rules & Configuration)

本專案為不同的 AI 輔助工具提供了專屬的規則設定檔，以確保程式碼風格與規範的一致性。

| AI 模型/工具 | 規則檔案位置 | 說明 |
|---|---|---|
| **Antigravity (Agent)** | `.agent/rules/*.md` | 自動化 Agent (Antigravity) 專用規則 |
| **Gemini Code Assist** | `GEMINI.md` | IDE 擴充功能 (Gemini Code Assist) 專用上下文 |
| **Claude** | `CLAUDE.md` | 適用於 Claude 的專案指令 |
| **Cursor AI** | `.cursor/rules/*.mdc` | 針對 Cursor 的細部規則檔 (使用 `.mdc` 格式) |
| **GitHub Copilot** | `.github/copilot-instructions.md`<br>`.github/instructions/*.instructions.md` | Repository-wide 與特定檔案類型的指令 |

> **開發者注意**：當更新本文件時，請務必同步更新上述所有規則檔案，以確保 AI 行為的一致性。

> **📖 詳細的 AI 配置指南**，請參閱 [AI Agents 配置指南](./ai-agents-config.zh-tw.md)，其中說明了所有 AI 助手的完整架構、檔案結構、同步策略和使用指南。

### Skills 系統

除了 **Rules**（簡潔的核心標準）之外，本專案還提供 **Skills**（詳細的任務特定指南）用於處理複雜場景：

| 資源 | 用途 | 位置 |
|------|------|------|
| **Skills** | 包含決策樹、範例和檢查清單的詳細指南 | `.agent/skills/*/SKILL.md` |
| **Skills 指南** | 完整的 skills 文檔 | [docs/guides/skills-guide.zh-tw.md](./skills-guide.zh-tw.md) |

**可用的 Skills**：
- [CSS/SCSS 命名規範](.agent/skills/css-naming-convention/SKILL.md) - 連字符 vs 底線決策樹
- [資料庫遷移工作流程](.agent/skills/database-migration-workflow/SKILL.md) - 生產環境 vs 開發環境工作流程
- [程式碼重構安全](.agent/skills/code-refactoring-safety/SKILL.md) - AI 工具 vs 腳本
- [React Hooks 選擇](.agent/skills/react-hooks-selection/SKILL.md) - Hook 選擇決策樹
- [Server vs Client 組件](.agent/skills/server-client-components/SKILL.md) - 組件類型決策
- [檔案組織](.agent/skills/file-organization/SKILL.md) - Placeholder vs component 策略
- [Lint 政策](.agent/skills/lint-policy/SKILL.md) - 錯誤處理指南
- [i18n 實作](.agent/skills/i18n-implementation/SKILL.md) - next-intl 模式
- [建置工具](.agent/skills/build-tools/SKILL.md) - Webpack 配置

詳見 [Skills 指南](./skills-guide.zh-tw.md) 完整文檔。

---

## 1. TypeScript 規範

### 1.1 型別安全 (強制)

- **永遠不要使用 `any` 型別** - 使用精確的型別定義、泛型或 `unknown` 替代
- **使用 `as unknown as TargetType`** 進行型別斷言（雙重斷言）
- **永遠不要使用 `as any`** - 始終使用 `as unknown as TargetType` 更安全的斷言
- **添加解釋性註解** - 使用型別斷言時解釋原因
- **使用內聯型別導入** - `import { useState, type ReactNode } from 'react'`

```typescript
// ❌ 禁止
function processData(data: any) { }
const element = document.getElementById('id') as any;

// ✅ 正確
function processData<T extends { value: unknown }>(data: T) { }
const element = document.getElementById('id') as unknown as CustomElement;
```

---

### 1.2 執行時期資料驗證 (嚴格)

為確保穩健性，請始終根據變數的初始狀態使用嚴格的型別檢查。

| 型別 | 禁止使用 | 務必使用 |
|------|----------|----------|
| **字串** | `if (str)` | `if (str !== '')` |
| **數字** | `if (num)` | `typeof num === 'number'`, `num !== 0`, `Number.isFinite(num)` |
| **物件** | `if (obj)` | `typeof obj === 'object' && obj !== null`<br>`if (obj instanceof MyClass)` |
| **陣列** | `if (arr)` | `Array.isArray(arr) && arr.length > 0` |
| **相等性** | `==`, `!=` | `===`, `!==` |

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

#### 嚴格巢狀 (Strict Nesting) - 反映 DOM 層級
- **Class 名稱應反映 DOM 的包含層級**（若有助於語境理解）。
- **範例**：如果 `group` 在 `scroll_area` 內部，它應該命名為 `scroll_area-group`，而不僅僅是 `group`（除非 `group` 是一個頂層的獨立抽象）。

### 2.3 頁面根類別命名 (強制)

- **頁面根元素必須使用**：`[頁面名稱]_page` 格式
  - 範例：`.hooks_test_page`, `.socket_io_page`, `.web_rtc_page`
- **組件根元素必須使用**：`[組件名稱]` 格式
  - 範例：`.scroll_fetch`, `.image_upload`, `.countdown`
- **每個頁面必須有唯一的根類別名稱** - 不可在頁面間共用

---

...

#### 必須事項：
- ✅ 跨頁面共用樣式必須定義在 `styles/placeholders/`
- ✅ 透過 `@use '@/styles/placeholders' as *;` 引入 placeholders
- ✅ 如果頁面有相似 DOM，建立接受 `pageClassName` prop 的**組件**

#### 樣式複用策略 (Style Reuse Strategy) - 嚴格模式
- **單頁複用 (Single Page Reuse)**：在該頁 SCSS 頂部定義 `%placeholder_name` 並在特定元素中使用 `@extend`。
- **多頁複用 (Multi-Page Reuse)**：定義在 `styles/placeholders/` 並使用 `@use` 引入。
- **主要目標**：為每個結構元素維護**唯一且獨立**的 class name，確保能透過 DevTools 快速定位檔案與元素。

### 2.5 組件與頁面識別模式 (強制)

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

---

## 5. Next.js 規範

### 5.1 動態載入與 SSR (強制)

#### 正確用法

```tsx
// ✅ 正確：使用 dynamic() 預設行為（啟用 SSR）
import dynamic from 'next/dynamic';
const DemoComponent = dynamic(() => import('@/components/Demo/Example'));
```

#### 錯誤用法

```tsx
// ❌ 錯誤：不應該隨意關閉 SSR
const DemoComponent = dynamic(() => import('@/components/Demo/Example'), { ssr: false });
```

#### 何時才應該使用 `{ ssr: false }`？

只有在以下極少數情況才需要：
1. 第三方套件內部使用 `window` 或 `document` 且無法在 Node.js 環境執行
2. 該套件沒有提供 SSR 兼容的版本
3. 已確認無其他解決方案

#### 濫用的後果

1. **打包失敗**：在某些配置下會導致 build error
2. **SEO 受損**：搜尋引擎無法正確爬取頁面內容
3. **效能下降**：增加首次載入時間（FCP/LCP）
4. **Layout Shift**：可能造成頁面跳動

### 5.2 國際化 (next-intl 4.x) (強制)

本專案使用 `next-intl` 4.x 進行國際化。**所有在 Server Components 中使用翻譯的頁面必須遵循此模式：**

#### 必要模式

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

async function MyPage({ params }: Props) {
  const { locale } = await params;
  
  // 強制：必須在任何翻譯函式之前調用
  setRequestLocale(locale);
  
  const t = await getTranslations('pages.myPage');
  return <h1>{t('title')}</h1>;
}

export default MyPage;
```

#### 關鍵規則

| 規則 | 說明 |
|------|------|
| `setRequestLocale` 優先 | 必須在 `getTranslations` 或 `getMessages` 之前調用 |
| 頁面必須有 `params` | 每個頁面都需要 `params: Promise<{ locale: string }>` |
| Layout 也需要 | `app/[locale]/layout.tsx` 也必須調用 `setRequestLocale` |

#### 缺少 `setRequestLocale` 的後果

- ❌ Server Components 會預設使用回退語言（zh-tw）
- ❌ 從 URL 切換語言（`/en` vs `/zh-tw`）對頁面內容無效
- ✅ Client Components（Header 等）仍可正常運作

#### 語系檔案位置

i18n/
├── locales/
│   ├── zh-tw.json   # 繁體中文（預設）
│   └── en.json      # 英文
├── navigation.ts     # 導航工具
├── request.ts        # Request 配置
└── routing.ts        # 路由配置
```

### 5.3 useLayoutEffect vs useEffect (建議)

當需要將外部 props 同步到影響**視覺渲染**的內部 state 時，使用 `useLayoutEffect`：

#### 何時使用 `useLayoutEffect`

```tsx
// ✅ 正確：防止滑動器/輪播切換時的視覺閃爍
useLayoutEffect(() => {
  setSliderIndex(externalValue);
}, [externalValue]);
```

**適用場景：**
- 滑動器/輪播位置同步
- 動畫狀態初始化
- 繪製前的 DOM 測量
- 任何影響版面/位置的 state 同步

#### 何時使用 `useEffect`

```tsx
// ✅ 正確：用於非視覺副作用
useEffect(() => {
  fetchData();
  subscribeToEvents();
}, [dependencies]);
```

**適用場景：**
- 資料獲取
- 事件訂閱
- 計時器和間隔
- 分析追蹤

#### 關鍵差異

| 面向 | `useEffect` | `useLayoutEffect` |
|------|-------------|-------------------|
| 執行時機 | 瀏覽器繪製後 | 瀏覽器繪製前 |
| 執行方式 | 非同步 | 同步 |
| 阻塞 UI | 否 | 是 |

> ⚠️ **警告**：`useLayoutEffect` 同步執行並會阻塞瀏覽器繪製。避免執行繁重的計算。

#### 重要說明：React 時序 vs JavaScript async/await

這裡的「同步」和「非同步」是指 **React 渲染週期的時序**，而非 JavaScript 的 `async/await`：

| 概念 | 含義 |
|------|------|
| **React 時序（本節討論）** | Hook 相對於瀏覽器繪製的執行時機 |
| **JavaScript async/await** | 處理 Promise 的非同步操作（API 呼叫、檔案 I/O） |

```
React 渲染流程：
Render → Commit → [useLayoutEffect] → Paint → [useEffect]
                       ↑ 同步                    ↑ 非同步
                   （阻塞繪製）              （繪製後執行）
```

**簡單記憶：**
- React 同步/非同步 → 影響**畫面渲染順序**
- JavaScript async/await → 處理**非同步操作**（API、Timer 等）

### 5.4 React Stable API 政策 (強制)

本專案優先使用 **React Stable APIs**、**避免實驗性語法**，並要求**正確選擇 Hook**。

#### 完整 React 19 Stable Hooks 列表

| 分類 | Hooks |
|------|-------|
| 狀態 | `useState`, `useReducer` |
| Context | `useContext` |
| Ref | `useRef`, `useImperativeHandle` |
| Effect | `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent` |
| 效能 | `useMemo`, `useCallback` |
| 排程 | `useTransition`, `useDeferredValue` |
| 其他 | `useId`, `useSyncExternalStore`, `useDebugValue` |
| React 19 新增 | `useActionState`, `useFormStatus`, `useOptimistic`, `use` |

#### Hook 選擇指南

| 情境 | Hook |
|------|------|
| 昂貴的計算 | `useMemo` |
| 傳遞給子組件的 callback | `useCallback` |
| 防止不必要的重新渲染 | `memo` |
| 存取 DOM / 可變值 | `useRef` |
| 複雜狀態邏輯 | `useReducer` |
| 跨組件共享狀態 | `useContext` |
| 視覺同步（防止閃爍） | `useLayoutEffect` |
| 表單 action 狀態（React 19） | `useActionState` |
| 樂觀更新（React 19） | `useOptimistic` |
| 非阻塞 UI 更新 | `useTransition` |
| Effect 內部響應式事件 | `useEffectEvent` |

#### 應避免的反模式

- ❌ 不要在 JSX 中使用 inline arrow function 傳給 memoized 子組件 → 用 `useCallback`
- ❌ 不要每次 render 都重新計算 → 用 `useMemo`
- ❌ 不要用 `useState` 存不需要觸發 re-render 的值 → 用 `useRef`

#### RTK vs useContext（使用 Redux Toolkit 時）

| 使用 RTK | 使用 useContext |
|----------|-----------------|
| 全域應用狀態（用戶、購物車、通知） | Theme Provider（MUI ThemeContext） |
| 跨頁面共享資料 | Locale/i18n（next-intl） |
| 需持久化的狀態 | 局部組件樹狀態 |
| 複雜非同步資料（RTK Query） | 第三方 Provider（React Query, SWR） |
| 需要 DevTools 除錯的狀態 | 組件庫內部狀態（FormContext） |

#### 應避免的實驗性功能

- ❌ React Compiler / React Forget（實驗性）
- ❌ 任何在 React 文件中標記為 "Canary" 或 "Experimental" 的功能
- ❌ Unstable API（以 `unstable_` 為前綴）

### 5.5 建置與開發工具 (強制)

由於 SCSS `:export` 語法目前與 Turbopack 不相容，您必須使用以下指令：

- **開發 (Development)**:
  - `yarn dev:webpack` (HTTP)
  - `yarn dev-https:webpack` (HTTPS - WebRTC/WebAuthn 必須)
- **生產建置 (Production Build)**:
  - `yarn build:webpack`

**禁止事項**：請勿直接使用 `yarn dev` 或 `yarn build`，因為它們可能預設使用 Turbopack 或缺少必要配置。

**環境檢查**：啟動開發伺服器時，**務必**檢查 `.env` 中的 `NEXT_PUBLIC_API_BASE` 和 `NEXT_PUBLIC_DOMAIN` 設定是否與 `package.json` 中的啟動指令一致（特別是埠號）。如果不一致（例如：.env 使用 3000 但指令使用 3001），或當 `.env` 被 gitignore 且 IDE 無法讀取時，在此之前**必須**詢問使用者是否確認使用當前 `.env` 設定。


### 5.6 Server Components vs Client Components (強制)

**核心原則**：預設使用 Server Components，只在需要時才使用 Client Components。

#### 何時使用 Server Components（預設）

| 場景 | 原因 |
|------|------|
| 資料獲取 | 減少客戶端 bundle，更快載入 |
| 後端資源 | 直接查詢資料庫、讀取檔案 |
| 敏感資料 | API keys、tokens 不暴露 |
| 靜態內容 | 無互動的 UI |

#### 何時使用 Client Components（`'use client'`）

| 場景 | 原因 |
|------|------|
| 互動功能 | onClick、onChange 等事件 |
| Hooks | useState、useEffect、useContext |
| 瀏覽器 API | localStorage、window |
| 第三方客戶端套件 | 依賴 window 的 library |

#### 最佳實踐

1. **將 `'use client'` 下推到葉節點元件** - 不要將整個頁面標記為 client
2. **Server 獲取，Client 渲染** - 在 Server Component 獲取資料，傳遞給 Client
3. **使用 children 模式** - Server 可包裹 Client，Client 可透過 children 包裹 Server


### 5.7 Hydration 策略與狀態管理 (關鍵)

對於影響**初次渲染 (Initial Render)** 結果的關鍵資料（如 `nonce`、主題設定、語系），**必須**使用 **Props** 或 **Context** 傳遞，而不能只依賴 Redux。

#### 為什麼不能只用 Redux？

Redux 狀態在 Client 端初始化的時機點，往往比 React 的 Hydration 稍晚，或初始狀態為「空」。這會導致：

1. **Server 端**：HTML 包含正確資料（如 `nonce="xyz"`）。
2. **Client 端 (Hydration)**：Redux 尚未同步，使用初始值（如 `nonce=""`）。
3. **結果**：React 偵測到屬性不匹配，拋出 **Hydration Mismatch Error**。

#### 正確做法

| 資料類型 | 推薦方式 | 原因 |
|----------|----------|------|
| **關鍵資料** (Nonce, Locale) | **Props / Context** | 確保 Server HTML 與 Client Initial Render 完全一致 |
| **互動資料** (User, Cart) | **Redux / React Query** | 可在 Hydration 後再載入或更新 |

**範例 (正確 - 使用 Context 確保同步)：**

```tsx
// Server Component (Layout)
<NonceProvider nonce={nonce}>
  {children}
</NonceProvider>

// Client Component
const nonce = useNonce(); // 在第一次 render 時就能拿到正確值
```

---

## 6. 資料庫規範

### 6.1 後端 ORM 最佳實踐 (強制)

實作資料庫操作時，**務必優先採用**：

1. **官方 ORM 模式** - 使用 ORM 套件的官方文件做法
2. **社群最佳實踐** - 若官方文件不足，遵循社群公認的最佳實踐
3. **自訂實作** - 僅在沒有官方或社群模式時才自行撰寫

#### ⚠️ 資料庫修改確認 (關鍵)

在進行任何資料庫結構變更（migrations、model 變更、資料表修改）之前，你必須：

1. **詢問開發者**：「專案是否已部署上線？」
2. **根據回答**：
   - **未部署**：可修改現有 migration，然後執行 `yarn initDB` 或 `yarn migrate:undo` + `yarn migrate`
   - **已部署**：禁止修改現有 migration，必須建立新的 migration 檔案

適用於：建立資料表、新增/移除欄位、變更型別、新增索引等

#### Migrations & Seeders
- 使用 `sequelize-cli` 透過 `yarn sequelize` 或 `yarn sequelize:ts`
- **重要**：sequelize-cli 預設生成 `.js` 檔案，你必須將其轉換為 `.ts` 檔案並加上正確型別
- 位置：`db/migrations/`, `db/seeders/`
- 指令：`yarn migrate`, `yarn seed`, `yarn initDB`
- **Migration 修改策略**：
  - **開發階段 (尚未上線)**：
    - 直接修改原始 migration，而非建立新的 `addColumn` migration
    - 將新欄位加入原本的 `createTable` migration
    - 執行 `yarn initDB` 套用變更
  - **上線後**：禁止修改已執行的 migration，必須建立新的 migration 檔案

---

## 7. 禁止使用腳本修改程式碼 (嚴重)

**絕對禁止：使用任何自動化腳本 (sed, awk, powershell script, batch script 等) 直接修改程式碼檔案。**

### 原因
- 腳本只改變文字，不理解上下文或 import
- 2026-01-23 事故：`sed` 改變 `React.FormEvent` → `FormEvent` 但忘記 import → 編譯錯誤

### ✅ 允許的做法
- 使用 AI 工具：`replace_file_content`, `multi_replace_file_content`
- **每次修改都必須驗證 import 語句是否正確**

### ❌ 禁止的做法
- `sed`, `awk`, `perl`, `powershell -Command`, `find ... -exec`
- 任何文字處理工具的批量替換功能

### 例外流程
若腳本使用是**絕對必要**：
1. **必須先取得人類開發者明確批准**
2. 必須提供完整的腳本內容供審核
3. 必須說明為何手動工具無法完成
4. 只有在開發者批准後才能執行

### 謹記
**腳本是盲目的，AI 應該是有智慧的。**
