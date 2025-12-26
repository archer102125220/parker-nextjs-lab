# API Routes Documentation

This document provides comprehensive documentation for all API routes in the parker-nextjs-lab project.

---

## Authentication APIs

### OAuth Verification

#### Google OAuth
```
POST /api/google-oauth-verify
```

**Request Body:**
```json
{
  "token": "google_oauth_token"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "profile_picture_url"
  }
}
```

---

#### Facebook OAuth
```
POST /api/facebook-oauth-verify
```

**Request Body:**
```json
{
  "accessToken": "facebook_access_token"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "fb_user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

---

#### LINE OAuth
```
POST /api/line-oauth-verify
```

**Request Body:**
```json
{
  "code": "authorization_code",
  "redirectUri": "callback_uri"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "userId": "line_user_id",
    "displayName": "Display Name",
    "pictureUrl": "profile_picture_url"
  }
}
```

---

## WebAuthn/FIDO2 APIs

### Registration

#### Start Registration
```
POST /api/web-authn/register/init
```

**Request Body:**
```json
{
  "username": "user@example.com"
}
```

**Response:**
```json
{
  "challenge": "base64_challenge",
  "rp": { "name": "App Name", "id": "localhost" },
  "user": { "id": "user_id", "name": "user@example.com" },
  "pubKeyCredParams": [...]
}
```

#### Complete Registration
```
POST /api/web-authn/register/verify
```

**Request Body:**
```json
{
  "credential": { /* PublicKeyCredential object */ }
}
```

---

### Authentication

#### Start Authentication
```
POST /api/web-authn/login/init
```

**Request Body:**
```json
{
  "username": "user@example.com"
}
```

#### Complete Authentication
```
POST /api/web-authn/login/verify
```

---

## Real-time Communication APIs

### Server-Sent Events (SSE)

#### GET SSE Endpoint
```
GET /api/server-sent-event
```

**Query Parameters:**
- `clientId` (optional): Unique client identifier

**Response:** `text/event-stream`

```
data: {"type":"connected","clientId":"abc123"}

data: {"type":"message","content":"Hello"}

data: {"type":"heartbeat","timestamp":1703500000000}
```

---

#### POST SSE Endpoint
```
POST /api/server-sent-event
```

**Request Body:**
```json
{
  "message": "Hello from client"
}
```

**Response:** `text/event-stream`

---

### WebRTC Signaling

#### Signal Exchange
```
POST /api/web-rtc/signal
```

**Request Body:**
```json
{
  "type": "offer|answer|ice-candidate",
  "roomId": "room_123",
  "data": { /* SDP or ICE candidate */ }
}
```

#### Get Room Status
```
GET /api/web-rtc/rooms?roomId=room_123
```

---

## AI/ML APIs

### Face Swap

#### Process Face Swap
```
POST /api/face-swap/process
```

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `sourceImage`: Source face image (File)
- `targetImage`: Target image (File)

**Response:**
```json
{
  "success": true,
  "resultImage": "base64_encoded_image",
  "processingTime": 1234
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "No face detected in source image"
}
```

---

## Database APIs

### User Management

#### Get Users
```
GET /api/users
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Create User
```
POST /api/users
```

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com"
}
```

---

## Firebase APIs

### Push Notifications

#### Send Notification
```
POST /api/firebase/send-notification
```

**Request Body:**
```json
{
  "token": "fcm_device_token",
  "title": "Notification Title",
  "body": "Notification body content",
  "data": { /* optional payload */ }
}
```

---

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* optional additional info */ }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General APIs**: 100 requests/minute per IP
- **Authentication APIs**: 10 requests/minute per IP
- **SSE/WebRTC**: No rate limit (streaming connections)

---

## CORS Configuration

The API supports CORS for the following origins:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://localhost:3000`
- Production domain (configured via environment)

---

## Environment Variables

Required environment variables for API functionality:

```env
# Database
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
