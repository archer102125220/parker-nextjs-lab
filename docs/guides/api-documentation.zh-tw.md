# API 路由文件

本文件提供 parker-nextjs-lab 專案所有 API 路由的完整說明。

---

## 身份驗證 API

### OAuth 驗證

#### Google OAuth
```
POST /api/google-oauth-verify
```

**請求內容:**
```json
{
  "token": "google_oauth_token"
}
```

**回應:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "使用者名稱",
    "picture": "profile_picture_url"
  }
}
```

---

#### Facebook OAuth
```
POST /api/facebook-oauth-verify
```

**請求內容:**
```json
{
  "accessToken": "facebook_access_token"
}
```

**回應:**
```json
{
  "success": true,
  "user": {
    "id": "fb_user_id",
    "name": "使用者名稱",
    "email": "user@example.com"
  }
}
```

---

#### LINE OAuth
```
POST /api/line-oauth-verify
```

**請求內容:**
```json
{
  "code": "authorization_code",
  "redirectUri": "callback_uri"
}
```

**回應:**
```json
{
  "success": true,
  "user": {
    "userId": "line_user_id",
    "displayName": "顯示名稱",
    "pictureUrl": "profile_picture_url"
  }
}
```

---

## WebAuthn/FIDO2 API

### 註冊

#### 開始註冊
```
POST /api/web-authn/register/init
```

**請求內容:**
```json
{
  "username": "user@example.com"
}
```

**回應:**
```json
{
  "challenge": "base64_challenge",
  "rp": { "name": "App Name", "id": "localhost" },
  "user": { "id": "user_id", "name": "user@example.com" },
  "pubKeyCredParams": [...]
}
```

#### 完成註冊
```
POST /api/web-authn/register/verify
```

**請求內容:**
```json
{
  "credential": { /* PublicKeyCredential 物件 */ }
}
```

---

### 身份驗證

#### 開始驗證
```
POST /api/web-authn/login/init
```

**請求內容:**
```json
{
  "username": "user@example.com"
}
```

#### 完成驗證
```
POST /api/web-authn/login/verify
```

---

## 即時通訊 API

### Server-Sent Events (SSE)

#### GET SSE 端點
```
GET /api/server-sent-event
```

**查詢參數:**
- `clientId` (選填): 唯一客戶端識別碼

**回應:** `text/event-stream`

```
data: {"type":"connected","clientId":"abc123"}

data: {"type":"message","content":"Hello"}

data: {"type":"heartbeat","timestamp":1703500000000}
```

---

#### POST SSE 端點
```
POST /api/server-sent-event
```

**請求內容:**
```json
{
  "message": "來自客戶端的訊息"
}
```

**回應:** `text/event-stream`

---

### WebRTC 信令

#### 信號交換
```
POST /api/web-rtc/signal
```

**請求內容:**
```json
{
  "type": "offer|answer|ice-candidate",
  "roomId": "room_123",
  "data": { /* SDP 或 ICE candidate */ }
}
```

#### 取得房間狀態
```
GET /api/web-rtc/rooms?roomId=room_123
```

---

## AI/ML API

### 換臉功能

#### 處理換臉
```
POST /api/face-swap/process
```

**Content-Type:** `multipart/form-data`

**表單欄位:**
- `sourceImage`: 來源臉部圖片 (File)
- `targetImage`: 目標圖片 (File)

**回應:**
```json
{
  "success": true,
  "resultImage": "base64_encoded_image",
  "processingTime": 1234
}
```

**錯誤回應:**
```json
{
  "success": false,
  "error": "來源圖片中未偵測到臉部"
}
```

---

## 資料庫 API

### 使用者管理

#### 取得使用者
```
GET /api/users
```

**查詢參數:**
- `page` (選填): 頁碼 (預設: 1)
- `limit` (選填): 每頁數量 (預設: 10)

#### 建立使用者
```
POST /api/users
```

**請求內容:**
```json
{
  "name": "使用者名稱",
  "email": "user@example.com"
}
```

---

## Firebase API

### 推播通知

#### 發送通知
```
POST /api/firebase/send-notification
```

**請求內容:**
```json
{
  "token": "fcm_device_token",
  "title": "通知標題",
  "body": "通知內容",
  "data": { /* 選填資料 */ }
}
```

---

## 錯誤處理

所有 API 端點遵循統一的錯誤回應格式：

```json
{
  "success": false,
  "error": "錯誤訊息",
  "code": "ERROR_CODE",
  "details": { /* 選填額外資訊 */ }
}
```

### 常見錯誤代碼

| 代碼 | HTTP 狀態碼 | 說明 |
|------|-------------|------|
| `UNAUTHORIZED` | 401 | 缺少或無效的身份驗證 |
| `FORBIDDEN` | 403 | 權限不足 |
| `NOT_FOUND` | 404 | 資源不存在 |
| `VALIDATION_ERROR` | 400 | 無效的請求資料 |
| `INTERNAL_ERROR` | 500 | 伺服器錯誤 |

---

## 速率限制

API 端點有速率限制以防止濫用：

- **一般 API**: 每分鐘 100 次請求（每 IP）
- **身份驗證 API**: 每分鐘 10 次請求（每 IP）
- **SSE/WebRTC**: 無速率限制（串流連線）

---

## CORS 配置

API 支援以下來源的 CORS：
- `http://localhost:3000`
- `http://localhost:3001`
- `https://localhost:3000`
- 生產環境網域（透過環境變數設定）

---

## 環境變數

API 功能所需的環境變數：

```env
# 資料庫
DATABASE_URL=postgresql://...

# Firebase
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
LINE_CHANNEL_ID=...
LINE_CHANNEL_SECRET=...

# WebRTC (Upstash Redis)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```
