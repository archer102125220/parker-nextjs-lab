# API 測試結果 (API Testing Results)

> 本文件記錄所有 API endpoints 的測試結果
> 建立日期: 2025-12-19

---

## 測試狀態圖例

- ✅ **通過**: API 正常運作，符合預期
- ⚠️ **警告**: API 運作但有小問題或需要改進
- ❌ **失敗**: API 無法正常運作
- ⏳ **待測試**: 尚未測試
- 🔄 **進行中**: 正在測試或修復中

---

## Phase 7: API Routes 測試

### OAuth API Routes

#### 1. Facebook OAuth Verify
- **路徑**: `/api/facebook-oauth-verify`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 有效的 Facebook token 驗證
  - [ ] 無效的 token 錯誤處理
  - [ ] 缺少 token 參數錯誤處理
  - [ ] 回傳格式正確性

#### 2. Google OAuth Verify
- **路徑**: `/api/google-oauth-verify`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 有效的 Google token 驗證
  - [ ] 無效的 token 錯誤處理
  - [ ] 缺少 token 參數錯誤處理
  - [ ] 回傳格式正確性

#### 3. LINE OAuth Verify
- **路徑**: `/api/line-oauth-verify`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 有效的 LINE token 驗證
  - [ ] 無效的 token 錯誤處理
  - [ ] 缺少 token 參數錯誤處理
  - [ ] 回傳格式正確性

---

### WebAuthn API Routes

#### 1. Generate Challenge
- **路徑**: `/api/web-authn/generate-challenge`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功生成 challenge
  - [ ] Challenge 格式正確
  - [ ] 回傳的 challenge 可用於註冊

#### 2. Registration
- **路徑**: `/api/web-authn/registration`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功註冊憑證
  - [ ] 驗證 attestation
  - [ ] 錯誤處理

#### 3. Verify
- **路徑**: `/api/web-authn/verify`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功驗證憑證
  - [ ] 驗證 assertion
  - [ ] 錯誤處理

---

### FIDO2 API Routes

#### 1. Generate Option
- **路徑**: `/api/nextjs-server/fido2-lib/generate-option`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功生成註冊選項
  - [ ] 選項格式正確
  - [ ] 支援多種 authenticator 類型

#### 2. Registration
- **路徑**: `/api/nextjs-server/fido2-lib/registration`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功註冊 FIDO2 憑證
  - [ ] 驗證 attestation
  - [ ] 錯誤處理

#### 3. Verify
- **路徑**: `/api/nextjs-server/fido2-lib/verify`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功驗證 FIDO2 憑證
  - [ ] 驗證 assertion
  - [ ] 錯誤處理

---

### Firebase Admin API Routes

#### 1. Android Push Notification
- **路徑**: `/api/nextjs-server/firebase-admin/android-push-notification`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功發送 Android 推播
  - [ ] 驗證 token 格式
  - [ ] 錯誤處理

#### 2. iOS Push Notification
- **路徑**: `/api/nextjs-server/firebase-admin/ios-push-notification`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功發送 iOS 推播
  - [ ] 驗證 token 格式
  - [ ] 錯誤處理

#### 3. Web Push Notification
- **路徑**: `/api/nextjs-server/firebase-admin/web-push-notification`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功發送 Web 推播
  - [ ] 驗證 token 格式
  - [ ] 錯誤處理

#### 4. Push Notification (通用)
- **路徑**: `/api/nextjs-server/firebase-admin/push-notification`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功發送推播
  - [ ] 支援多平台
  - [ ] 錯誤處理

#### 5. Register Push Notification Token
- **路徑**: `/api/nextjs-server/firebase-admin/register-push-notification-token`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功註冊 token
  - [ ] 驗證 token 格式
  - [ ] 錯誤處理

#### 6. Get Push Notification Tokens
- **路徑**: `/api/nextjs-server/firebase-admin/get-push-notification-tokens`
- **方法**: GET
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功取得 tokens
  - [ ] 回傳格式正確
  - [ ] 分頁功能

#### 7. Cancel Push Notification Token
- **路徑**: `/api/nextjs-server/firebase-admin/cancel-push-notification-token`
- **方法**: POST/DELETE
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功取消 token
  - [ ] 驗證 token 存在
  - [ ] 錯誤處理

---

### Face Swap API

#### 1. Process
- **路徑**: `/api/face-swap/process`
- **方法**: POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功處理圖片
  - [ ] 人臉偵測正確
  - [ ] 換臉效果良好
  - [ ] 錯誤處理 (無人臉、多人臉等)
  - [ ] 效能測試

---

### Server-Sent Events API

> **更新**: 2025-12-21 - SSE 功能已修復並正常運作

#### 1. Global SSE (GET)
- **路徑**: `/server-sent-event` (獨立路由，非 `/api` 前綴)
- **方法**: GET
- **狀態**: ✅ **測試通過**
- **測試項目**:
  - [x] 成功建立 SSE 連線
  - [x] 接收全域訊息
  - [x] 連線保持穩定
  - [x] 前端顯示「已連線」狀態
- **測試日期**: 2025-12-21
- **備註**: 使用 `useEventSource` hook，channel 設為 `/`

#### 2. Global SSE (POST)
- **路徑**: `/server-sent-event`
- **方法**: POST
- **狀態**: ✅ **測試通過**
- **測試項目**:
  - [x] 成功建立 SSE 連線（POST 方法）
  - [x] 接收全域訊息
  - [x] POST body 資料正確傳遞
  - [x] UI 渲染正常
- **測試日期**: 2025-12-21
- **備註**: 使用 `usePostEventSource` hook

#### 3. Room SSE
- **路徑**: `/server-sent-event/room/[roomId]`
- **方法**: GET
- **狀態**: ✅ **已實作**
- **測試項目**:
  - [x] API 端點已實作
  - [x] 使用 Upstash Redis 儲存訊息
  - [x] Redis key: `nextjs-lab:sse-room-messages-${roomId}`
  - [ ] 多個客戶端測試（待測試）
  - [ ] 連線保持穩定（待測試）

#### 4. Room Send
- **路徑**: `/server-sent-event/room/[roomId]/send`
- **方法**: POST
- **狀態**: ✅ **已實作**
- **測試項目**:
  - [x] API 端點已實作
  - [x] 訊息儲存到 Redis
  - [x] TTL 設定為 1 小時
  - [ ] 訊息廣播到所有客戶端（待測試）
  - [ ] 訊息格式正確（待測試）

#### Redis Key 規範
所有 SSE 相關的 Redis keys 使用 `nextjs-lab:` 前綴：
- `nextjs-lab:sse-room-messages-${roomId}` - 房間訊息（TTL: 1 小時）

---

### WebRTC Signaling API

> **更新**: 2025-12-21 - 使用 SSE + Upstash Redis 實作，所有 Redis keys 使用 `nextjs-lab:` 前綴

#### 1. Join Room
- **路徑**: `/api/web-rtc/join-room`
- **方法**: POST
- **狀態**: ✅ **已實作**
- **測試項目**:
  - [x] API 端點已實作
  - [x] Redis 儲存成員列表
  - [x] Redis keys: 
    - `nextjs-lab:web-rtc-member-list-${roomId}`
    - `nextjs-lab:web-rtc-member-type-${roomId}-${userId}`
  - [ ] 多個 peer 測試（待測試）
  - [ ] 錯誤處理（待測試）

#### 2. Description (Offer/Answer)
- **路徑**: `/api/web-rtc/description`
- **方法**: POST
- **狀態**: ✅ **已實作**
- **測試項目**:
  - [x] API 端點已實作
  - [x] Redis 儲存 SDP descriptions
  - [x] Redis key: `nextjs-lab:web-rtc-member-description-list-${roomId}`
  - [ ] Offer/Answer 格式正確（待測試）
  - [ ] 多個 peer 測試（待測試）

#### 3. Candidate List
- **路徑**: `/api/web-rtc/candidate-list`
- **方法**: POST
- **狀態**: ✅ **已實作**
- **測試項目**:
  - [x] API 端點已實作
  - [x] Redis 儲存 ICE candidates
  - [x] Redis key: `nextjs-lab:web-rtc-member-candidate-list-${roomId}`
  - [ ] Candidate 格式正確（待測試）
  - [ ] 多個 peer 測試（待測試）

#### 4. Subscription (SSE)
- **路徑**: `/api/web-rtc/subscription/[roomId]`
- **方法**: GET, POST
- **狀態**: ✅ **已實作**
- **測試項目**:
  - [x] API 端點已實作（GET + POST）
  - [x] SSE 串流正常
  - [x] 從 Redis 讀取 signaling 資料
  - [ ] 接收 signaling 訊息（待測試）
  - [ ] 連線保持穩定（待測試）

#### Redis Key 規範
所有 WebRTC 相關的 Redis keys 使用 `nextjs-lab:` 前綴，TTL 為 10 分鐘：
- `nextjs-lab:web-rtc-member-list-${roomId}`
- `nextjs-lab:web-rtc-member-type-${roomId}-${userId}`
- `nextjs-lab:web-rtc-member-candidate-list-${roomId}`
- `nextjs-lab:web-rtc-member-description-list-${roomId}`

---

### Socket.IO API

#### 1. Status
- **路徑**: `/api/socket-io/status`
- **方法**: GET
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功取得狀態
  - [ ] 回傳格式正確
  - [ ] 顯示連線數等資訊

---

### 測試用 API

#### 1. Frontend API Cache Test
- **路徑**: `/api/frontend-api-cache-test`
- **方法**: GET/POST
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] GET 請求快取正常
  - [ ] POST 請求不快取
  - [ ] Cache-Control headers 正確

#### 2. Scroll Fetch Test
- **路徑**: `/api/nextjs-server/scroll-fetch-test`
- **方法**: GET
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 分頁功能正常
  - [ ] 回傳資料格式正確
  - [ ] 效能測試

#### 3. About Content
- **路徑**: `/api/about-content`
- **方法**: GET
- **狀態**: ⏳ 待測試
- **測試項目**:
  - [ ] 成功取得內容
  - [ ] 多語言支援
  - [ ] 回傳格式正確

---

## 測試工具

### 推薦工具
1. **Postman** - 完整的 API 測試工具
2. **Thunder Client** (VS Code 擴充) - 輕量級 API 測試
3. **curl** - 命令列測試
4. **Jest + Supertest** - 自動化測試

### 測試腳本範例

#### 使用 curl 測試 SSE
```bash
curl -N http://localhost:3001/api/server-sent-event
```

#### 使用 curl 測試 POST API
```bash
curl -X POST http://localhost:3001/api/web-authn/generate-challenge \
  -H "Content-Type: application/json" \
  -d '{"username": "test"}'
```

---

## 測試進度統計

### 整體進度
- **總 API 數**: 30+
- **已測試**: 0
- **測試通過**: 0
- **測試失敗**: 0
- **待測試**: 30+
- **完成率**: 0%

### 各類別進度
| 類別 | 總數 | 已測試 | 通過 | 失敗 | 待測試 |
|------|------|--------|------|------|--------|
| OAuth | 3 | 0 | 0 | 0 | 3 |
| WebAuthn | 3 | 0 | 0 | 0 | 3 |
| FIDO2 | 3 | 0 | 0 | 0 | 3 |
| Firebase Admin | 7 | 0 | 0 | 0 | 7 |
| Face Swap | 1 | 0 | 0 | 0 | 1 |
| SSE | 3 | 0 | 0 | 0 | 3 |
| WebRTC | 4 | 0 | 0 | 0 | 4 |
| Socket.IO | 1 | 0 | 0 | 0 | 1 |
| 測試用 | 3 | 0 | 0 | 0 | 3 |

---

## 已知問題

### 待修復的問題
> 測試過程中發現的問題將記錄在此

---

## 測試建議

### 測試順序建議
1. **第一階段**: 測試用 API (簡單、無依賴)
2. **第二階段**: OAuth 和 WebAuthn (認證相關)
3. **第三階段**: SSE 和 WebRTC (即時通訊)
4. **第四階段**: Firebase Admin (推播通知)
5. **第五階段**: Face Swap (AI 功能)

### 測試注意事項
1. 確保開發伺服器正在運行 (`yarn dev`)
2. 檢查環境變數是否正確設置
3. 某些 API 需要有效的第三方服務 token (Firebase, OAuth 等)
4. WebRTC 和 SSE 測試需要多個客戶端

---

## 更新日誌

- 2025-12-19: 建立 API 測試結果文件，列出所有待測試的 API
