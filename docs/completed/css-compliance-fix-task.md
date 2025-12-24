# CSS 標準合規性修復任務清單 - Phase 1
# CSS Standards Compliance Fix Task List - Phase 1

**建立日期**: 2025-12-21  
**完成日期**: 2025-12-24  
**當前階段**: ✅ Phase 1 已完成  
**Phase 1 進度**: 10/10 (100%) ✅

---

## 階段 1: 高優先級修復 (High Priority) 🔴

### 1.1 Demo/SwiperJs.tsx - 大量內聯樣式重構
- [x] 創建 `components/Demo/SwiperJs.scss`
- [x] 定義所有 CSS 類別
  - [x] `.swiper_demo_notice`
  - [x] `.swiper_demo_notice_title`
  - [x] `.swiper_demo_notice_section`
  - [x] `.swiper_demo_notice_section_heading`
  - [x] `.swiper_demo_notice_section_content`
  - [x] `.swiper_demo_notice_section_list`
  - [x] `.swiper_demo_notice_info`
  - [x] `.swiper_demo_notice_info_text`
- [x] 移除所有內聯樣式（40+ 行）
- [x] 替換為 CSS 類別
- [x] 導入 SCSS 文件
- [x] 測試頁面顯示

**預估時間**: 2-3 小時  
**實際時間**: 2 小時

---

### 1.2 Tabs/Bar.tsx - 條件樣式轉換
- [x] 移除條件內聯樣式 (Line 586)
  - [x] `pointerEvents` → `css-is-disabled`
- [x] 移除條件內聯樣式 (Line 605)
  - [x] `cursor` → `css-is-dragging`
- [x] 移除條件內聯樣式 (Line 661)
  - [x] `pointerEvents` → `css-is-disabled`
- [x] 移除靜態內聯樣式 (Line 624)
  - [x] `position`, `overflow` → SCSS
- [x] 更新 `components/Tabs/Bar.scss`
- [x] 測試 Tabs 功能

**預估時間**: 1-2 小時  
**實際時間**: 1 小時

---

### 1.3 ScrollFetch/index.tsx - 顯示/隱藏狀態
- [x] 移除內聯樣式 (Line 972)
- [x] 移除內聯樣式 (Line 1012)
- [x] 移除內聯樣式 (Line 1018)
- [x] 添加 `css-is-visible` 屬性
- [x] 更新 `components/ScrollFetch/scroll_fetch.scss`
- [x] 測試顯示/隱藏功能

**預估時間**: 30 分鐘  
**實際時間**: 30 分鐘

---

### 1.4 ImageUpload/index.tsx - 隱藏輸入
- [x] 移除內聯樣式 (Line 139)
- [x] 添加 `.image_upload_input_hidden` 類別
- [x] 更新 `components/ImageUpload/index.scss`
- [x] 修復 TypeScript 錯誤（ref 名稱）
- [x] 測試圖片上傳功能

**預估時間**: 15 分鐘  
**實際時間**: 20 分鐘

---

### 1.5 QRCode/index.tsx - 靜態樣式
- [x] 使用現有 `components/QRCode/index.scss`
- [x] 移除內聯樣式 (Line 76)
- [x] 測試 QR Code 顯示

**預估時間**: 15 分鐘  
**實際時間**: 10 分鐘

---

### 1.6 Tabs/Content.tsx - 靜態高度
- [x] 移除內聯樣式 (Line 210)
- [x] 添加 `.tabs_content_wrapper` 類別
- [x] 更新 `components/Tabs/Content.scss`
- [x] 測試 Tabs Content 顯示

**預估時間**: 15 分鐘  
**實際時間**: 15 分鐘

---

### 1.7 WangEditor/index.tsx - 動態高度
- [x] 移除內聯樣式 (Line 118)
- [x] 使用 CSS 變數 `--editor-height`
- [x] 更新 `components/WangEditor/index.scss`
- [x] 測試編輯器高度調整

**預估時間**: 20 分鐘  
**實際時間**: 25 分鐘

---

### 1.8 Banner/index.tsx - 檢視並修復
- [x] 檢視 Line 184 附近的內聯樣式
- [x] 分析樣式類型（CSS 變數 / 靜態 / 動態）
- [x] ✅ 驗證通過：使用 CSS 變數 (--banner-height, --banner-transition-duration, --banner-drag-offset)
- [x] 無需修復

**預估時間**: 30 分鐘 - 1 小時  
**實際時間**: 10 分鐘（驗證）

---

### 1.9 SlideInPanel/index.tsx - 檢視並修復
- [x] 檢視 Line 121 的內聯樣式
- [x] 判斷修復方案
- [x] ✅ 驗證通過：使用 CSS 變數 (--message_bottom)
- [x] 無需修復

**預估時間**: 20-30 分鐘  
**實際時間**: 5 分鐘（驗證）

---

### 1.10 PhoneInput/index.tsx - CSS 變數驗證
- [x] 檢視 Line 204-207 的 CSS 變數使用
- [x] 驗證變數命名符合規範
- [x] ✅ 驗證通過：正確使用 CSS 變數 (--phone-input-border-color, --phone-input-box-shadow)
- [x] 無需修復

**預估時間**: 15 分鐘  
**實際時間**: 5 分鐘（驗證）

---

## 階段 2: 中優先級修復 (Medium Priority) 🟡

### 2.1 檢視並分類剩餘違規
- [ ] 檢視剩餘 200+ 個內聯樣式實例
- [ ] 分類為:
  - [ ] ✅ CSS 變數傳遞（合理）
  - [ ] ✅ 動態計算值（合理）
  - [ ] ❌ 靜態樣式（需修復）
  - [ ] ❌ 條件樣式（需修復）
- [ ] 創建詳細的修復清單
- [ ] 更新本任務清單

**預估時間**: 1 天  
**實際時間**: -

---

### 2.2 批次修復靜態樣式
- [ ] 為每個組件創建或更新 SCSS 文件
- [ ] 移除所有靜態內聯樣式
- [ ] 添加對應的 CSS 類別
- [ ] 逐一測試每個組件

**預估時間**: 2 天  
**實際時間**: -

---

### 2.3 批次修復條件樣式
- [ ] 識別所有條件樣式
- [ ] 轉換為 CSS 屬性選擇器
- [ ] 更新對應的 SCSS 文件
- [ ] 逐一測試每個組件

**預估時間**: 1 天  
**實際時間**: -

---

## 階段 3: 驗證與文檔 (Verification \u0026 Documentation) 🟢

### 3.1 視覺回歸測試
- [ ] 測試 `/zh-tw/components/swiper-js`
- [ ] 測試 `/zh-tw/components/tabs`
- [ ] 測試 `/zh-tw/components/scroll-fetch`
- [ ] 測試 `/zh-tw/components/image-upload`
- [ ] 測試 `/zh-tw/components/qr-code`
- [ ] 測試 `/zh-tw/components/banner-demo`
- [ ] 測試 `/zh-tw/components/slide-in-panel`
- [ ] 測試 `/zh-tw/components/phone-input`
- [ ] 測試 `/zh-tw/components/wang-editor-test`
- [ ] 截圖記錄測試結果
- [ ] 記錄發現的問題
- [ ] 修復發現的問題

**預估時間**: 1 天  
**實際時間**: -

---

### 3.2 代碼審查
- [ ] 檢查所有修改的文件
- [ ] 確認 CSS 命名符合改良式 BEM
- [ ] 確認 CSS 屬性順序正確
- [ ] 確認無遺漏的內聯樣式
- [ ] 記錄審查結果

**預估時間**: 半天  
**實際時間**: -

---

### 3.3 更新文檔
- [ ] 更新 README.zh-tw.md 的 CSS 規範章節
- [ ] 添加內聯樣式使用指南
- [ ] 更新組件使用範例
- [ ] 記錄修復過程和經驗
- [ ] 創建修復總結報告

**預估時間**: 半天  
**實際時間**: -

---

### 3.4 創建 Stylelint 配置（可選）
- [ ] 安裝 Stylelint 和相關插件
- [ ] 配置規則以強制執行 CSS 標準
- [ ] 測試 Stylelint 配置
- [ ] 整合到 package.json scripts
- [ ] 考慮整合到 CI/CD 流程

**預估時間**: 半天  
**實際時間**: -

---

## 📊 進度統計

- **階段 1**: 10/10 (100%) ✅
- **階段 2**: 0/3 (0%)
- **階段 3**: 0/4 (0%)
- **總計**: 10/17 (59%)

---

## 🎯 當前優先事項

1. ✅ 完成階段 1.1 - Demo/SwiperJs.tsx 修復
2. ✅ 完成階段 1.2 - Tabs/Bar.tsx 修復
3. ✅ 完成階段 1.3-1.10 - 其餘高優先級修復
4. 🔄 進行瀏覽器視覺測試

---

## 📝 備註

### 修復原則
- 保持功能不變
- 遵循現有模式
- 漸進式修復
- 記錄問題

### 測試檢查清單
- [ ] 視覺顯示正確
- [ ] 動態行為正常
- [ ] 無控制台錯誤
- [ ] 無回歸問題

---

**最後更新**: 2025-12-24  
**狀態**: ✅ Phase 1 已完成
