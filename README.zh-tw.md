# Parker 的 Next.js 實驗室

[English README](./README.md)

一個展示現代網頁開發實踐的綜合性 Next.js 實驗室專案，包含國際化、Firebase 整合和自定義組件庫。

## 🌟 功能特色

- **🌍 國際化**: 完整的英文和繁體中文支援
- **🔥 Firebase 整合**: 完整的 Firebase 生態系統，包含 Admin SDK、Messaging 和 Analytics
- **📱 PWA 支援**: 使用 Serwist 實作 Service Worker，具備離線備援頁面
- **🎨 Material-UI**: 現代化 UI 組件與自定義主題
- **🗄️ 資料庫**: PostgreSQL 搭配 Sequelize ORM
- **📊 分析工具**: Google Analytics 和 Google Tag Manager 整合
- **🔧 自定義組件**: 40+ 可重複使用的組件庫
- **⚡ 效能優化**: Turbopack 支援和效能監控
- **🔐 身份驗證**: WebAuthn/FIDO2 和 OAuth（Google、Facebook、LINE）整合
- **📱 行動優先**: 響應式設計與行動裝置優化
- **🎥 WebRTC**: 使用 SSE 信令的即時視訊聊天
- **🤖 AI/ML**: 使用 face-api.js 的人臉偵測和換臉功能

## 🚀 快速開始

### 前置需求

- Node.js 18+
- Yarn 套件管理器
- PostgreSQL 資料庫
- Firebase 專案（用於 Firebase 功能）
- Upstash Redis（用於 WebRTC 信令）

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd parker-nextjs-lab
   ```

2. **安裝依賴套件**
   ```bash
   yarn install
   ```

3. **環境設定**
   ```bash
   cp .env.example .env
   ```
   在 `.env` 中設定環境變數：
   - 資料庫連線設定
   - Firebase 配置
   - Google Analytics/Tag Manager ID
   - Upstash Redis 憑證

4. **資料庫設定**
   ```bash
   # 初始化資料庫
   yarn initDB
   
   # 或分步驟執行
   yarn createDB
   yarn migrate
   yarn seedAll
   ```

5. **啟動開發伺服器**
   ```bash
   # 使用 Turbopack（預設，較快）
   yarn dev
   
   # 使用 Webpack
   yarn dev:webpack
   
   # 使用 HTTPS + Turbopack（WebRTC/WebAuthn 必須）
   yarn dev-https
   
   # 使用 HTTPS + Webpack
   yarn dev-https:webpack
   ```

   開啟 [http://localhost:3001](http://localhost:3001)（或 HTTPS 使用 https://localhost:3000）查看應用程式。

## 📁 專案結構

```
├── app/                          # Next.js App Router
│   ├── [locale]/                 # 國際化路由
│   │   ├── components/           # 組件展示（40+ 範例）
│   │   ├── css-drawing/          # CSS 藝術與繪圖
│   │   ├── directive-effects/    # DOM 操作展示
│   │   ├── face-swap/            # AI 換臉（前端/後端）
│   │   ├── firebase/             # Firebase 整合展示
│   │   ├── hooks-test/           # 自定義 hooks 展示
│   │   ├── server-sent-event-test/ # SSE 訊息展示
│   │   ├── socket-test/          # Socket.IO 與 WebSocket 展示
│   │   ├── web-authn/            # WebAuthn/FIDO2 身份驗證
│   │   ├── web-cam/              # 相機串流展示
│   │   └── web-rtc/              # WebRTC 視訊聊天
│   └── api/                      # API 路由
│       ├── facebook-oauth-verify/
│       ├── google-oauth-verify/
│       ├── line-oauth-verify/
│       ├── face-swap/process/
│       ├── server-sent-event/    # SSE 端點
│       ├── web-rtc/              # WebRTC 信令 API
│       └── web-authn/            # WebAuthn 端點
├── components/                   # 可重複使用組件（40+）
│   ├── Animation/               # 動畫組件
│   ├── Banner/                  # 輪播橫幅
│   ├── Dialog/                  # 模態對話框
│   ├── Drawer/                  # 側邊導航
│   ├── ScrollFetch/             # 無限滾動
│   ├── SwiperJs/                # 觸控滑動器
│   ├── VirtualScroller/         # 虛擬列表
│   └── ...                      # 更多組件
├── hooks/                       # 自定義 React hooks（28+）
│   ├── useCameraStream.ts       # 相機存取
│   ├── useEventSource.ts        # SSE 客戶端
│   ├── useWebSocket.ts          # WebSocket 客戶端
│   ├── useSocketIoClient.ts     # Socket.IO 客戶端
│   └── ...                      # 更多 hooks
├── proxy/                       # Middleware 模組
├── proxy.ts                     # Middleware 入口點
├── i18n/                        # 國際化
├── services/                    # 外部服務整合
├── store/                       # Redux store 配置
└── utils/                       # 工具函數
```

## 🛠️ 可用指令

### 開發
- `yarn dev` - 使用 Turbopack 啟動（埠 3001，預設）
- `yarn dev:webpack` - 使用 Webpack 打包器啟動
- `yarn dev-https` - 使用 HTTPS + Turbopack（埠 3000）
- `yarn dev-https:webpack` - 使用 HTTPS + Webpack

### 資料庫
- `yarn initDB` - 初始化資料庫（刪除、建立、遷移、種子資料）
- `yarn createDB` - 建立資料庫
- `yarn migrate` - 執行資料庫遷移
- `yarn seed` - 載入範例資料到資料庫

### 國際化
- `yarn create-i18n` - 從 Google Sheets 產生 i18n 檔案

### 測試與效能
- `yarn stress` - 執行壓力測試
- `yarn lint` - 執行 ESLint

### 建置與部署
- `yarn build` - 建置生產版本
- `yarn start` - 啟動生產伺服器

## 🌍 國際化

專案支援多語言，並具備自動語言偵測：

- **英文** (預設): `/en/`
- **繁體中文**: `/zh-tw/`

翻譯檔案位於 `i18n/locales/`，可透過 Google Sheets 整合進行管理。

## 🔥 Firebase 功能

- **身份驗證**: 使用者管理和 WebAuthn 支援
- **Firestore**: 即時資料庫
- **Cloud Messaging**: 推播通知
- **Analytics**: 使用者行為追蹤
- **Admin SDK**: 伺服器端 Firebase 操作

## 🎨 組件庫（40+）

### 核心組件
- **Dialog**: 可自定義的模態對話框
- **Drawer**: 側邊導航抽屜
- **ScrollFetch**: 帶資料獲取的無限滾動
- **SwiperJs/SwiperCustom**: 觸控滑動器整合
- **VirtualScroller**: 效能優化的虛擬列表
- **Banner**: 輪播橫幅組件

### 表單組件
- **DatePicker**: 日期選擇器
- **PhoneInput**: 電話號碼輸入與驗證
- **EnterLabel**: 動畫輸入標籤
- **Selector**: 自定義下拉選單
- **SwitchButton**: 切換開關
- **ImageUpload**: 圖片上傳與預覽

### UI 組件
- **Animation**: 各種動畫效果
- **Countdown**: 倒數計時器
- **GoTop**: 返回頂部按鈕
- **Hexagon/Triangle**: CSS 形狀組件
- **LoadingBar**: 進度指示器
- **SkeletonLoader**: 載入佔位符
- **Ripple**: Material 漣漪效果
- **Tabs**: 分頁導航
- **SlideInPanel**: 滑入面板

### 工具組件
- **QRCode**: QR Code 生成器
- **Youtube**: YouTube 播放器整合
- **WangEditor**: 富文本編輯器
- **NotificationPermission**: 推播通知提示

## 🪝 自定義 Hooks（28+）

| Hook | 說明 |
|------|------|
| `useCameraStream` | 相機/麥克風存取 |
| `useEventSource` | SSE 客戶端（GET） |
| `usePostEventSource` | SSE 客戶端（POST） |
| `useWebSocket` | WebSocket 客戶端 |
| `useSocketIoClient` | Socket.IO 客戶端 |
| `useDebounce` | 防抖值 |
| `useThrottle` | 節流值 |
| `useLocalStorage` | localStorage 同步 |
| `useSessionStorage` | sessionStorage 同步 |
| `useMediaQuery` | 響應式斷點 |
| `useMobile/useTablet` | 裝置偵測 |
| `useIntersectionObserver` | 可視區域偵測 |
| `useLazyLoad` | 圖片懶加載 |
| `useClickOutside` | 點擊外部偵測 |
| `useKeyPress` | 鍵盤事件 |
| `useInterval/useTimeout` | 計時器 hooks |
| `useWindowSize` | 視窗尺寸 |
| `useBeforeunload` | 離開頁面警告 |
| `useYoutube` | YouTube API 整合 |
| `useFacebook` | Facebook SDK |
| `useFirebase` | Firebase 工具 |
| `useGTMTrack` | GTM 事件追蹤 |

## 💎 TypeScript 最佳實踐

本專案採用**嚴格的型別安全**標準，完全避免使用 `any` 型別。

### 核心原則

#### ❌ 避免使用 `any`
```typescript
// ❌ 不好的做法
function processData(data: any) {
  return data.value;
}

// ✅ 好的做法
function processData<T extends { value: unknown }>(data: T) {
  return data.value;
}
```

#### ✅ 使用精確的型別定義
```typescript
// ✅ 使用官方型別定義
import type * as faceApi from 'face-api.js';

export async function detectFace(
  image: faceApi.TNetInput
): Promise<faceApi.WithFaceLandmarks<...> | null>
```

#### ✅ 型別斷言使用 `as unknown as`
```typescript
// ✅ 雙重斷言（比 as any 更安全）
const element = document.getElementById('id') as unknown as CustomElement;

// ❌ 避免直接使用 as any
const element = document.getElementById('id') as any;
```

### 實際應用範例

#### Face Swap API 型別安全實作

```typescript
// utils/third-party/face-swap.ts

// 1. 使用官方型別定義
import type * as faceApi from 'face-api.js';

// 2. 明確的函式簽名
export async function detectFace(
  image: faceApi.TNetInput
): Promise<faceApi.WithFaceLandmarks<
  { detection: faceApi.FaceDetection },
  faceApi.FaceLandmarks68
> | null> {
  const detection = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks();
  
  return detection || null;
}

// 3. 型別斷言需要時使用 as unknown as
// 原因：node-canvas 型別與瀏覽器型別不同，但執行時相容
faceapi.env.monkeyPatch({
  Canvas: Canvas as unknown as typeof HTMLCanvasElement,
  Image: Image as unknown as typeof HTMLImageElement,
  ImageData: ImageData as unknown as typeof globalThis.ImageData
});
```

### 為什麼避免 `any`？

| 使用 `any` | 使用精確型別 |
|-----------|------------|
| ❌ 失去型別檢查 | ✅ 編譯時錯誤偵測 |
| ❌ 無法自動完成 | ✅ IDE 智能提示 |
| ❌ 重構困難 | ✅ 安全重構 |
| ❌ 執行時錯誤 | ✅ 編譯時錯誤 |

### 型別斷言指南

#### 何時使用型別斷言？

1. **第三方庫型別不匹配**（如 node-canvas vs 瀏覽器 Canvas）
2. **DOM 操作**（需要特定元素型別）
3. **動態載入模組**（型別定義不完整）

#### 如何安全地使用？

```typescript
// ✅ 使用 as unknown as（雙重斷言）
const value = input as unknown as TargetType;

// ✅ 添加註解說明原因
// Type assertion: node-canvas Image is compatible with TNetInput at runtime
const detection = await detectFace(img as unknown as faceApi.TNetInput);
```

本專案所有程式碼都遵循這些型別安全原則，確保程式碼品質與可維護性。

## 🎨 CSS 開發規範

### CSS 屬性順序規範

專案遵循主流 CSS 屬性排序標準，以確保代碼一致性與可維護性：

1. **Positioning** (position, top, left, z-index...)
2. **Display & Box Model** (display, flex, width, margin, padding, border...)
3. **Typography** (font, color, text-align...)
4. **Visual** (background, box-shadow, opacity...)
5. **Animation** (transition, animation...)
6. **Misc** (cursor, content...)

**範例**：
```scss
.example {
  /* Positioning */
  position: relative;
  top: 0;
  z-index: 10;

  /* Display & Box Model */
  display: flex;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;

  /* Typography */
  font-size: 16px;
  color: #333;

  /* Visual */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  /* Animation */
  transition: all 0.3s;

  /* Misc */
  cursor: pointer;
}
```

### CSS 命名規範

專案採用**改良式 BEM 命名法**，巧妙地犧牲了標準 BEM 的視覺符號（`__`），以換取更高的開發工具雙擊選取效率，並透過 SCSS 拼接和 HTML 屬性來確保其 CSS 權重和狀態管理的語義完整性。

#### 命名結構

- **Block（區塊）**: 使用單一名稱，如 `.countdown`
- **Element（元素）**: 使用單個連字符 `-` 連接 Block 與 Element，如 `.countdown-down_enter`、`.countdown-up_leave`
- **Sub-Element（子元素）**: 使用單個連字符 `-` 連接父元素與子元素，元素名稱內部使用底線 `_` 分隔語義單詞，如：
  - `.countdown-down_enter-down_enter_up`
  - `.image_upload_preview_img`
- **狀態修飾**: 透過 HTML 屬性選擇器管理狀態，如 `[css-is-anime-start='true']`、`[css-is-active='true']`

#### 優勢

1. ✅ **雙擊選取** - 無 `__` 中斷，可完整選取類別名稱
2. ✅ **SCSS 巢狀** - 透過 `&-element` 維持語義層級關係
3. ✅ **語義清晰** - 使用底線分隔多個語義單詞
4. ✅ **狀態管理** - 使用 HTML 屬性而非 modifier 類別來管理狀態，減少類別數量
5. ✅ **可維護性** - 保持良好的可讀性與維護性

#### 範例

```scss
.countdown {
  &-down_enter {
    // .countdown-down_enter
    &-down_enter_up {
      // .countdown-down_enter-down_enter_up
      &[css-is-anime-start='true'] {
        animation: flip-up 1s;
      }
    }
  }
}

.image_upload {
  &_preview {
    // .image_upload_preview
    &_img {
      // .image_upload_preview_img
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  &_mask {
    // .image_upload_mask
    &[css-is-dragging='true'] {
      opacity: 0.8;
    }
  }
}
```

#### HTML 使用範例

```tsx
<div className="image_upload">
  <div className="image_upload_preview">
    <img className="image_upload_preview_img" src="..." />
  </div>
  <div className="image_upload_mask" css-is-dragging="true">
    <p>拖拉圖片到此</p>
  </div>
</div>
```

本專案所有組件都遵循這些 CSS 規範，確保代碼風格一致性。

// ✅ 使用型別守衛
function isCustomType(value: unknown): value is CustomType {
  return typeof value === 'object' && value !== null && 'property' in value;
}
```

### 專案中的型別安全實例

- ✅ **Face Swap API**: 完全型別安全，無 `any` 使用
- ✅ **Custom Hooks**: 所有 hooks 都有明確的泛型定義
- ✅ **API Routes**: 使用 TypeScript 介面定義請求/回應
- ✅ **Components**: Props 使用介面定義，支援 IntelliSense



## 🔀 Middleware 架構

本專案實現了受 Nuxt.js 啟發的模組化 middleware 系統。

### 結構

```
├── proxy.ts                      # Middleware 主入口
├── proxy/                        # 全域 middleware 模組
│   ├── contentSecurityPolicy.ts  # CSP 標頭
│   ├── globalTest.ts             # 全域測試 middleware
│   ├── i18n.ts                   # 國際化
│   └── log.ts                    # 請求日誌
└── app/[locale]/
    ├── one/proxy.ts              # 頁面專用 middleware
    └── web-rtc/proxy.ts          # WebRTC UUID 生成
```

### 運作原理

1. **Policy Middleware**: 安全標頭（CSP）
2. **Global Middleware**: i18n、日誌
3. **Page Middleware**: 路由專用邏輯（UUID 生成、驗證）

### 註冊

```typescript
// proxy.ts
import { proxy as webRtcMiddleware } from '@/app/[locale]/web-rtc/proxy';

const MIDDLEWARE_SETTINGS = [
  { patch: '/web-rtc', handler: webRtcMiddleware }
];
```

## 📡 API 路由

### OAuth 驗證
- `POST /api/facebook-oauth-verify` - Facebook 權杖驗證
- `POST /api/google-oauth-verify` - Google ID Token 驗證
- `POST /api/line-oauth-verify` - LINE 權杖驗證

### WebRTC 信令（SSE + Upstash Redis）
- `POST /api/web-rtc/join-room` - 加入 WebRTC 房間
- `POST /api/web-rtc/candidate-list` - ICE 候選交換
- `POST /api/web-rtc/description` - SDP Offer/Answer 交換
- `GET /api/web-rtc/subscription/[roomId]` - SSE 訂閱

### Server-Sent Events
- `GET /api/server-sent-event` - 全域 SSE 串流
- `GET /api/server-sent-event/room/[roomId]` - 房間 SSE 串流
- `POST /api/server-sent-event/room/[roomId]/send` - 發送房間訊息

### WebAuthn
- `POST /api/web-authn/register` - 開始註冊
- `POST /api/web-authn/authenticate` - 開始驗證

## 🔧 配置

### 環境變數
```bash
# 資料庫
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# Upstash Redis（WebRTC 用）
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## 🚀 部署

### Vercel（推薦）
1. 將 GitHub 倉庫連接到 Vercel
2. 在 Vercel 儀表板中配置環境變數
3. 推送到主分支時自動部署

### 注意事項
- WebSocket/Socket.IO 功能需要非 serverless 環境
- 在 Vercel 上使用 SSE 信令進行 WebRTC

## 📝 授權

此專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

---

**Parker 的 Next.js 實驗室** - 現代網頁開發展示
