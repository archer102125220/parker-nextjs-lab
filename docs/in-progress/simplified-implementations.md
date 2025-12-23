# 簡化實作清單 (Simplified Implementation Notes)

> 本文件記錄哪些頁面/組件是以簡化方式實作，需要後續完善。
> 更新日期: 2025-12-23

---

## Phase 6: 進階功能

### Stage 6.1: 認證功能

#### WebAuthn (`app/[locale]/web-authn/`)
| 項目 | 簡化說明 | 後續需要 |
|------|----------|----------|
| 憑證儲存 | 使用 `useRef` 暫存，頁面刷新後消失 | 需整合資料庫儲存 |
| 錯誤處理 | 基本的 try-catch | 可加強使用者友善的錯誤訊息 |
| ✅ 核心功能 | 註冊/驗證流程完整 | - |

---

### Stage 6.2: 即時通訊

#### Socket Test (`app/[locale]/socket-test/`)
| 項目 | 狀態 | 說明 |
|------|------|------|
| Next.js 內建 WebSocket | ❌ **不實作** | Next.js 不支援內建 WebSocket 伺服器 |
| 外部 Socket.IO 伺服器 | ⏳ **可選實作** | 可部署到 Railway/Render 等平台 |
| 前端 UI | ✅ 保留 | 可連接外部 Socket.IO 服務 |
| **短期方案** | ✅ **使用 SSE** | 已完整實作,無需外部服務 |

#### SSE Test (`app/[locale]/server-sent-event-test/`)
| 項目 | 簡化說明 | 後續需要 |
|------|----------|----------|
| SSE API | 使用現有 hooks，依賴後端 API | 確認 API routes 存在 |
| ✅ 核心功能 | 前端邏輯完整 | 確認後端 SSE API 運作 |
| ✅ 後端 API | 已完成所有 SSE endpoints | - |

---

### Stage 6.3: WebRTC

#### WebRTC SSE (`app/[locale]/web-rtc/server-sent-event/`)
| 項目 | 狀態 | 說明 |
|------|------|------|
| ✅ Signaling API | 已完成 | 使用 Upstash Redis + SSE |
| ✅ ICE 候選交換 | 已完成 | `/api/web-rtc/candidate-list` |
| ✅ Offer/Answer 交換 | 已完成 | `/api/web-rtc/description` |
| ✅ 房間管理 | 已完成 | `/api/web-rtc/join-room` |
| ✅ SSE 訂閱 | 已完成 | `/api/web-rtc/subscription/[roomId]` |

#### WebRTC Socket.IO/WebSocket (`socket-io/`, `websocket/`)
| 項目 | 狀態 | 說明 |
|------|------|------|
| Next.js 內建 Signaling | ❌ **不實作** | Next.js 不支援內建 WebSocket 伺服器 |
| 外部 Signaling 伺服器 | ⏳ **可選實作** | 可部署外部 Socket.IO/WebSocket 服務 |
| 前端 UI | ✅ 保留 | 本地視訊預覽,可連接外部服務 |
| **推薦方案** | ✅ **使用 SSE 版** | WebRTC SSE Signaling 已完整實作 |

---

### Stage 6.4: AI/ML 功能

#### Face Swap (`app/[locale]/face-swap/`)
| 項目 | 狀態 | 說明 |
|------|------|------|
| ✅ face-api.js | 已安裝 | `face-api.js@0.22.2` |
| ✅ canvas | 已安裝 | Node canvas 支援 |
| ✅ AI 模型檔案 | 已複製 | `/public/ai_models/` (18個檔案) |
| ✅ 後端 API | **v3.0 已完成** | `/api/face-swap/process` - face-api.js + canvas 實作 |
| ✅ 前端換臉 | 已完成 | 基本 Canvas 融合 |
| ✅ 後端換臉 | **已完成** | **與 Nuxt 版本相同** - face-api.js 自動偵測 + 橢圓遮罩融合 |

**後端 API v3.0 特性** (2025-12-19 - 匹配 parker-nuxt-lab):
- ✅ 使用 face-api.js 自動偵測人臉（無需前端提供座標）
- ✅ 使用 canvas 進行圖片處理
- ✅ 動態載入依賴（避免冷啟動延遲）
- ✅ 自動載入 AI 模型（ssdMobilenetv1, faceLandmark68Net, faceRecognitionNet）
- ✅ 橢圓形遮罩平滑融合（alpha = 0.85）
- ✅ 自動調整人臉大小和位置
- ✅ 完整的錯誤處理（人臉偵測失敗提示）
- ✅ 與 Nuxt 版本實作方式完全一致

---

## Phase 7: API Routes 與 Server 功能

### Nuxt Server APIs 轉換狀態

#### 已轉換的 API (需測試)
| API 路徑 | 狀態 | 測試狀態 | 備註 |
|---------|------|---------|------|
| `nextjs-server/facebook-oauth-verify` | ✅ | ⏳ 待測試 | OAuth 驗證 |
| `nextjs-server/google-oauth-verify` | ✅ | ⏳ 待測試 | OAuth 驗證 |
| `nextjs-server/line-oauth-verify` | ✅ | ⏳ 待測試 | OAuth 驗證 |
| `nextjs-server/fido2-lib/generate-option` | ✅ | ⏳ 待測試 | FIDO2 認證 |
| `nextjs-server/fido2-lib/registration` | ✅ | ⏳ 待測試 | FIDO2 認證 |
| `nextjs-server/fido2-lib/verify` | ✅ | ⏳ 待測試 | FIDO2 認證 |
| `nextjs-server/firebase-admin/*` (7個) | ✅ | ⏳ 待測試 | 推播通知 |
| `nextjs-server/web-authn/*` (3個) | ✅ | ⏳ 待測試 | WebAuthn |
| `nextjs-server/scroll-fetch-test` | ✅ | ⏳ 待測試 | 測試用 |
| `nextjs-server/frontend-api-cach-test` | ✅ | ⏳ 待測試 | 測試用 |

#### 待轉換的 Nuxt Server APIs
> **注意**: 需要檢查 Nuxt 專案的 `server/api/` 目錄，確認還有哪些 API 需要轉換。

- [ ] 列出所有 Nuxt server APIs
- [ ] 比對已轉換的 APIs
- [ ] 補齊缺失的 APIs

### Socket.IO 部署方案評估

#### 選項評估
| 方案 | 優點 | 缺點 | 成本 | 狀態 |
|------|------|------|------|------|
| **Next.js 內建** | 無需外部服務 | ❌ **不支援** | - | ❌ 不可行 |
| Railway | 簡單部署、支援 WebSocket | 需額外服務 | $5-10/月 | ⏳ 可選 |
| Render | 免費方案、支援 WebSocket | 冷啟動較慢 | 免費/$7/月 | ⏳ 可選 |
| Fly.io | 全球部署、低延遲 | 配置較複雜 | 免費/$2/月 | ⏳ 可選 |
| **完全使用 SSE** | 無需額外服務、Vercel 原生支援 | 單向通訊 | 免費 | ✅ **推薦** |

#### 實作決策
- ❌ **不實作**: Next.js 內建 WebSocket/Socket.IO 伺服器（技術上不可行）
- ⏳ **可選實作**: 外部 Socket.IO 伺服器部署（如有需要）
- ✅ **推薦方案**: 使用 SSE（已完整實作,無需額外服務）
- ✅ **保留**: 客戶端 hooks 和 UI（可隨時連接外部服務）

---

## 優先修復順序

### 高優先 (需立即處理)
1. ✅ 安裝 `face-api.js` 套件
2. ✅ 複製 AI 模型檔案到 `/public/ai_models/`
3. ✅ 建立 WebRTC Signaling API (SSE 版)
4. ✅ 建立 Face Swap 後端 API (face-api.js + canvas)
5. 🔄 測試所有已轉換的 API endpoints
6. 🔄 決定 Socket.IO 部署方案（已決策：使用 SSE 替代）

### 中優先 (功能完善)
7. 整合 Socket.IO/WebSocket 房間頁面使用 SSE Signaling
8. WebAuthn 憑證持久化儲存
9. 補齊缺失的 Nuxt Server APIs

### 低優先 (優化改進)
10. WebRTC 房間狀態管理優化
11. Face Swap 融合演算法優化
12. 錯誤處理和使用者體驗優化
13. 效能優化和 bundle size 分析

---

## 技術債務 (Technical Debt)

### 需要重構的部分

1. **Socket.IO 整合**
   - 目前僅有前端 UI，無實際功能
   - 需要決定使用 SSE 替代或部署獨立伺服器
   - ✅ **已決策**: 使用 SSE 替代（已完整實作）

2. **測試覆蓋率**
   - 目前幾乎沒有單元測試
   - 需要補充核心組件和 hooks 的測試

3. **API 文件**
   - 缺少完整的 API 使用文件
   - 需要撰寫 API 規格和範例

### 效能優化項目

1. **AI 模型載入**
   - 模型檔案較大 (~20MB)
   - 需要實作懶載入和快取

2. **Bundle Size**
   - 需要分析和優化 bundle size
   - 考慮 code splitting

3. **圖片優化**
   - 使用 Next.js Image 組件
   - 實作響應式圖片

---

## 未來改進計劃

### Phase 8: 測試與優化

1. **單元測試**
   - 設置 Jest + React Testing Library
   - 為所有組件撰寫測試
   - 目標: 80%+ 覆蓋率

2. **E2E 測試**
   - 設置 Playwright
   - 撰寫關鍵流程測試

3. **效能優化**
   - Lighthouse 分數優化
   - Core Web Vitals 改善

### Phase 9: 文件與部署

1. **API 文件**
   - 使用 Swagger/OpenAPI
   - 撰寫詳細的 API 規格

2. **組件文件**
   - 考慮使用 Storybook
   - 撰寫使用範例

3. **部署文件**
   - CI/CD 流程
   - 環境配置指南

---

## 相關檔案快速連結

### 專案文件
- [任務清單 (task.md)](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/docs/task.md)
- [實作計劃 (implementation_plan.md)](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/docs/implementation_plan.md)

### 頁面組件
- [WebAuthn Page](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/[locale]/web-authn/page.tsx)
- [Socket Test](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/[locale]/socket-test/)
- [SSE Test](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/[locale]/server-sent-event-test/)
- [WebRTC](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/[locale]/web-rtc/)
- [Face Swap](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/[locale]/face-swap/)

### API Routes
- [OAuth APIs](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/api/)
- [WebRTC APIs](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/api/web-rtc/)
- [SSE APIs](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/app/api/server-sent-event/)

