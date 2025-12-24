# CSS Compliance Fix Phase 2 - 路線圖

**建立日期**: 2025-12-22  
**更新日期**: 2025-12-24  
**狀態**: 🔄 進行中（階段 2.2-2.5 已完成，2.6 待處理）  
**修復數量**: 56/75 (75%)

---

## 🎯 總體目標

將專案中剩餘的 **~75 個靜態內聯樣式** 轉換為符合 BEM 規範的 CSS 類別或 CSS 變數，同時保留合理的內聯樣式使用（MUI sx prop、CSS 變數、第三方庫要求）。

---

## ✅ 已完成工作（階段 1）

**完成日期**: 2025-12-22  
**修復數量**: 17 個內聯樣式

### 成果

1. **添加全域 Placeholders** (11 個)
   - Flexbox 布局 placeholders
   - Message 顯示 placeholders
   - 工具類別 placeholders

2. **SSE Room 頁面** (16 個)
   - room-post: 8 個內聯樣式 → BEM 類別
   - room-get: 8 個內聯樣式 → BEM 類別

3. **web-rtc 頁面** (1 個)
   - banner 圖片樣式 → BEM 類別

### 驗證
- ✅ 瀏覽器測試通過
- ✅ 無視覺回歸
- ✅ 符合 BEM 規範

---

## 📋 剩餘工作分階段計劃

### 階段 2.2：簡單修復 ✅ 已完成

**目標**: 處理低風險、簡單的靜態樣式替換
**完成日期**: 2025-12-24

#### 2.2.1 LazyLoad 測試圖片 ✅
- **文件**: `app/[locale]/directive-effects/lazyload-test/page.tsx`
- **狀態**: ✅ 已完成（先前已修復）

#### 2.2.2 Image 組件樣式標準化 ✅
- **文件**: 
  - `app/[locale]/web-cam/page.tsx` ✅
  - `app/[locale]/web-authn/page.tsx` ✅
  - `app/[locale]/frontend-api-cache-test/page.tsx` ✅
  - `app/[locale]/face-swap/page.tsx` ✅
  - `app/[locale]/face-swap/frontend/page.tsx` ✅
  - `app/[locale]/face-swap/backend/page.tsx` ✅
- **修復內容**: Image banner 樣式、hidden input、video/canvas 樣式
- **數量**: 13 個內聯樣式已移除

**階段 2.2 小計**: 13 個，✅ 已完成

---

### 階段 2.3：隱藏輸入和 Link 裝飾 ✅ 已完成

**目標**: 處理簡單的工具類別樣式
**完成日期**: 2025-12-24

#### 2.3.1 隱藏輸入 ✅
- **狀態**: ✅ 已在階段 2.2 中完成（face-swap 頁面）

#### 2.3.2 Link 裝飾 ✅
- **文件**:
  - `app/[locale]/route/page.tsx` ✅
  - `app/[locale]/directive-effects/page.tsx` ✅
- **修復內容**: 添加 `@extend %no_text_decoration` 到 link 類別

**階段 2.3 小計**: ✅ 已完成

---

### 階段 2.4：測試頁面靜態樣式 ✅ 已完成

**目標**: 為測試頁面創建 CSS 模組
**完成日期**: 2025-12-24

#### 2.4.1 Swiper 測試頁面 ✅
- **文件**: `app/[locale]/components/swiper-test/page.tsx`
- **修復內容**: 
  - 創建 `page.module.scss`
  - 定義 slide 顏色變體類別
  - 移除所有內聯樣式（~10 個）

#### 2.4.2 YouTube 測試頁面 ✅
- **文件**: `app/[locale]/components/youtube-test/page.tsx`
- **修復內容**: 
  - 創建 `page.module.scss`
  - 定義 video wrapper、input、button 樣式
  - 移除所有內聯樣式（~15 個）

**階段 2.4 小計**: ~25 個，✅ 已完成

---

### 階段 2.5：Video/Canvas 元素 ✅ 已完成

**目標**: 處理媒體元素的靜態樣式
**完成日期**: 2025-12-24

#### 2.5.1 Face Swap 頁面 ✅
- **狀態**: ✅ 已在階段 2.2 中完成

#### 2.5.2 WebRTC Room 頁面 ✅
- **文件**:
  - `app/[locale]/web-rtc/socket-io/room/[roomId]/page.tsx` ✅
  - `app/[locale]/web-rtc/server-sent-event/room/[roomId]/page.tsx` ✅
- **修復內容**: 更新共享的 `room.module.scss`，添加 video 類別，移除 TSX 內聯樣式

**階段 2.5 小計**: 4 個，✅ 已完成

---

### 階段 2.6：條件樣式（低優先級）

**目標**: 處理基於狀態的動態樣式

**數量**: ~21 個  
**風險**: 高 🔴  
**時間**: 2-3 小時  
**建議**: 延後處理，需要仔細評估每個案例

**處理方式**:
1. 評估是否可以使用 CSS 屬性選擇器
2. 考慮是否需要保留為動態樣式
3. 可能需要重構組件邏輯

---

## 📊 優先級矩陣

| 階段 | 數量 | 風險 | 時間 | 價值 | 優先級 |
|------|------|------|------|------|--------|
| 2.2 簡單修復 | 8 | 🟢 低 | 45m | 中 | ⭐⭐⭐⭐⭐ |
| 2.3 工具類別 | 5 | 🟢 低 | 35m | 低 | ⭐⭐⭐⭐ |
| 2.5 Video/Canvas | 7 | 🟡 中 | 1h | 中 | ⭐⭐⭐ |
| 2.4 測試頁面 | 20 | 🟡 中 | 2h | 高 | ⭐⭐⭐ |
| 2.6 條件樣式 | 21 | 🔴 高 | 3h | 低 | ⭐ |

---

## 🎯 推薦執行順序

### 快速勝利路徑（推薦）
1. **階段 2.2**: 簡單修復 (8 個，45 分鐘) ⭐
2. **階段 2.3**: 工具類別 (5 個，35 分鐘)
3. **階段 2.5**: Video/Canvas (7 個，1 小時)

**總計**: 20 個修復，約 2.5 小時

### 完整路徑
1. 階段 2.2 + 2.3 + 2.5 (20 個，2.5 小時)
2. **階段 2.4**: 測試頁面 (20 個，2 小時)
3. **階段 2.6**: 條件樣式 (21 個，3 小時) - 可選

**總計**: 61 個修復，約 7.5 小時

---

## ✅ 成功標準

不需要修復所有 205 個實例。合理的完成標準：

### 最小目標（已達成）✅
- ✅ 修復 SSE Room 頁面重複樣式
- ✅ 建立可重用 placeholders
- ✅ 展示正確的修復方法

### 推薦目標
- 🎯 完成階段 2.2 + 2.3 (總計 30 個修復，約 15%)
- 🎯 所有簡單的靜態樣式已處理
- 🎯 建立完整的修復模式文檔

### 理想目標
- 🌟 完成階段 2.2 + 2.3 + 2.4 + 2.5 (總計 50 個修復，約 25%)
- 🌟 所有測試頁面使用 CSS 模組
- 🌟 所有媒體元素樣式標準化

---

## 📝 每階段檢查清單

### 修復前
- [ ] 確認目標文件和行號
- [ ] 檢查是否已有 `page.module.scss`
- [ ] 確認需要的 placeholders 是否存在

### 修復中
- [ ] 在 SCSS 中添加正確巢狀的 BEM 類別
- [ ] 使用 `@extend %placeholder` 引用全域樣式
- [ ] 在 TSX 中替換內聯樣式為 CSS 類別
- [ ] 確保類別名稱正確（使用 `styles['page-element']` 格式）

### 修復後
- [ ] 瀏覽器測試頁面
- [ ] 檢查無視覺回歸
- [ ] 檢查無編譯錯誤
- [ ] 提交代碼

---

## 🔄 迭代策略

### 增量提交
每完成一個階段就提交：
```bash
git add .
git commit -m "fix: CSS compliance - 階段 2.X 完成 (X 個內聯樣式已移除)"
```

### 持續驗證
每個階段完成後：
1. 運行 `yarn dev-https:webpack`
2. 瀏覽器測試受影響頁面
3. 檢查 DevTools 無錯誤
4. 確認樣式正確應用

---

## 📚 參考資源

### 專案規範
- [README.zh-tw.md](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/README.zh-tw.md) - CSS 開發規範
- [styles/placeholders.scss](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/styles/placeholders.scss) - 可用的 placeholders

### 已完成範例
- [room-post/page.module.scss](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/[locale]/server-sent-event-test/room-post/[[...uuId]]/page.module.scss) - 正確的 BEM 巢狀
- [room-post/page.tsx](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/[locale]/server-sent-event-test/room-post/[[...uuId]]/page.tsx) - 正確的類別使用

---

## 🎓 經驗教訓

### ✅ 正確做法
1. 所有頁面元素巢狀在頁面根類別下
2. 使用 `@extend %placeholder` 引用全域樣式
3. 動態值透過 CSS 變數傳遞
4. MUI sx prop 保持不變

### ❌ 避免錯誤
1. 不要創建非巢狀的工具類別
2. 不要直接使用內聯樣式處理動態值
3. 不要忘記導入 `@use '@/styles/placeholders' as *;`
4. 不要修改 MUI sx prop

---

**最後更新**: 2025-12-24  
**維護者**: AI Agent  
**狀態**: ✅ 主要工作已完成（階段 2.2-2.5）
