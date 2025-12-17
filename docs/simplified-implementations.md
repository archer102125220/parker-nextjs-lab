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

#### WebRTC Pages (`app/[locale]/web-rtc/`)
| 項目 | 簡化說明 | 後續需要 |
|------|----------|----------|
| Signaling 伺服器 | ❌ 無 Signaling 實作 | 需建立 Signaling API (SSE/WebSocket) |
| ICE 候選交換 | 僅 console.log，無實際傳送 | 需透過 Signaling 伺服器交換 |
| Offer/Answer 交換 | 未實作 | 需透過 Signaling 伺服器交換 |
| 房間管理 | 無實際房間邏輯 | 需後端維護房間狀態 |
| ⚠️ 核心功能 | 僅本地視訊預覽，無法 P2P 連線 | 需完整 Signaling 實作 |

**待建立的 API:**
- `app/api/web-rtc/join-room/route.ts` - 加入房間
- `app/api/web-rtc/candidate/route.ts` - ICE 候選交換
- `app/api/web-rtc/description/route.ts` - Offer/Answer 交換
- `app/api/web-rtc/subscription/[roomId]/route.ts` - SSE 訂閱

---

### Stage 6.4: AI/ML 功能

#### Face Swap (`app/[locale]/face-swap/`)
| 項目 | 簡化說明 | 後續需要 |
|------|----------|----------|
| face-api.js | 動態 import，需安裝套件 | ✅ 已規劃安裝 |
| AI 模型檔案 | 需從 Nuxt 專案複製 | ✅ 已規劃複製 |
| 後端 API | 僅 UI，API 未建立 | 需建立 `/api/face-swap/process` |
| 前端換臉 | 基本 Canvas 融合，效果較粗糙 | 可優化融合演算法 |
| ⚠️ 核心功能 | 需模型檔案才能運作 | 安裝依賴和複製模型後可用 |

**待建立的 API:**
- `app/api/face-swap/process/route.ts` - 後端換臉處理

---

## 優先修復順序

### 高優先 (需立即處理)
1. ✅ 安裝 `face-api.js` 套件
2. ✅ 複製 AI 模型檔案到 `/public/ai_models/`
3. 建立 WebRTC Signaling API

### 中優先 (功能完善)
4. 建立 Face Swap 後端 API
5. 建立 Socket.IO/WebSocket 伺服器支援
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
