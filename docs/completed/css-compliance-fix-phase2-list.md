# CSS Compliance Fix Phase 2 - 違規清單

**建立日期**: 2025-12-22  
**更新日期**: 2025-12-25  
**原始統計**: 205 個 `style={{` 實例  
**實際需修復**: 約 75 個（排除 MUI sx prop, CSS 變數, 第三方庫）  
**分類狀態**: ✅ 完成  
**修復進度**: ✅ 100% 完成（Phase 2.6 經 Type C 重構自動解決）

---

## 📊 統計摘要

| 類別 | 數量 | 狀態 |
|------|------|------|
| MUI sx prop | ~100 | ✅ 保留（官方方法） |
| CSS 變數/動態值 | ~12 | ✅ 保留（合理使用） |
| 第三方庫要求 | ~1 | ✅ 保留（GTM） |
| 已完成修復 | 56 | ✅ 完成 |
| **Phase 2.6 條件樣式** | **~19** | ✅ 經 Type C 重構自動解決 |

---

## 分類摘要

### ✅ 合理使用（無需修復）

**CSS 變數傳遞**（包含動態計算值）- 保留
- `components/WangEditor/index.tsx:113` - `'--editor-height'` CSS 變數
- `components/SlideInPanel/index.tsx:121` - CSS 變數傳遞
- `components/PhoneInput/index.tsx:204` - CSS 變數傳遞
- `components/Banner/index.tsx:184` - CSS 變數傳遞
- `components/Countdown/index.tsx` (4 處) - CSS 變數傳遞
- `components/VirtualScroller/index.tsx:77` - `--offset-y: ${offsetY}px` 動態位移
- `components/VirtualScroller/index.tsx:85` - `--item-height: ${itemHeight}px` 動態高度
- `components/Tabs/Bar.tsx:636` - 動態標籤位置
> 💡 **原則**：所有動態計算值都應透過 CSS 變數傳遞，而非直接內聯樣式

**第三方庫要求** - 保留
- `components/Google/GTMInit.tsx:44` - GTM 隱藏容器（Google 要求）

**MUI sx prop** - 保留（官方樣式方法）
- 所有 Material-UI 組件的 `sx` prop 使用
- 範例：`<Box sx={{ p: 2 }}>`, `<Typography sx={{ color: 'text.secondary' }}>`
- 原因：MUI 官方推薦方法，支持主題系統，不需要 `!important`
- 估計實例數：100+ 個（全部保留）

### ❌ 需要修復（靜態樣式）

#### 高優先級：頁面級別靜態樣式

**SSE Room 頁面** (大量重複的 flexbox 樣式)
- `app/[locale]/server-sent-event-test/room-post/[[...uuId]]/page.tsx`
  - Line 128: `display: 'flex', gap: 16`
  - Line 157: `display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16`
  - Line 166: `display: 'flex', gap: 8`
  - Line 187: `display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'`
  - Line 218: `display: 'flex', gap: 12`
  - Line 244-270: 多個靜態樣式

- `app/[locale]/server-sent-event-test/room-get/[[...uuId]]/page.tsx`
  - Line 131: `display: 'flex', gap: 16`
  - Line 160: `display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16`
  - Line 169: `display: 'flex', gap: 8`
  - Line 190: `display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'`
  - Line 221: `display: 'flex', gap: 12`
  - Line 247-273: 多個靜態樣式

**Swiper/YouTube 測試頁面** (大量靜態樣式)
- `app/[locale]/components/swiper-test/page.tsx`
  - Line 13, 29, 45, 61: 重複的容器樣式
  - Line 77: `padding: '40px 20px', maxWidth: '1000px', margin: '0 auto'`
  - Line 79: `marginBottom: '30px', color: '#666'`
  - Line 83: `marginBottom: '40px'`
  - Line 90: `marginTop: '10px', color: '#666'`

- `app/[locale]/components/youtube-test/page.tsx`
  - Line 26: `padding: '40px 20px', maxWidth: '900px', margin: '0 auto'`
  - Line 28: `marginBottom: '30px', color: '#666'`
  - Line 32: `marginBottom: '40px'`
  - Line 34: 多個靜態樣式

**Image 組件靜態樣式**
- `app/[locale]/web-rtc/page.tsx:55` - Image 靜態樣式
- `app/[locale]/web-cam/page.tsx:76` - Image 靜態樣式
- `app/[locale]/web-authn/page.tsx:309` - Image 靜態樣式
- `app/[locale]/frontend-api-cache-test/page.tsx:103` - Image 靜態樣式
- `app/[locale]/face-swap/page.tsx:30` - Image 靜態樣式
- `app/[locale]/face-swap/frontend/page.tsx:265` - Image 靜態樣式
- `app/[locale]/face-swap/backend/page.tsx:115` - Image 靜態樣式
- `app/[locale]/about/page.tsx:55` - Image 靜態樣式

**隱藏輸入** (可以用 CSS 類別)
- `app/[locale]/face-swap/frontend/page.tsx:305` - `display: 'none'`
- `app/[locale]/face-swap/backend/page.tsx:154` - `display: 'none'`
- `app/[locale]/face-swap/backend/page.tsx:207` - `display: 'none'`

**Link 裝飾** (可以用 CSS 類別)
- `app/[locale]/route/page.tsx:40` - `textDecoration: 'none'`
- `app/[locale]/directive-effects/page.tsx:57` - `textDecoration: 'none'`

**LazyLoad 測試圖片**
- `app/[locale]/directive-effects/lazyload-test/page.tsx:82` - `width: '100%', height: 'auto', maxWidth: '600px'`
- `app/[locale]/directive-effects/lazyload-test/page.tsx:108` - `width: '100%', height: 'auto', maxWidth: '600px'`

**Face Swap 靜態樣式**
- `app/[locale]/face-swap/frontend/page.tsx:314` - `maxWidth: '100%', maxHeight: 280, borderRadius: 8`
- `app/[locale]/face-swap/frontend/page.tsx:360` - video 靜態樣式
- `app/[locale]/face-swap/frontend/page.tsx:389` - canvas 靜態樣式

**WebRTC Room 視訊樣式**
- `app/[locale]/web-rtc/socket-io/room/[roomId]/page.tsx:359` - video 靜態樣式
- `app/[locale]/web-rtc/socket-io/room/[roomId]/page.tsx:379` - video 靜態樣式
- `app/[locale]/web-rtc/server-sent-event/room/[roomId]/page.tsx:514` - video 靜態樣式
- `app/[locale]/web-rtc/server-sent-event/room/[roomId]/page.tsx:534` - video 靜態樣式

---

## 修復計劃

### 第一階段：SSE Room 頁面（高優先級）

**目標文件**：
- `app/[locale]/server-sent-event-test/room-post/[[...uuId]]/page.tsx`
- `app/[locale]/server-sent-event-test/room-get/[[...uuId]]/page.tsx`

**修復策略**：
1. 在對應的 `page.module.scss` 中添加 flexbox 布局類別
2. 創建可重用的布局類別：
   - `.flex_row` - 基本 flex 行
   - `.flex_row_between` - space-between 布局
   - `.flex_row_center` - 居中對齊
   - `.gap_8`, `.gap_12`, `.gap_16` - 間距工具類別

**預估時間**: 2 小時

---

### 第二階段：測試頁面靜態樣式

**目標文件**：
- `app/[locale]/components/swiper-test/page.tsx`
- `app/[locale]/components/youtube-test/page.tsx`

**修復策略**：
1. 創建 `page.module.scss` 文件
2. 定義頁面容器、段落、標題等樣式類別
3. 移除所有內聯樣式

**預估時間**: 2 小時

---

### 第三階段：Image 組件樣式標準化

**目標文件**: 所有使用 Next.js Image 的頁面

**修復策略**：
1. 在各頁面的 `page.module.scss` 中添加 Image 樣式類別
2. 統一命名：`.{page_name}_page_banner`
3. 移除內聯 `style` 屬性

**預估時間**: 1.5 小時

---

### 第四階段：工具類別樣式

**目標**: 隱藏輸入、Link 裝飾等

**修復策略**：
1. 創建全局工具類別（如果需要）
2. 或在組件級別添加類別
3. 移除內聯樣式

**預估時間**: 1 小時

---

### 第五階段：Video/Canvas 元素

**目標文件**: Face Swap 和 WebRTC 頁面

**修復策略**：
1. 在對應的 `page.module.scss` 中添加 video/canvas 樣式
2. 移除內聯樣式

**預估時間**: 1 小時

---

## 總計

- **需要修復的文件**: 約 15-20 個
- **預估總時間**: 7.5 小時
- **優先級排序**: SSE Room > 測試頁面 > Image 標準化 > 工具類別 > Video/Canvas

---

## 備註

- 保留所有 CSS 變數傳遞（`'--var-name'`）
- 保留所有動態計算值（使用模板字符串）
- 保留第三方庫要求的樣式
- 重點修復重複的靜態樣式
