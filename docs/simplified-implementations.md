# 簡化實作清單 (Simplified Implementation Notes)

> 本文件記錄哪些頁面/組件是以簡化方式實作，需要後續完善。
> 更新日期: 2025-12-17

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
| 項目 | 簡化說明 | 後續需要 |
|------|----------|----------|
| Socket.IO 伺服器 | 無後端 Socket.IO 伺服器 | 需建立或連接外部 Socket.IO 伺服器 |
| WebSocket 伺服器 | 無後端 WebSocket 伺服器 | 需建立 WebSocket API route 或外部伺服器 |
| ⚠️ 核心功能 | 僅 UI 和前端邏輯，無法實際通訊 | 需後端支援 |

#### SSE Test (`app/[locale]/server-sent-event-test/`)
| 項目 | 簡化說明 | 後續需要 |
|------|----------|----------|
| SSE API | 使用現有 hooks，依賴後端 API | 確認 API routes 存在 |
| ✅ 核心功能 | 前端邏輯完整 | 確認後端 SSE API 運作 |

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
| 項目 | 簡化說明 | 後續需要 |
|------|----------|----------|
| Signaling 伺服器 | ⚠️ 僅本地視訊預覽 | 需整合 SSE Signaling 或建立 WebSocket 伺服器 |
| ⚠️ 核心功能 | 未整合 Signaling | 可複製 SSE 版邏輯 |

---

### Stage 6.4: AI/ML 功能

#### Face Swap (`app/[locale]/face-swap/`)
| 項目 | 狀態 | 說明 |
|------|------|------|
| ✅ face-api.js | 已安裝 | `face-api.js@0.22.2` |
| ✅ AI 模型檔案 | 已複製 | `/public/ai_models/` (18個檔案) |
| ⚠️ 後端 API | 待建立 | 需建立 `/api/face-swap/process` |
| ✅ 前端換臉 | 已完成 | 基本 Canvas 融合 |

---

## 優先修復順序

### 高優先 (需立即處理)
1. ✅ 安裝 `face-api.js` 套件
2. ✅ 複製 AI 模型檔案到 `/public/ai_models/`
3. ✅ 建立 WebRTC Signaling API (SSE 版)

### 中優先 (功能完善)
4. 建立 Face Swap 後端 API
5. 整合 Socket.IO/WebSocket 房間頁面使用 SSE Signaling
6. WebAuthn 憑證持久化儲存

### 低優先 (優化改進)
7. WebRTC 房間狀態管理優化
8. Face Swap 融合演算法優化
9. 錯誤處理和使用者體驗優化

---

## 相關檔案快速連結

- [WebAuthn Page](file:///Users/parker/Desktop/code/parker-nextjs-lab/app/[locale]/web-authn/page.tsx)
- [Socket Test](file:///Users/parker/Desktop/code/parker-nextjs-lab/app/[locale]/socket-test/)
- [SSE Test](file:///Users/parker/Desktop/code/parker-nextjs-lab/app/[locale]/server-sent-event-test/)
- [WebRTC](file:///Users/parker/Desktop/code/parker-nextjs-lab/app/[locale]/web-rtc/)
- [Face Swap](file:///Users/parker/Desktop/code/parker-nextjs-lab/app/[locale]/face-swap/)
