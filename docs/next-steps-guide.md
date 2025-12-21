# 下一步行動指南 (Next Steps Guide)

> 本文件提供詳細的下一步行動計劃和執行步驟
> 建立日期: 2025-12-19

---

## 🎯 當前狀態

- **專案進度**: ~95%
- **當前階段**: Phase 7 - API Routes (15/35+ 完成)
- **主要任務**: API 測試、Socket.IO 架構決策、Face Swap 後端實作

---

## 📋 立即執行項目 (本週內)

### 1. API 測試與驗證 ⏰ 預估 2-3 天

#### 目標
完成所有已實作 API endpoints 的測試，確保功能正常運作。

#### 執行步驟

**Step 1: 準備測試環境**
```bash
# 1. 啟動開發伺服器
yarn dev

# 2. 檢查環境變數
# 確認 .env 檔案包含所有必要的配置
# - Firebase credentials
# - OAuth client IDs
# - Database connection
# - Upstash Redis URL
```

**Step 2: 安裝測試工具**
- 選項 A: 使用 Postman (推薦新手)
  - 下載: https://www.postman.com/downloads/
  - 匯入 API collection (待建立)
  
- 選項 B: 使用 Thunder Client (VS Code 擴充)
  - 安裝: VS Code Extensions → 搜尋 "Thunder Client"
  
- 選項 C: 使用 curl (命令列)
  - 適合自動化腳本

**Step 3: 測試 API 類別**

按照以下順序測試：

1. **測試用 API** (最簡單，無依賴)
   - [ ] `/api/about-content`
   - [ ] `/api/frontend-api-cache-test`
   - [ ] `/api/nextjs-server/scroll-fetch-test`

2. **SSE API** (即時通訊基礎)
   - [ ] `/api/server-sent-event` (全域)
   - [ ] `/api/server-sent-event/room/[roomId]` (房間)
   - [ ] `/api/server-sent-event/room/[roomId]/send` (發送)

3. **WebRTC Signaling API**
   - [ ] `/api/web-rtc/join-room`
   - [ ] `/api/web-rtc/description`
   - [ ] `/api/web-rtc/candidate-list`
   - [ ] `/api/web-rtc/subscription/[roomId]`

4. **WebAuthn API**
   - [ ] `/api/web-authn/generate-challenge`
   - [ ] `/api/web-authn/registration`
   - [ ] `/api/web-authn/verify`

5. **OAuth API** (需要有效 token)
   - [ ] `/api/facebook-oauth-verify`
   - [ ] `/api/google-oauth-verify`
   - [ ] `/api/line-oauth-verify`

6. **FIDO2 API**
   - [ ] `/api/nextjs-server/fido2-lib/generate-option`
   - [ ] `/api/nextjs-server/fido2-lib/registration`
   - [ ] `/api/nextjs-server/fido2-lib/verify`

7. **Firebase Admin API** (需要 Firebase 配置)
   - [ ] 推播通知相關 APIs (7個)

8. **Face Swap API** (需要完整實作)
   - [ ] `/api/face-swap/process`

**Step 4: 記錄測試結果**
- 在 `docs/api-testing-results.md` 中更新測試狀態
- 記錄發現的問題
- 截圖或記錄錯誤訊息

**Step 5: 修復問題**
- 優先修復阻塞性問題
- 記錄修復過程

#### 交付成果
- [ ] 完成 `docs/api-testing-results.md` 測試記錄
- [ ] 所有 API 測試狀態更新
- [ ] 問題清單和修復計劃

---

### 2. Socket.IO 架構決策 ✅ 已完成

#### 最終決策 (2025-12-21)
**採用方案**: 完全使用 SSE 替代 Socket.IO/WebSocket

#### 決策理由
1. ✅ **Next.js 限制**: 不支援內建 WebSocket 伺服器
2. ✅ **SSE 已完整實作**: 所有功能都已實作並測試通過
3. ✅ **成本考量**: SSE 無需額外服務,成本為零
4. ✅ **功能滿足**: SSE 已滿足專案需求

#### 實作狀態
- ✅ SSE API routes 完整實作
- ✅ SSE 測試頁面完成
- ✅ WebRTC SSE Signaling 完成
- ❌ Socket.IO/WebSocket 伺服器端標註為不實作

#### 保留功能
- ✅ `useSocketIoClient` hook (可連接外部服務)
- ✅ `useWebSocket` hook (可連接外部服務)
- ✅ Socket test 頁面 UI (僅展示用途)

---

### 3. Face Swap 後端實作 ⏰ 預估 3-5 天

#### 目標
實作完整的 Face Swap 後端 API，使用 TensorFlow.js Node 提供更好的換臉效果。

#### 執行步驟

**Step 1: 研究技術方案**
- [ ] 研究 `@tensorflow/tfjs-node` 在 Next.js 中的使用
- [ ] 研究 InsightFace 或其他換臉模型
- [ ] 評估效能和資源需求

**Step 2: 安裝依賴**
```bash
# 安裝 TensorFlow.js Node
yarn add @tensorflow/tfjs-node

# 可能需要的其他套件
yarn add canvas
```

**Step 3: 實作後端邏輯**
- [ ] 修改 `/api/face-swap/process/route.ts`
- [ ] 實作人臉偵測 (使用 face-api.js 或 TensorFlow.js)
- [ ] 實作人臉對齊
- [ ] 實作人臉交換演算法
- [ ] 實作後處理 (色彩校正、邊緣融合)

**Step 4: 測試與優化**
- [ ] 單張圖片測試
- [ ] 多種人臉角度測試
- [ ] 效能測試
- [ ] 記憶體使用測試
- [ ] 錯誤處理測試

**Step 5: 前端整合**
- [ ] 更新前端呼叫後端 API
- [ ] 添加載入狀態
- [ ] 錯誤處理
- [ ] 結果展示

#### 技術參考
- [face-api.js 文件](https://github.com/vladmandic/face-api)
- [TensorFlow.js Node 文件](https://www.tensorflow.org/js/guide/nodejs)
- [Canvas API 文件](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

#### 交付成果
- [ ] 完整的 Face Swap 後端 API
- [ ] 測試結果和效能報告
- [ ] 使用文件

---

## 📅 短期目標 (1-2 週內)

### 4. 完成 Phase 7 ⏰ 預估 1 週

#### 目標
完成所有 API routes 的實作、測試和文件。

#### 任務清單
- [ ] 完成所有 API 測試
- [ ] 修復發現的問題
- [ ] 實作缺失的 API (如有)
- [ ] 撰寫 API 使用文件
- [ ] 更新 OpenAPI/Swagger 規格 (可選)

---

### 5. 開始 Phase 8: 測試與優化 ⏰ 預估 1 週

#### 目標
設置測試環境，開始撰寫單元測試。

#### Step 1: 設置測試框架
```bash
# 安裝測試相關套件
yarn add -D jest @testing-library/react @testing-library/jest-dom
yarn add -D @testing-library/user-event
yarn add -D jest-environment-jsdom
```

#### Step 2: 配置 Jest
- [ ] 建立 `jest.config.js`
- [ ] 建立 `jest.setup.js`
- [ ] 配置 TypeScript 支援

#### Step 3: 撰寫測試
優先順序：
1. **Hooks 測試** (最容易開始)
   - [ ] useDebounce
   - [ ] useThrottle
   - [ ] useLocalStorage
   - [ ] useMediaQuery

2. **簡單組件測試**
   - [ ] QRCode
   - [ ] SwitchButton
   - [ ] LoadingBar

3. **複雜組件測試**
   - [ ] Banner
   - [ ] Countdown
   - [ ] Tabs

#### 目標
- [ ] 達到 50%+ 測試覆蓋率
- [ ] 所有 hooks 都有測試
- [ ] 核心組件都有基本測試

---

## 🎯 中期目標 (2-4 週內)

### 6. 完成測試與優化 ⏰ 預估 2 週

#### 測試目標
- [ ] 達到 80%+ 測試覆蓋率
- [ ] 所有組件都有測試
- [ ] 所有 hooks 都有測試
- [ ] 關鍵流程有 E2E 測試

#### 效能優化
- [ ] 分析 bundle size
- [ ] 實作 code splitting
- [ ] 優化圖片載入
- [ ] 優化 AI 模型載入
- [ ] Lighthouse 分數優化

#### 無障礙測試
- [ ] ARIA 標籤檢查
- [ ] 鍵盤導航測試
- [ ] 螢幕閱讀器測試
- [ ] 色彩對比度檢查

---

### 7. 完成文件與部署 ⏰ 預估 1 週

#### API 文件
- [ ] 撰寫完整的 API 規格
- [ ] 建立 API 使用範例
- [ ] 考慮使用 Swagger UI

#### 組件文件
- [ ] 為每個組件撰寫使用說明
- [ ] 建立 props 說明
- [ ] 建立使用範例
- [ ] 考慮使用 Storybook

#### 部署文件
- [ ] 撰寫部署指南
- [ ] 環境變數說明
- [ ] CI/CD 流程設置
- [ ] 監控和日誌設置

---

## 🚀 執行建議

### 每日工作流程
1. **早上**: 檢查任務清單，選擇當天要完成的項目
2. **執行**: 專注完成 1-2 個小任務
3. **記錄**: 更新文件，記錄進度和問題
4. **晚上**: 檢視完成度，規劃明天的任務

### 遇到問題時
1. **記錄問題**: 在對應文件中記錄
2. **研究解決方案**: 查閱文件、搜尋類似問題
3. **尋求協助**: 如果卡住超過 1 小時，考慮尋求協助
4. **更新文件**: 解決後更新文件，避免重複遇到

### 進度追蹤
- 每天更新 `docs/task.md`
- 每週檢視整體進度
- 每個 Phase 完成後進行回顧

---

## 📊 成功指標

### Phase 7 完成標準
- [ ] 所有 API 都已測試
- [ ] 測試通過率 > 95%
- [ ] 所有已知問題都已修復或記錄
- [ ] API 文件完整

### Phase 8 完成標準
- [ ] 測試覆蓋率 > 80%
- [ ] 所有核心功能都有測試
- [ ] Lighthouse 分數 > 90
- [ ] 無嚴重的無障礙問題

### Phase 9 完成標準
- [ ] 所有文件都已完成
- [ ] 部署流程已建立
- [ ] README 已更新
- [ ] 專案可以順利部署到生產環境

---

## 🔗 相關資源

### 專案文件
- [任務清單 (task.md)](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/docs/task.md)
- [實作計劃 (implementation_plan.md)](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/docs/implementation_plan.md)
- [簡化實作清單 (simplified-implementations.md)](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/docs/simplified-implementations.md)
- [API 測試結果 (api-testing-results.md)](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/docs/api-testing-results.md)

### 技術文件
- [Next.js 文件](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest 文件](https://jestjs.io/docs/getting-started)

---

## 📝 更新日誌

- 2025-12-19: 建立下一步行動指南，詳細規劃立即、短期和中期目標
