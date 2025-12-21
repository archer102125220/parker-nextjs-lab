# Parker Next.js Lab - Feature Completion Implementation Plan

## 專案概述 (Project Overview)

本計畫旨在將 `parker-nextjs-lab` (Next.js + TypeScript + React) 專案補齊與 `parker-nuxt-lab` (Nuxt + JavaScript + Vue) 專案相比尚未完成的功能及組件,同時維持原有的 UI 風格及程式碼架構。

This plan aims to complete the missing features and components in `parker-nextjs-lab` (Next.js + TypeScript + React) compared to `parker-nuxt-lab` (Nuxt + JavaScript + Vue), while maintaining the original UI style and code architecture.

---

## 需要使用者確認的事項 (User Review Required)

> [!IMPORTANT]
> **架構決策 (Architecture Decisions)**
> 
> 1. **TypeScript 轉換策略**: 所有從 Vue/JS 轉換的組件將使用嚴格的 TypeScript 類型定義
> 2. **狀態管理**: 使用 Redux (已存在於專案中) 替代 Pinia
> 3. **樣式方案**: 維持 SCSS + Material-UI 的混合方案
> 4. **API 路由**: 使用 Next.js App Router API routes 替代 Nuxt server routes

> [!WARNING]
> **重大差異 (Breaking Differences)**
> 
> 1. **Server-Side 功能**: Nuxt 專案中的 `server/` 目錄功能需要重新設計為 Next.js API routes
> 2. **Middleware**: Nuxt middleware 需要轉換為 Next.js middleware
> 3. **Plugins**: Vue plugins 需要轉換為 React Context/Providers
> 4. **Composables**: Vue composables 需要轉換為 React custom hooks

> [!CAUTION]
> **需要外部服務的功能 (Features Requiring External Services)**
> 
> 1. **Face Swap 功能**: 需要 face-api.js 模型檔案和後端處理
> 2. **WebRTC**: ✅ 已使用 SSE + Upstash Redis 實作 signaling
> 3. **~~Socket.IO~~**: ❌ **不實作** - Next.js 不支援內建 WebSocket 伺服器
> 4. **~~WebSocket Server~~**: ❌ **不實作** - Next.js 不支援內建 WebSocket 伺服器
> 5. **PostgreSQL**: 需要資料庫連線配置
> 6. **Upstash Redis**: ✅ 已整合 - WebRTC 和 SSE 使用 `nextjs-lab:` 前綴
> 
> **替代方案**: 
> - ✅ Server-Sent Events (SSE) 替代 Socket.IO/WebSocket (已完整實作並測試通過)
> - ✅ Redis key 前綴 `nextjs-lab:` 避免與 parker-nuxt-lab 衝突

---

## 缺失功能分析 (Missing Features Analysis)

### 📦 核心組件 (Core Components)

#### 🔴 完全缺失 (Completely Missing)

1. **Banner.vue** → Banner.tsx
   - 3D 輪播效果
   - 拖曳支援
   - 鍵盤導航
   - 自動播放

2. **Countdown.vue** → Countdown.tsx
   - 翻牌動畫效果
   - 倒數/正數計時
   - 日期計算功能
   - 複雜的 CSS 動畫

3. **Selector.vue** → Selector.tsx
   - 下拉選單
   - 動態高度計算
   - 自訂 slot 支援

4. **DatePicker.vue** → DatePicker.tsx
   - 日期選擇器組件

5. **ImageUpload.vue** → ImageUpload.tsx
   - 圖片上傳預覽
   - 拖放支援

6. **PhoneInput.vue** → PhoneInput.tsx
   - 電話號碼輸入
   - 國碼選擇

7. **QRcode.vue** → QRCode.tsx
   - QR Code 生成

8. **SlideInPanel.vue** → SlideInPanel.tsx
   - 側邊滑入面板

9. **SwitchButton.vue** → SwitchButton.tsx
   - 開關按鈕組件

10. **SwiperCustom.vue** → SwiperCustom.tsx
    - 自訂 Swiper 實作

11. **Tabs/** → Tabs/
    - Tab 組件系統

12. **WangEditor/** → WangEditor/
    - 富文本編輯器整合

13. **LoadingBar.vue** → LoadingBar.tsx
    - 載入進度條

14. **PWALoading.vue** → PWALoading.tsx
    - PWA 載入畫面

15. **DialogModal/** → DialogModal/
    - 對話框模態系統

16. **Layout/Header.vue** → Layout/Header.tsx
    - 頁首組件

17. **Layout/Footer.vue** → Layout/Footer.tsx
    - 頁尾組件

#### 🟡 部分實作 (Partially Implemented)

1. **Dialog** - 已有基礎,需要增強功能
2. **Drawer** - 已有基礎,需要增強功能
3. **ScrollFetch** - 已有基礎,需要增強功能
4. **SkeletonLoader** - 已有基礎,需要增強功能
5. **SwiperJs** - 已有基礎,需要增強功能

---

### 📄 頁面組件 (Page Components)

#### 🔴 完全缺失的頁面 (Completely Missing Pages)

1. **components/** 目錄下的測試頁面:
   - banner-demo
   - countdown-test
   - enter-label
   - go-top
   - image-upload-test
   - phone-input
   - qr-code-test
   - selector
   - slide-in-panel
   - swiper-test (custom)
   - switch-button
   - tab-test
   - virtual-scroller
   - wang-editor-test
   - youtube-test
   - components-test (總覽頁)

2. **directives/** 目錄 → **directive-effects/**:
   > ⚠️ **重要**: Vue Directives (`v-xxx`) 在 React 中不存在。
   > 這些功能需要轉換為 **Custom Hooks** 或 **Components**。
   
   - `v-customize-lazyload` → `useLazyLoad` Hook (使用 Intersection Observer)
   - `v-customize-ripple` → `<Ripple>` Component
   - index → 效果總覽頁

3. **face-api.vue** - Face API 功能頁面

4. **face-swap/** 目錄:
   - backend.vue
   - frontend.vue
   - index.vue

5. **fido2-lib.vue** - FIDO2 認證頁面

6. **frontend-api-cache-test.vue** - API 快取測試

7. **offline.vue** - 離線頁面

8. **route/** 目錄:
   - params-back-test
   - query-back-test
   - index

9. **server-sent-event-test/** 目錄:
   - global-get
   - global-post
   - room-get
   - room-post
   - index

10. **socket-test/** 目錄:
    - global
    - room
    - index

11. **web-authn.vue** - WebAuthn 認證

12. **web-cam.vue** - 網路攝影機

13. **web-rtc/** 目錄:
    - 多個 WebRTC 相關頁面

14. **about.vue** - 關於頁面

---

### 🔧 工具函式與 Hooks (Utilities & Hooks)

#### Nuxt Composables → React Hooks

需要轉換的 composables (20個):
- useSocketIoClient
- useClassifySwipeDirection
- useDebounce
- useThrottle
- useIntersectionObserver
- useLocalStorage
- useSessionStorage
- useMediaQuery
- useFetch (自訂版本)
- 等等...

---

### 🌐 Server-Side 功能 (Server-Side Features)

#### API Routes 需要實作

1. **Face Swap API**
   - `/api/face-swap/process`

2. **OAuth 驗證**
   - `/api/facebook-oauth-verify`
   - `/api/google-oauth-verify`
   - `/api/line-oauth-verify`

3. **Nuxt Server APIs** (22個)
   - 需要從 `server/api/nuxt-server/` 轉換

4. **Server Routes** (18個)
   - Socket.IO routes
   - SSE routes
   - WebRTC signaling routes

---

### 🎨 樣式與資源 (Styles & Assets)

1. **全域樣式**
   - 需要確認 CSS 命名規範一致性
   - 動畫效果移植

2. **靜態資源**
   - face-api.js 模型檔案
   - 圖示與圖片資源

---

## 實作階段規劃 (Implementation Phases)

### Phase 1: 核心組件基礎 (Core Components Foundation)
**預估時間**: 2-3 週

#### Stage 1.1: 簡單組件 (Simple Components)
- [ ] QRCode
- [ ] SwitchButton
- [ ] LoadingBar
- [ ] PWALoading
- [ ] DatePicker

#### Stage 1.2: 中等複雜度組件 (Medium Complexity)
- [ ] Selector
- [ ] PhoneInput
- [ ] ImageUpload
- [ ] SlideInPanel
- [ ] Tabs

#### Stage 1.3: 複雜組件 (Complex Components)
- [ ] Banner (3D carousel)
- [ ] Countdown (flip animation)
- [ ] SwiperCustom
- [ ] WangEditor
- [ ] DialogModal

---

### Phase 2: Layout 與導航 (Layout & Navigation)
**預估時間**: 1 週

- [ ] Layout/Header
- [ ] Layout/Footer
- [ ] 導航系統整合
- [ ] 響應式設計調整

---

### Phase 3: 增強現有組件 (Enhance Existing Components)
**預估時間**: 1 週

- [ ] Dialog 功能增強
- [ ] Drawer 功能增強
- [ ] ScrollFetch 功能增強
- [ ] SkeletonLoader 樣式統一
- [ ] SwiperJs 功能補齊

---

### Phase 4: Hooks 與工具函式 (Hooks & Utilities)
**預估時間**: 1-2 週

#### Stage 4.1: 基礎 Hooks
- [x] useDebounce (已實作)
- [ ] useThrottle
- [ ] useLocalStorage
- [ ] useSessionStorage
- [ ] useMediaQuery

#### Stage 4.2: 進階 Hooks
- [ ] useSocketIoClient
- [ ] useClassifySwipeDirection
- [ ] useIntersectionObserver
- [x] useRequest (已實作,包含 useGetRequest, usePostRequest 等)

---

### Phase 5: 頁面組件 (Page Components)
**預估時間**: 2-3 週

#### Stage 5.1: Components 測試頁面
- [ ] components/index (總覽)
- [ ] banner-demo
- [ ] countdown-test
- [ ] selector
- [ ] phone-input
- [ ] 其他組件測試頁 (15+)

#### Stage 5.2: 功能頁面
- [ ] about
- [ ] offline
- [ ] web-cam
- [ ] frontend-api-cache-test

#### Stage 5.3: Directives 頁面
- [ ] directives/index
- [ ] customize-lazyload-test
- [ ] customize-ripple-test

---

### Phase 6: 進階功能 (Advanced Features)
**預估時間**: 3-4 週

#### Stage 6.1: 認證功能
- [ ] web-authn
- [ ] fido2-lib
- [ ] OAuth 整合

#### Stage 6.2: 即時通訊
- [ ] Socket.IO 整合
- [ ] socket-test 頁面
- [ ] Server-Sent Events
- [ ] server-sent-event-test 頁面

#### Stage 6.3: WebRTC
- [ ] WebRTC 基礎設定
- [ ] web-rtc 頁面群組
- [ ] Signaling server

#### Stage 6.4: AI/ML 功能
- [ ] face-api 整合
- [ ] face-api 頁面
- [ ] face-swap 功能
- [ ] face-swap 頁面群組

---

### Phase 7: API Routes 與 Server 功能 (API & Server)
**預估時間**: 2-3 週

- [ ] OAuth API routes
- [ ] Face Swap API
- [ ] Nuxt Server APIs 轉換
- [ ] Socket.IO server routes
- [ ] SSE server routes
- [ ] WebRTC signaling routes

---

### Phase 8: 測試與優化 (Testing & Optimization)
**預估時間**: 1-2 週

- [ ] 單元測試
- [ ] 整合測試
- [ ] E2E 測試
- [ ] 效能優化
- [ ] 無障礙測試
- [ ] 瀏覽器相容性測試

---

### Phase 9: 文件與部署 (Documentation & Deployment)
**預估時間**: 1 週

- [ ] API 文件
- [ ] 組件文件
- [ ] 使用範例
- [ ] 部署指南
- [ ] README 更新

---

## 技術棧對照 (Technology Stack Mapping)

| Nuxt (Vue) | Next.js (React) | 說明 |
|------------|-----------------|------|
| `composables/` | `hooks/` | 狀態邏輯 |
| `plugins/` | `components/*Provider.tsx` | 全域功能 |
| `middleware/` | `middleware.ts` | 路由守衛 |
| `server/api/` | `app/api/` | API 路由 |
| `server/routes/` | `app/api/` + WebSocket server | Server routes |
| Pinia | Redux | 狀態管理 |
| `<script setup>` | Function Components + Hooks | 組件語法 |
| `v-model` | `value` + `onChange` | 雙向綁定 |
| `ref()`, `reactive()` | `useState()`, `useReducer()` | 響應式狀態 |
| `computed()` | `useMemo()` | 計算屬性 |
| `watch()` | `useEffect()` | 副作用 |
| `onMounted()` | `useEffect(() => {}, [])` | 生命週期 |
| Nuxt auto-imports | Manual imports | 導入方式 |

---

## 預估總時間 (Estimated Total Time)

- **最少**: 13 週 (3 個月)
- **最多**: 19 週 (4.5 個月)
- **建議**: 16 週 (4 個月) - 包含緩衝時間

---

## 風險評估 (Risk Assessment)

### 🔴 高風險項目 (High Risk)

1. **Face Swap 功能**
   - 需要複雜的 ML 模型整合
   - 效能優化挑戰
   - 瀏覽器相容性問題

2. **WebRTC 功能**
   - Signaling server 架構
   - NAT traversal 問題
   - 多瀏覽器支援

3. **Socket.IO 整合**
   - Server-side 架構調整
   - 即時通訊狀態管理
   - 連線穩定性

### 🟡 中風險項目 (Medium Risk)

1. **複雜動畫組件** (Banner, Countdown)
   - CSS 動畫轉換
   - 效能優化
   - 跨瀏覽器一致性

2. **OAuth 整合**
   - 第三方服務依賴
   - 安全性考量
   - Token 管理

### 🟢 低風險項目 (Low Risk)

1. **簡單組件**
2. **基礎 Hooks**
3. **靜態頁面**

---

## 依賴項目 (Dependencies)

### 需要新增的套件 (Packages to Add)

```json
{
  "dependencies": {
    "qrcode.react": "^3.1.0",
    "socket.io-client": "^4.8.0",
    "face-api.js": "^0.22.2",
    "@tensorflow/tfjs": "^4.22.0",
    "simple-peer": "^9.11.1",
    "wangeditor": "^5.1.23",
    "swiper": "^11.1.0",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "@types/qrcode.react": "^1.0.5",
    "@types/simple-peer": "^9.11.8"
  }
}
```

### 需要配置的服務 (Services to Configure)

1. Socket.IO Server
2. WebRTC Signaling Server
3. PostgreSQL Database
4. Firebase (已配置)

---

## 成功指標 (Success Criteria)

- [ ] 所有 Nuxt 專案中的組件都有對應的 React 實作
- [ ] 所有測試頁面都能正常運作
- [ ] UI/UX 與 Nuxt 版本保持一致
- [ ] TypeScript 類型覆蓋率 > 90%
- [ ] 所有功能通過測試
- [ ] 效能指標符合預期
- [ ] 文件完整且清晰

---

## 下一步行動 (Next Steps)

1. **使用者確認本計畫**
2. **建立 task.md 追蹤進度**
3. **開始 Phase 1: 核心組件基礎**
4. **定期回報進度**

---

## 附註 (Notes)

> [!NOTE]
> 本計畫為初步評估,實際執行時可能需要根據具體情況調整。某些功能可能需要重新設計以符合 Next.js 的最佳實踐。

> [!TIP]
> 建議採用漸進式開發策略,優先完成核心組件,再逐步擴展到進階功能。每個 Phase 完成後進行測試和驗證。
