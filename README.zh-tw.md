# Parker 的 Next.js 實驗室

[English README](./README.md)

一個展示現代網頁開發實踐的綜合性 Next.js 實驗室專案，包含國際化、Firebase 整合和自定義組件庫。

## 🌟 功能特色

- **🌍 國際化**: 完整的英文和繁體中文支援
- **🔥 Firebase 整合**: 完整的 Firebase 生態系統，包含 Admin SDK、Messaging 和 Analytics
- **📱 PWA 支援**: 使用 Serwist 實作 Service Worker
- **🎨 Material-UI**: 現代化 UI 組件與自定義主題
- **🗄️ 資料庫**: PostgreSQL 搭配 Sequelize ORM
- **📊 分析工具**: Google Analytics 和 Google Tag Manager 整合
- **🔧 自定義組件**: 可重複使用的組件庫，包含 Dialog、Drawer、ScrollFetch 和 Swiper
- **⚡ 效能優化**: Turbopack 支援和效能監控
- **🔐 身份驗證**: WebAuthn/FIDO2 整合的現代化身份驗證
- **📱 行動優先**: 響應式設計與行動裝置優化

## 🚀 快速開始

### 前置需求

- Node.js 18+
- Yarn 套件管理器
- PostgreSQL 資料庫
- Firebase 專案（用於 Firebase 功能）

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
   cp .env.example .env.local
   ```
   在 `.env.local` 中設定環境變數：
   - 資料庫連線設定
   - Firebase 配置
   - Google Analytics/Tag Manager ID

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
   # 標準開發模式
   yarn dev
   
   # 使用 Turbopack（更快）
   yarn dev:turbopack
   
   # 使用 HTTPS
   yarn dev-https
   ```

   開啟 [http://localhost:3001](http://localhost:3001) 查看應用程式。

## 📁 專案結構

```
├── app/                          # Next.js App Router
│   ├── [locale]/                # 國際化路由
│   │   ├── components/          # 組件展示
│   │   ├── firebase/           # Firebase 整合
│   │   └── one/                # 單頁展示
│   ├── api/                     # API 路由
│   └── layout.tsx              # 根佈局
├── components/                   # 可重複使用組件
│   ├── Dialog/                  # 自定義對話框組件
│   ├── Drawer/                  # 自定義抽屜組件
│   ├── ScrollFetch/             # 無限滾動組件
│   ├── SwiperJs/                # Swiper.js 整合
│   ├── FirebaseInit/            # Firebase 初始化
│   └── Google/                  # Google 服務整合
├── hooks/                       # 自定義 React hooks
├── i18n/                        # 國際化
│   └── locales/                 # 翻譯檔案
├── services/                    # 外部服務整合
├── store/                       # Redux store 配置
├── utils/                       # 工具函數
└── styles/                      # 全域樣式和主題
```

## 🛠️ 可用指令

### 開發
- `yarn dev` - 啟動開發伺服器
- `yarn dev:turbopack` - 使用 Turbopack 啟動（更快的建置）
- `yarn dev-https` - 使用 HTTPS 支援啟動

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

## 🎨 組件庫

### 核心組件
- **Dialog**: 可自定義的模態對話框
- **Drawer**: 側邊導航抽屜
- **ScrollFetch**: 帶資料獲取的無限滾動
- **SwiperJs**: 觸控滑動器整合

### 佈局組件
- **Header/Footer**: 網站導航
- **PageLoading**: 載入狀態
- **Message**: 吐司通知

## 📊 分析與追蹤

- **Google Analytics 4**: 使用者行為分析
- **Google Tag Manager**: 標籤管理
- **Vercel Analytics**: 效能監控
- **自定義事件**: GTM 整合用於自定義追蹤

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
```

### Next.js 配置
專案使用：
- **next-intl**: 國際化
- **Serwist**: Service Worker/PWA
- **SCSS**: 帶全域變數和混入的樣式

## 🔀 Middleware 架構

本專案實現了受 Nuxt.js 啟發的模組化 middleware 系統，允許集中式路由處理與可重複使用的 middleware 模組。

### 結構

```
├── proxy.ts                      # Middleware 主入口（在 middleware.ts 中註冊）
├── proxy/                        # 全域 middleware 模組
│   ├── contentSecurityPolicy.ts  # CSP 標頭
│   ├── globalTest.ts            # 全域測試 middleware
│   ├── i18n.ts                  # 國際化
│   └── log.ts                   # 請求日誌
└── app/[locale]/
    ├── one/proxy.ts             # 頁面專用 middleware 範例
    └── web-rtc/proxy.ts         # WebRTC UUID 生成 middleware
```

### 運作原理

1. **全域 Middleware**（`proxy/`）：套用至所有路由
2. **頁面專用 Middleware**（`app/[locale]/{page}/proxy.ts`）：套用至特定路由前綴
3. **註冊**：所有 middleware 必須在 `proxy.ts` 中註冊

### 註冊範例

```typescript
// proxy.ts
import { proxy as webRtcMiddleware } from '@/app/[locale]/web-rtc/proxy';

const MIDDLEWARE_SETTINGS: Array<MiddlewareSetting> = [
  { patch: '/web-rtc', handler: webRtcMiddleware }
];
```

### 建立頁面 Middleware

```typescript
// app/[locale]/your-page/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // 你的 middleware 邏輯
  return NextResponse.next();
}
```

### Middleware 類型

| 類型 | 位置 | 用途 |
|------|------|------|
| Policy | `proxy/` + `POLICY_MIDDLEWARE_SETTINGS` | 安全標頭（CSP） |
| Global | `proxy/` + `GLOBAL_MIDDLEWARE_SETTINGS` | i18n、日誌 |
| Page | `app/[locale]/{page}/proxy.ts` | 路由專用邏輯 |

## �🚀 部署

### Vercel（推薦）
1. 將 GitHub 倉庫連接到 Vercel
2. 在 Vercel 儀表板中配置環境變數
3. 推送到主分支時自動部署

### 其他平台
專案可部署到任何支援 Node.js 的平台：
- Railway
- Heroku
- DigitalOcean App Platform
- AWS/GCP/Azure

## 🤝 貢獻

1. Fork 此倉庫
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📝 授權

此專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 🙏 致謝

- [Next.js](https://nextjs.org/) - React 框架
- [Material-UI](https://mui.com/) - React 組件庫
- [Firebase](https://firebase.google.com/) - 後端服務
- [Serwist](https://serwist.pages.dev/) - Service Worker 函式庫
- [next-intl](https://next-intl-docs.vercel.app/) - 國際化

---

**Parker 的 Next.js 實驗室** - 現代網頁開發展示
