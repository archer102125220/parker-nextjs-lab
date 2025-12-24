# CSS 標準合規性修復計畫
# CSS Standards Compliance Fix Plan

**建立日期**: 2025-12-21  
**預估完成時間**: 2-3 週  
**負責階段**: Phase 7.5 (插入於 Phase 7 和 Phase 8 之間)

---

## 📋 執行摘要

根據 CSS 標準審查報告，發現專案中約 **50-60 個違規實例**使用內聯樣式處理可在 CSS 中定義的靜態樣式。本計畫採用**嚴格執行規範**策略，將所有違規代碼重構為符合專案 CSS 標準的實作。

### 核心原則

1. **非 MUI 組件禁止使用內聯樣式**（靜態樣式）
2. **使用 CSS 屬性選擇器管理狀態**（`[css-is-*='true']`）
3. **遵循改良式 BEM 命名規範**（單一連字符 `-` 和底線 `_`）
4. **CSS 屬性順序標準化**

---

## 🎯 修復階段

### 階段 1: 高優先級修復 (High Priority) 🔴

**預估時間**: 1 週  
**目標**: 修復大量內聯樣式和明顯違規

#### 1.1 Demo/SwiperJs.tsx - 大量內聯樣式重構

**問題**: 40+ 行內聯樣式用於說明區塊

**修復步驟**:

1. **創建 SCSS 文件**
   ```bash
   # 創建組件專用樣式文件
   touch components/Demo/SwiperJs.scss
   ```

2. **定義 CSS 類別**
   ```scss
   // components/Demo/SwiperJs.scss
   .swiper_demo {
     &_notice {
       /* Positioning */
       
       /* Display & Box Model */
       padding: 24px;
       margin-bottom: 32px;
       border: 1px solid #ffc107;
       border-radius: 8px;
       
       /* Visual */
       background-color: #fff3cd;
       
       &_title {
         /* Display & Box Model */
         margin-top: 0;
         
         /* Typography */
         color: #856404;
       }
       
       &_section {
         /* Display & Box Model */
         margin-bottom: 16px;
         
         &_heading {
           /* Display & Box Model */
           margin-bottom: 8px;
           
           /* Typography */
           font-size: 18px;
         }
         
         &_content {
           /* Display & Box Model */
           margin: 0;
           
           /* Typography */
           line-height: 1.6;
         }
         
         &_list {
           /* Display & Box Model */
           margin: 8px 0;
           padding-left: 24px;
           
           /* Typography */
           line-height: 1.6;
         }
       }
       
       &_info {
         /* Display & Box Model */
         margin-top: 16px;
         padding: 12px;
         border: 1px solid #bee5eb;
         border-radius: 4px;
         
         /* Visual */
         background-color: #d1ecf1;
         
         &_text {
           /* Display & Box Model */
           margin: 0;
           
           /* Typography */
           font-size: 14px;
           color: #0c5460;
         }
       }
     }
   }
   ```

3. **重構 TSX 代碼**
   - 移除所有 `style={}` 屬性
   - 替換為對應的 CSS 類別
   - 導入 SCSS 文件

**預估時間**: 2-3 小時

---

#### 1.2 Tabs/Bar.tsx - 條件樣式轉換

**問題**: 多個條件內聯樣式和靜態樣式

**修復步驟**:

1. **移除條件內聯樣式** (Line 586, 605, 661)
   ```tsx
   // ❌ 移除
   style={{ pointerEvents: prevOpacity === 0 ? 'none' : 'auto' }}
   style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
   
   // ✅ 替換為
   css-is-disabled={prevOpacity === 0 ? 'true' : 'false'}
   css-is-dragging={isDragging ? 'true' : 'false'}
   ```

2. **更新 SCSS 文件**
   ```scss
   // components/Tabs/Bar.scss
   .tabs-nav {
     &[css-is-disabled='true'] {
       pointer-events: none;
     }
   }
   
   .tabs-header-list {
     cursor: grab;
     
     &[css-is-dragging='true'] {
       cursor: grabbing;
     }
   }
   ```

3. **移除靜態內聯樣式** (Line 624)
   ```tsx
   // ❌ 移除
   style={{ position: 'relative', overflow: 'hidden' }}
   
   // ✅ 添加到 SCSS
   .tabs-header-item {
     position: relative;
     overflow: hidden;
   }
   ```

**預估時間**: 1-2 小時

---

#### 1.3 ScrollFetch/index.tsx - 顯示/隱藏狀態

**問題**: 使用 `display: none` 控制可見性

**修復步驟**:

1. **移除內聯樣式** (Line 972, 1012, 1018)
   ```tsx
   // ❌ 移除
   style={{ display: isShowRefreshIcon ? 'block' : 'none' }}
   
   // ✅ 替換為
   css-is-visible={isShowRefreshIcon ? 'true' : 'false'}
   ```

2. **更新 SCSS**
   ```scss
   // components/ScrollFetch/scroll_fetch.scss
   .scroll_fetch {
     &_refresh_icon {
       display: block;
       
       &[css-is-visible='false'] {
         display: none;
       }
     }
   }
   ```

**預估時間**: 30 分鐘

---

#### 1.4 ImageUpload/index.tsx - 隱藏輸入

**問題**: 使用內聯樣式隱藏 input

**修復步驟**:

1. **移除內聯樣式** (Line 139)
   ```tsx
   // ❌ 移除
   style={{ display: 'none' }}
   
   // ✅ 添加類別
   className="image_upload_input_hidden"
   ```

2. **添加 CSS 類別**
   ```scss
   // components/ImageUpload/index.scss
   .image_upload {
     &_input_hidden {
       display: none;
     }
   }
   ```

**預估時間**: 15 分鐘

---

#### 1.5 QRCode/index.tsx - 靜態樣式

**問題**: 使用內聯樣式設置 `objectFit`

**修復步驟**:

1. **移除內聯樣式** (Line 76)
   ```tsx
   // ❌ 移除
   style={{ objectFit: 'contain' }}
   ```

2. **添加到 SCSS**
   ```scss
   // components/QRCode/index.scss (新建)
   .qr_code {
     &_image {
       /* Display & Box Model */
       width: 100%;
       height: 100%;
       
       /* Visual */
       object-fit: contain;
     }
   }
   ```

**預估時間**: 15 分鐘

---

#### 1.6 Tabs/Content.tsx - 靜態高度

**問題**: 使用內聯樣式設置高度

**修復步驟**:

1. **移除內聯樣式** (Line 210)
   ```tsx
   // ❌ 移除
   return <div style={{ height: '100%' }}>{renderContent()}</div>;
   
   // ✅ 添加類別
   return <div className="tabs_content_wrapper">{renderContent()}</div>;
   ```

2. **添加 CSS 類別**
   ```scss
   // components/Tabs/Content.scss
   .tabs_content {
     &_wrapper {
       /* Display & Box Model */
       height: 100%;
     }
   }
   ```

**預估時間**: 15 分鐘

---

#### 1.7 WangEditor/index.tsx - 動態高度

**問題**: 使用內聯樣式設置動態高度

**修復步驟**:

1. **移除內聯樣式** (Line 118)
   ```tsx
   // ❌ 移除
   style={{ height: heightValue, overflowY: 'auto' }}
   
   // ✅ 使用 CSS 變數
   style={{ '--editor-height': heightValue } as React.CSSProperties}
   ```

2. **更新 SCSS**
   ```scss
   // components/WangEditor/index.scss (假設已存在)
   .wang_editor {
     &_container {
       /* Display & Box Model */
       height: var(--editor-height, 500px);
       overflow-y: auto;
     }
   }
   ```

**預估時間**: 20 分鐘

---

#### 1.8 Banner/index.tsx - 檢視並修復

**問題**: 需要檢視完整內容

**修復步驟**:

1. 檢視 Line 184 附近的內聯樣式
2. 根據實際情況決定修復方案
3. 遵循相同的修復模式

**預估時間**: 30 分鐘 - 1 小時

---

#### 1.9 SlideInPanel/index.tsx - 檢視並修復

**問題**: Line 121 有內聯樣式

**修復步驟**:

1. 檢視內聯樣式內容
2. 判斷是否為 CSS 變數或靜態樣式
3. 相應修復

**預估時間**: 20-30 分鐘

---

#### 1.10 PhoneInput/index.tsx - CSS 變數驗證

**問題**: Line 204-207 使用 CSS 變數

**修復步驟**:

1. 驗證 CSS 變數使用是否正確
2. 確認變數命名符合規範
3. 如有問題則修復

**預估時間**: 15 分鐘

---

### 階段 2: 中優先級修復 (Medium Priority) 🟡

**預估時間**: 3-4 天  
**目標**: 修復其餘條件樣式和動態樣式

#### 2.1 檢視並分類剩餘違規

**任務**:
1. 檢視剩餘 200+ 個內聯樣式使用實例
2. 分類為:
   - ✅ CSS 變數傳遞（合理）
   - ✅ 動態計算值（合理）
   - ❌ 靜態樣式（需修復）
   - ❌ 條件樣式（需修復）

**預估時間**: 1 天

---

#### 2.2 批次修復靜態樣式

**任務**:
1. 為每個組件創建或更新 SCSS 文件
2. 移除靜態內聯樣式
3. 添加對應的 CSS 類別

**預估時間**: 2 天

---

#### 2.3 批次修復條件樣式

**任務**:
1. 識別所有條件樣式
2. 轉換為 CSS 屬性選擇器
3. 更新 SCSS 文件

**預估時間**: 1 天

---

### 階段 3: 驗證與文檔 (Verification \u0026 Documentation) 🟢

**預估時間**: 2-3 天  
**目標**: 確保所有修復正確且文檔完整

#### 3.1 視覺回歸測試

**任務**:
1. 在瀏覽器中檢視所有修改的組件
2. 確認樣式顯示正確
3. 測試動態行為（hover、dragging、visibility）
4. 截圖記錄測試結果

**測試頁面清單**:
- `/zh-tw/components/swiper-js`
- `/zh-tw/components/tabs`
- `/zh-tw/components/scroll-fetch`
- `/zh-tw/components/image-upload`
- `/zh-tw/components/qr-code`
- `/zh-tw/components/banner-demo`
- `/zh-tw/components/slide-in-panel`
- `/zh-tw/components/phone-input`
- `/zh-tw/components/wang-editor-test`

**預估時間**: 1 天

---

#### 3.2 代碼審查

**任務**:
1. 檢查所有修改的文件
2. 確認 CSS 命名符合改良式 BEM
3. 確認 CSS 屬性順序正確
4. 確認無遺漏的內聯樣式

**預估時間**: 半天

---

#### 3.3 更新文檔

**任務**:
1. 更新 README.zh-tw.md 的 CSS 規範章節
2. 添加內聯樣式使用指南
3. 更新組件使用範例
4. 記錄修復過程和經驗

**預估時間**: 半天

---

#### 3.4 創建 Stylelint 配置（可選）

**任務**:
1. 安裝 Stylelint
2. 配置規則以強制執行 CSS 標準
3. 整合到 CI/CD 流程

**預估時間**: 半天

---

## 📊 進度追蹤

### 修復進度表

| 階段 | 任務 | 狀態 | 預估時間 | 實際時間 |
|------|------|------|----------|----------|
| 1.1 | Demo/SwiperJs.tsx | ⬜ 未開始 | 2-3h | - |
| 1.2 | Tabs/Bar.tsx | ⬜ 未開始 | 1-2h | - |
| 1.3 | ScrollFetch/index.tsx | ⬜ 未開始 | 30min | - |
| 1.4 | ImageUpload/index.tsx | ⬜ 未開始 | 15min | - |
| 1.5 | QRCode/index.tsx | ⬜ 未開始 | 15min | - |
| 1.6 | Tabs/Content.tsx | ⬜ 未開始 | 15min | - |
| 1.7 | WangEditor/index.tsx | ⬜ 未開始 | 20min | - |
| 1.8 | Banner/index.tsx | ⬜ 未開始 | 30min-1h | - |
| 1.9 | SlideInPanel/index.tsx | ⬜ 未開始 | 20-30min | - |
| 1.10 | PhoneInput/index.tsx | ⬜ 未開始 | 15min | - |
| 2.1 | 分類剩餘違規 | ⬜ 未開始 | 1 day | - |
| 2.2 | 批次修復靜態樣式 | ⬜ 未開始 | 2 days | - |
| 2.3 | 批次修復條件樣式 | ⬜ 未開始 | 1 day | - |
| 3.1 | 視覺回歸測試 | ⬜ 未開始 | 1 day | - |
| 3.2 | 代碼審查 | ⬜ 未開始 | 0.5 day | - |
| 3.3 | 更新文檔 | ⬜ 未開始 | 0.5 day | - |
| 3.4 | Stylelint 配置 | ⬜ 未開始 | 0.5 day | - |

**總預估時間**: 10-15 天（2-3 週）

---

## 🎯 成功標準

### 代碼標準
- [ ] 所有非 MUI 組件無靜態內聯樣式
- [ ] 所有條件樣式使用 CSS 屬性選擇器
- [ ] 所有 CSS 命名符合改良式 BEM
- [ ] 所有 CSS 屬性順序正確

### 測試標準
- [ ] 所有修改的組件視覺正確
- [ ] 所有動態行為正常運作
- [ ] 無回歸問題

### 文檔標準
- [ ] README 更新完整
- [ ] 組件使用範例正確
- [ ] 修復過程記錄完整

---

## 🔧 工具與資源

### 開發工具
- VS Code + SCSS IntelliSense
- Chrome DevTools
- React Developer Tools

### 測試工具
- 瀏覽器開發者工具
- Lighthouse（效能測試）
- axe DevTools（無障礙測試）

### 參考文檔
- [README.zh-tw.md - CSS 開發規範](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/README.zh-tw.md#L335-L447)
- [CSS 標準審查報告](file:///C:/Users/User/.gemini/antigravity/brain/3fe0207b-2a8e-4732-a65a-ab9a6c75dbdb/implementation_plan.md)

---

## 📝 注意事項

### 修復原則
1. **保持功能不變**: 修復後的組件行為必須與修復前完全一致
2. **遵循現有模式**: 參考已正確實作的組件（如 Countdown, ImageUpload）
3. **漸進式修復**: 一次修復一個組件，測試通過後再繼續
4. **記錄問題**: 遇到問題立即記錄，避免重複

### 常見陷阱
1. **忘記導入 SCSS**: 創建 SCSS 後記得在 TSX 中導入
2. **CSS 變數語法錯誤**: 使用 `as React.CSSProperties` 進行型別斷言
3. **屬性選擇器拼寫**: 確保 `css-is-*` 屬性名稱一致
4. **CSS 屬性順序**: 嚴格遵循文檔規範的順序

---

## 🚀 開始執行

### 第一步
1. 閱讀本計畫
2. 確認理解修復原則
3. 準備開發環境

### 第二步
1. 從階段 1.1 開始
2. 按順序完成每個任務
3. 每完成一個任務更新進度表

### 第三步
1. 完成階段 1 後進行階段性測試
2. 確認無問題後繼續階段 2
3. 最後進行完整的階段 3 驗證

---

**建立者**: AI Assistant  
**最後更新**: 2025-12-21
