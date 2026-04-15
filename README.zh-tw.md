# Parker 的 Next.js 實驗室

[![GitHub](https://img.shields.io/badge/GitHub-parker--nextjs--lab-blue?logo=github)](https://github.com/archer102125220/parker-nextjs-lab)

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
- **✅ 測試**: 189 個單元測試，使用 Jest + React Testing Library
- **⚡ 效能優化**: Turbopack 支援和效能監控
- **🔐 身份驗證**: WebAuthn/FIDO2 和 OAuth（Google、Facebook、LINE）整合
- **📱 行動優先**: 響應式設計與行動裝置優化
- **🎥 WebRTC**: 使用 SSE 信令的即時視訊聊天
- **🤖 AI/ML**: 使用 face-api.js 的人臉偵測和換臉功能

## 🤖 AI 輔助工具規則

本專案包含 AI 程式碼助理的設定檔，以確保一致的程式碼風格：

- **[GEMINI.md](./GEMINI.md)** - [Gemini Code Assist / Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md#example-context-file-content-eg-geminimd)（[中文文件 - 非官方](https://gemini-cli.gh.miniasp.com/cli/configuration.html#context-%E6%AA%94%E6%A1%88%E5%85%A7%E5%AE%B9%E7%AF%84%E4%BE%8B-%E4%BE%8B%E5%A6%82-gemini-md)）（Google）規則
- **[.agent/rules/](./.agent/rules/)** - [Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity?hl=zh-tw#8)（Google）規則
- **[CLAUDE.md](./CLAUDE.md)** - [Claude Code](http://platform.claude.com/docs/en/agent-sdk/modifying-system-prompts#methods-of-modification)（Anthropic）規則
- **[.cursor/rules/](./.cursor/rules/)** - [Cursor IDE](https://docs.cursor.com/context/rules) 規則
  - `typescript.mdc` - TypeScript 規範
  - `css-naming.mdc` - CSS 命名規範（改良式 BEM）
  - `css-property-order.mdc` - CSS 屬性順序
  - `file-organization.mdc` - 檔案組織標準
  - `inline-styles.mdc` - 行內樣式政策
  - `i18n.mdc` - 國際化規則
  - `react-hooks.mdc` - React Hooks 最佳實踐
  - `react-stable-api.mdc` - React Stable API 政策（避免實驗性語法）
  - `security-policy.mdc` - 安全性政策
  - `lint-policy.mdc` - Lint 禁用註解政策
  - `build-tools.mdc` - 建置與開發工具（強制 Webpack）

> 📖 完整編碼規範：[docs/guides/coding-standards.zh-tw.md](docs/guides/coding-standards.zh-tw.md)

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
   ```bash
   # ⚠️ 使用 Turbopack（請避免 - 與 SCSS :export 不相容）
   # yarn dev
   
   # ✅ 使用 Webpack（強制）
   yarn dev:webpack
   
   # ✅ 使用 HTTPS + Webpack（WebRTC/WebAuthn 必須）
   yarn dev-https:webpack

   yarn dev-https:webpack
   ```

   > ⚠️ **注意**：本專案使用 `styles/scss_variable_export.module.scss` 將 SCSS 變數導出至 JavaScript / TypeScript。Turbopack 目前不支援此功能，因此**建議使用 Webpack 模式**（`yarn dev:webpack` 或 `yarn dev-https:webpack`），直到 Turbopack 支援 SCSS 變數導出為止。

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

> **環境檢查**：啟動開發伺服器時，**務必**檢查 `.env` 中的 `NEXT_PUBLIC_API_BASE` 和 `NEXT_PUBLIC_DOMAIN` 設定是否與 `package.json` 中的啟動指令一致（特別是埠號）。如果不一致（例如：.env 使用 3000 但指令使用 3001），或當 `.env` 被 gitignore 且 IDE 無法讀取時，在此之前**必須**詢問使用者是否確認使用當前 `.env` 設定。

### 資料庫
- `yarn initDB` - 初始化資料庫（刪除、建立、遷移、種子資料）
- `yarn createDB` - 建立資料庫
- `yarn migrate` - 執行資料庫遷移
- `yarn seed` - 載入範例資料到資料庫

### 國際化

**指令：**
- `yarn create-i18n` - 從 Google Sheets 產生 i18n 檔案

**在 App Router 中使用 `next-intl` 4.x：**

本專案使用 `next-intl` 4.x 進行國際化。當建立使用翻譯的 Server Components 頁面時，**必須**在使用任何翻譯函式前調用 `setRequestLocale(locale)`。

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

async function MyPage({ params }: Props) {
  const { locale } = await params;
  
  // 必要：在使用翻譯前設定 locale
  setRequestLocale(locale);
  
  const t = await getTranslations('pages.myPage');
  return <h1>{t('title')}</h1>;
}
```

> ⚠️ **重要**：若未調用 `setRequestLocale`，Server Components 將無法取得正確的語系，翻譯會回退到預設語言。

**語系檔案位置：**
- `i18n/locales/zh-tw.json` - 繁體中文（預設）
- `i18n/locales/en.json` - 英文

### 測試與效能

**測試結構**（業界標準）：
```
__tests__/     # Jest 單元測試（195 測試）
tests/         # Playwright E2E 測試（12 測試）
```

**Jest 單元測試**：
- `yarn test` - 執行所有單元測試（195 測試，19 檔案）
- `yarn test:watch` - 監視模式執行測試
- `yarn test:coverage` - 執行測試並產生覆蓋率報告

**Playwright E2E 測試**：
- `npx playwright test` - 執行所有 E2E 測試（Chromium, Firefox, WebKit）
- `npx playwright test --project=chromium` - 在指定瀏覽器執行
- `npx playwright show-report` - 檢視測試報告

**其他**：
- `yarn stress` - 執行壓力測試
- `yarn lint` - 執行 ESLint

> 📖 詳細文件請參考 [docs/guides/test-structure.zh-tw.md](docs/guides/test-structure.zh-tw.md)

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

### Demo 組件（`components/Demo/`）
用於展示頁面功能的完整 Client Component，採用 PascalCase 命名：

- **BannerDemo**: Banner 輪播組件測試頁面
- **GoTop**: GoTop 回到頂部測試頁面
- **LazyLoadTest**: useLazyLoad Hook 測試頁面
- **RippleTest**: Ripple Component 測試頁面
- **ScrollFetch**: 滾動載入測試頁面（已存在）

> **命名規則**: 
> - 整頁內容的 Client Component → `components/Demo/[PageName].tsx`
> - 多個子組件的頁面 → `components/[PageName]/` 資料夾

> ⚠️ **重要注意事項：動態載入與 SSR**
> 
> ```tsx
> // ✅ 正確：使用 dynamic() 預設行為（啟用 SSR）
> const DemoComponent = dynamic(() => import('@/components/Demo/Example'));
> 
> // ❌ 錯誤：不應該隨意關閉 SSR
> const DemoComponent = dynamic(() => import('@/components/Demo/Example'), { ssr: false });
> ```
> 
> 只有在第三方套件完全無法在 Node.js 環境執行時才使用 `{ ssr: false }`。濫用會導致打包失敗、SEO 受損、效能下降。

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

### useLayoutEffect vs useEffect

當需要將外部 props 同步到內部 state 且會影響**視覺渲染**時（例如：滑動器/輪播位置），使用 `useLayoutEffect` 而非 `useEffect`：

```tsx
// ✅ 正確：防止視覺閃爍
useLayoutEffect(() => {
  setSliderIndex(externalValue);
}, [externalValue]);

// ❌ 錯誤：可能導致視覺閃爍
useEffect(() => {
  setSliderIndex(externalValue);
}, [externalValue]);
```

| 情境 | 使用 |
|------|------|
| 同步 props 到影響**版面/位置**的 state | `useLayoutEffect` |
| 資料獲取、訂閱、計時器 | `useEffect` |
| 繪製前的 DOM 測量 | `useLayoutEffect` |

> ⚠️ **注意**：`useLayoutEffect` 在瀏覽器繪製前同步執行，因此避免執行繁重的計算。

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

> 💡 **注意**:在實際開發中,為了保持代碼簡潔,通常不需要在每個屬性分類前加上註解。只有在複雜的樣式中才建議使用註解來提高可讀性。

### CSS 命名規範

專案採用**改良式 BEM 命名法**，巧妙地犧牲了標準 BEM 的視覺符號（`__`），以換取更高的開發工具雙擊選取效率，並透過 SCSS 拼接和 HTML 屬性來確保其 CSS 權重和狀態管理的語義完整性。

#### 命名結構

- **Block（區塊）**: 使用單一名稱，如 `.countdown`
- **Element（元素）**: 使用單個連字符 `-` 連接 Block 與 Element，如 `.countdown-down_enter`、`.countdown-up_leave`
- **Sub-Element（子元素）**: 使用單個連字符 `-` 連接父元素與子元素，元素名稱內部使用底線 `_` 分隔語義單詞，如：
  - `.countdown-down_enter-down_enter_up`
  - `.image_upload-preview-img`
- **狀態修飾**: 透過 HTML 屬性選擇器管理狀態，如 `[css-is-anime-start='true']`、`[css-is-active='true']`
- **顏色/大小變體**: 使用 HTML 屬性，如 `[css-color='red']`、`[css-size='small']`

#### 關鍵規則

- ❌ **永遠不要使用 `__`（雙底線）或 `--`（雙連字號）**
- ✅ **每個元素只能有一個 className**
- ✅ **使用 HTML 屬性處理狀態和變體**
- ✅ **HTML 屬性必須以 `css-` 開頭**

#### 嚴格巢狀 (Strict Nesting) - 反映 DOM 層級
- **Class 名稱應反映 DOM 的包含層級**（若有助於語境理解）。
- **範例**：如果 `group` 在 `scroll_area` 內部，它應該命名為 `scroll_area-group`，而不僅僅是 `group`（除非 `group` 是一個頂層的獨立抽象）。

```tsx
// ✅ 正確：單一 className + HTML 屬性
<Box className={style.demo_box} css-color="red">
  紅色示範
</Box>

// ❌ 錯誤：多個 className
<Box className={`${style.demo_box} ${style['demo_box--red']}`}>
```

#### 根元素命名規範

為了在瀏覽器開發工具中快速定位問題元素，專案採用以下根元素命名規範：

- **頁面根元素**: 使用 `[頁面名稱]_page` 格式
  - 例如：`.hooks_test_page`, `.socket_io_page`, `.web_rtc_page`
- **組件根元素**: 使用 `[組件名]` 格式
  - 例如：`.scroll_fetch`, `.image_upload`, `.countdown`

**範例**：
```scss
// 頁面 SCSS (app/[locale]/hooks-test/page.module.scss)
.hooks_test_page {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

// 組件 SCSS (components/ScrollFetch/scroll_fetch.scss)
.scroll_fetch {
  position: relative;
  width: 100%;
}
```

#### 優勢

1. ✅ **雙擊選取** - 無 `__` 中斷，可完整選取類別名稱
2. ✅ **SCSS 巢狀** - 透過 `&-element` 維持語義層級關係
3. ✅ **語義清晰** - 使用底線分隔多個語義單詞
4. ✅ **狀態管理** - 使用 HTML 屬性而非 modifier 類別來管理狀態，減少類別數量
5. ✅ **可維護性** - 保持良好的可讀性與維護性
**好處**：
- ✅ 在瀏覽器 DevTools 中一眼就能識別元素來源
- ✅ 快速定位問題所在的文件
- ✅ 便於調試和維護

**重要規則**：
> 📌 **所有屬於該頁面的元素都必須巢狀在頁面根類別下**，這樣看代碼就能清楚看到層級結構。

```scss
// ✅ 正確：所有元素都巢狀在 hooks_test_page 下
.hooks_test_page {
  @extend %test_page;
  
  &-description { }      // .hooks_test_page-description
  &-grid { }             // .hooks_test_page-grid
  &-section {            // .hooks_test_page-section
    &-title { }          // .hooks_test_page-section-title
    &-description { }    // .hooks_test_page-section-description
  }
}

// ❌ 錯誤：看不出 description 和 grid 屬於哪個頁面
.hooks_test_page { }
.description { }
.grid { }
```

---

### 樣式複用策略 (Style Reuse Strategy) - 嚴格模式

專案使用 **SCSS Placeholders（`%name`）** 來實現樣式複用，並遵循嚴格策略以維護唯一的 Class 名稱。

#### 策略規則：
- **單頁複用 (Single Page Reuse)**：在該頁 SCSS 頂部定義 `%placeholder_name` 並在特定元素中使用 `@extend`。
- **多頁複用 (Multi-Page Reuse)**：定義在 `styles/placeholders/` 並使用 `@use` 引入。
- **主要目標**：為每個結構元素維護**唯一且獨立**的 class name，確保能透過 DevTools 快速定位檔案與元素。

#### 為什麼使用 Placeholders？

1. ✅ **減少重複** - 多個選擇器可以繼承相同的樣式
2. ✅ **提高可維護性** - 修改一處即可影響所有繼承的地方
3. ✅ **更好的組織** - 將共用樣式集中管理
4. ✅ **支援響應式** - Placeholders 內可以使用 mixins

#### 使用範例

**定義 Placeholders**：
```scss
// 在組件或頁面的 <style> 區塊頂部定義
%data_block {
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  font-size: 16px;
}

%section_title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 20px 0;

  @include tablet {
    font-size: 20px;
  }
  @include mobile {
    font-size: 18px;
  }
}

%data_field {
  padding: 16px;
  text-align: left;

  @include tablet {
    padding: 12px 8px;
  }
  @include mobile {
    padding: 8px 4px;
  }
}
```

**使用 Placeholders**：
```scss
.index_page {
  &-list_section {
    &-section_title {
      @extend %section_title;  // 繼承共用樣式
    }

    &-loading {
      @extend %data_block;     // 繼承共用樣式
      background-color: #e3f2fd;
      color: #1976d2;
    }

    &-error {
      @extend %data_block;     // 繼承共用樣式
      background-color: #ffebee;
      color: #c62828;
    }

    &-table {
      &-header {
        @extend %data_field;   // 繼承共用樣式
        font-weight: 600;
        color: #ffffff;
      }

      &-cell {
        @extend %data_field;   // 繼承共用樣式
        color: #e1e1e1;
      }
    }
  }
}
```

#### Placeholders vs Mixins

**使用 Placeholders 的時機**：
- ✅ 多個選擇器需要完全相同的樣式
- ✅ 樣式不需要參數（靜態樣式）
- ✅ 想要減少 CSS 輸出大小（選擇器會被合併）

**使用 Mixins 的時機**：
- ✅ 需要參數化的樣式
- ✅ 需要根據使用情況客製化
- ✅ 需要在樣式中使用條件邏輯

**Mixins 範例**（響應式設計）：
```scss
// assets/css/mixin.scss
@mixin mobile {
  @media (max-width: 707px) {
    @content;
  }
}

@mixin tablet {
  @media (max-width: 1140px) {
    @content;
  }
}

// 使用方式
.index_page {
  padding: 20px;

  @include tablet {
    padding: 12px;
  }
  @include mobile {
    padding: 8px;
  }
}
```

---

#### 範例

**範例 1: 基本 Block 與 Element**
```scss
.section {
  /* Block 樣式 */
  padding: 20px;
  background-color: #f5f5f5;
  
  &-title {
    // .section-title (Element 用連字符 - 連接)
    margin-top: 0;
    font-size: 18px;
  }
  
  &-description {
    // .section-description
    color: #666;
    margin-bottom: 15px;
  }
  
  &-content_box {
    // .section-content_box (Element 名稱內部用底線 _ 分隔多個語義詞)
    padding: 15px;
    background: white;
  }
}
```

**範例 2: Block 名稱有多個語義詞**
```scss
.image_upload {
  // Block 名稱內部用底線 _ 分隔
  position: relative;
  
  &-preview {
    // .image_upload-preview (用連字符 - 連接 Element)
    width: 100%;
    
    &-img {
      // .image_upload-preview-img (Sub-Element 再用連字符 - 連接)
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  &-mask {
    // .image_upload-mask
    &[css-is-dragging='true'] {
      opacity: 0.8;
    }
  }
}
```

**範例 3: 狀態管理**
```scss
.dropdown {
  position: relative;
  
  &-menu {
    // .dropdown-menu
    position: absolute;
    
    &-item {
      // .dropdown-menu-item (Sub-Element)
      padding: 8px;
      cursor: pointer;
    }
  }
}

.key_status {
  padding: 10px;
  
  &[data-pressed='true'] {
    // 使用 HTML 屬性管理狀態
    color: white;
  }
}
```

#### HTML 使用範例

**使用 CSS Modules**:
```tsx
import styles from './page.module.scss';

// 範例 1: 基本使用
<div className={styles.section}>
  <h2 className={styles['section-title']}>標題</h2>
  <p className={styles['section-description']}>描述</p>
  <div className={styles['section-content_box']}>
    內容
  </div>
</div>

// 範例 2: 多層結構
<div className={styles.image_upload}>
  <div className={styles['image_upload-preview']}>
    <img className={styles['image_upload-preview-img']} src="..." />
  </div>
  <div className={styles['image_upload-mask']} css-is-dragging="true">
    <p>拖拉圖片到此</p>
  </div>
</div>

// 範例 3: 下拉選單
<div className={styles.dropdown}>
  <div className={styles['dropdown-menu']}>
    <div className={styles['dropdown-menu-item']}>選項 1</div>
    <div className={styles['dropdown-menu-item']}>選項 2</div>
  </div>
</div>
```

#### 重要原則

1. **每個元素都必須有自己的唯一 class** - 這對於以下兩個關鍵原因至關重要：
   - **CSS 主要依賴 class name 進行樣式設定**（而非標籤選擇器）
   - **快速定位 DOM 問題** - 在瀏覽器 DevTools 中立即識別哪個元素有問題
   - ❌ 不好：`.footer-links a { ... }`（針對標籤）
   - ✅ 好：`.footer-link { ... }`（唯一 class）
   - ✅ 例外：動態內容區域（如：`.content p { ... }`）
   - ✅ 例外：第三方內容（如：WangEditor 中的 `:global a { ... }`）
2. **每個元素只使用一個 className** - 不要組合多個類別
3. **Block 內的所有元素都應該是 Block 的子元素** - 使用連字符 `-` 連接
4. **Element 名稱內部的多個語義詞使用底線 `_`** - 如 `content_box`, `value_display`
5. **狀態使用 HTML 屬性** - 如 `[css-is-active='true']`
6. **HTML 屬性必須以 `css-` 開頭** - 如 `css-is-active`, `css-is-dragging`，避免與原生屬性衝突，同時在組件層級傳遞屬性時可明確識別該變數是給 CSS 使用
7. **CSS 變數使用底線 `_` 而非連字符 `-`** - 如 `--editor_height`, `--offset_y`，使編輯器可雙擊快速選取完整變數名稱

#### 內聯樣式例外情況

雖然專案遵循 CSS 模組化和 BEM 命名規範，但以下情況允許使用內聯樣式：

1. **MUI sx prop** - Material-UI 官方提供的樣式覆蓋方法
   ```tsx
   // ✅ 允許：MUI sx prop
   <Box sx={{ padding: 2, marginBottom: 3 }}>
   ```
   > 💡 **原因**：`sx` prop 是 MUI 官方推薦的樣式方法，支持主題系統且不需要 `!important` 覆蓋

2. **CSS 變數傳遞**（包含動態計算值）
   ```tsx
   // ✅ 允許：CSS 變數傳遞靜態或動態值
   <div style={{ '--editor_height': `${height}px` }}>
   <div style={{ '--offset_y': `${offsetY}px` }}>
   ```
   > 💡 **原因**：透過 CSS 變數實現動態值，保持樣式邏輯在 CSS 中，提高組件彈性
   
   ```scss
   // 在 SCSS 中使用 CSS 變數
   .element {
     height: var(--editor_height);
     transform: translateY(var(--offset_y));
   }
   ```

3. **第三方庫要求**
   ```tsx
   // ✅ 允許：Google Tag Manager 等第三方庫要求
   <noscript style={{ display: 'none', visibility: 'hidden' }}>
   ```

**❌ 應避免的內聯樣式**：
- 靜態樣式值（應使用 CSS 類別）
- 動態計算值（應使用 CSS 變數傳遞）
- 可預測的條件樣式（應使用 CSS 屬性選擇器）
- 重複的樣式模式（應提取為 placeholders 或 mixins）


本專案所有組件都遵循這些 CSS 規範，確保代碼風格一致性。

### CSS 檔案組織規範

專案採用**混合式樣式組織**策略，結合全域工具集中管理與組件樣式就近放置的優勢：

#### 目錄結構

```
parker-nextjs-lab/
├── styles/                    # 全域樣式工具（集中管理）
│   ├── globals.scss          # 全域樣式
│   ├── mixin.scss            # Mixins（可重用的樣式函數）
│   ├── placeholders/         # 模組化 placeholders（按類別拆分）
│   │   ├── index.scss        # 入口點（重新匯出所有模組）
│   │   ├── _layout.scss      # 布局工具（test_page, flex 等）
│   │   ├── _text.scss        # 文字工具
│   │   ├── _message.scss     # 訊息/日誌顯示
│   │   ├── _video.scss       # WebRTC room 頁面樣式
│   │   └── _utility.scss     # 通用工具（hidden, image 等）
│   └── variables.scss        # 變數定義
│
├── components/                # 組件特定樣式（就近放置）
│   ├── Button/
│   │   ├── index.tsx
│   │   └── index.scss        # 組件樣式
│   └── Tabs/
│       ├── Bar.tsx
│       └── Bar.scss
│
└── app/                       # 頁面特定樣式（就近放置）
    └── [locale]/
        ├── page.tsx
        └── page.module.scss  # 頁面樣式
```

#### 樣式放置原則

1. **全域工具** → `styles/` 目錄
   - ✅ Mixins（`@mixin`）- 可傳參數的樣式函數
   - ✅ Placeholders（`%placeholder`）- 可擴展的樣式模板
   - ✅ 變數定義
   - ✅ 全域樣式

2. **組件樣式** → 組件目錄內
   - ✅ 與組件檔案放在同一目錄
   - ✅ 使用 `.scss` 或 `.module.scss`
   - ✅ 只包含該組件特定的樣式

3. **頁面樣式** → `app/` 目錄內
   - ✅ 與頁面檔案放在同一目錄
   - ✅ 使用 `.module.scss` 避免全域污染
   - ✅ 只包含該頁面特定的樣式
   - ✅ **每個頁面必須有獨立的根類別名稱**（例如：`.hooks_test_page`、`.socket_io_page`）

> ⚠️ **重要規則**：
> - 禁止在 `app/` 目錄內建立 `_shared` SCSS 目錄。跨頁面共享樣式必須定義在 `styles/placeholders/` 中，並透過 `@use '@/styles/placeholders' as *;` 引入
> - 禁止在多個頁面間共用相同的 CSS 類別名稱（例如：不要在多個頁面使用 `.web_rtc_room_page`）。這有助於在瀏覽器 DevTools 中快速找到對應的檔案。
> - 如果多個頁面有相似的 DOM 結構，請在 `components/` 中建立**可重用組件**，並透過 props 接收 CSS 類別名稱，而非共用單一 CSS 檔案。

#### 範例：組件內部樣式與頁面識別

當組件封裝了整個頁面內容時，組件應該有自己的 SCSS 檔案處理內部樣式。頁面只需傳入 `pageClassName` 用於 DevTools 識別：

```tsx
// components/MyCard/index.tsx
import './index.scss';  // 組件自己的樣式

interface MyCardProps {
  title: string;
  description: string;
  pageClassName?: string;  // 僅用於頁面識別
}

export default function MyCard({ title, description, pageClassName }: MyCardProps) {
  // 合併頁面識別類別與組件內部類別
  const rootClassName = pageClassName 
    ? `${pageClassName} my_card` 
    : 'my_card';

  return (
    <div className={rootClassName}>
      <h2 className="my_card-title">{title}</h2>
      <p className="my_card-description">{description}</p>
    </div>
  );
}
```

```scss
// components/MyCard/index.scss
.my_card {
  padding: 20px;
  
  &-title {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  &-description {
    color: #666;
  }
}
```

```tsx
// app/[locale]/page-a/page.tsx
import MyCard from '@/components/MyCard';
import style from './page.module.scss';

export default function PageA() {
  return (
    <MyCard
      title="頁面 A 標題"
      description="頁面 A 描述"
      pageClassName={style.page_a}  // 只需傳入這一個類別
    />
  );
}
```

```scss
// app/[locale]/page-a/page.module.scss
.page_a {
  // 空白 - 僅用於 DevTools 識別
  // 實際樣式在組件中定義
}
```

在 DevTools 中，元素會顯示：`page_a my_card`，便於同時識別頁面和組件。

#### Placeholders vs Mixins

**Placeholders (`%name`)**：
```scss
// styles/placeholders.scss
%flex {
  display: flex;
}

// 使用
.my-class {
  @extend %flex;  // 會合併選擇器，減少重複 CSS
}
```

**Mixins (`@mixin`)**：
```scss
// styles/mixin.scss
@mixin flex-layout($gap: 12px) {
  display: flex;
  gap: $gap;
}

// 使用
.my-class {
  @include flex-layout(16px);  // 可傳參數，更靈活
}
```

#### 使用範例

```scss
// 在組件 SCSS 中引入全域工具
@use '@/styles/mixin' as *;
@use '@/styles/placeholders' as *;

.my-component {
  @extend %flex;                    // 使用 placeholder
  @include flex-layout(16px);       // 使用 mixin
  
  &-item {
    @extend %text_primary;

    &-item_title {
      //  style
    }
  }

  &-title {
    //  style
  }
}
```

#### 優勢

1. ✅ **集中管理** - 全域工具易於維護和更新
2. ✅ **就近放置** - 組件和頁面樣式易於查找
3. ✅ **避免重複** - Placeholders 減少重複的 CSS 代碼
4. ✅ **靈活性** - Mixins 提供參數化的樣式函數
5. ✅ **可維護性** - 清晰的職責分離

本專案所有樣式檔案都遵循這些組織原則，確保樣式管理的一致性與可維護性。

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

## 🔑 Redis Key 前綴規範

本專案與 [原始 Nuxt 專案](https://github.com/archer102125220/parker-nuxt-lab) 共用 Upstash Redis 實例。為避免 key 衝突，所有 Redis keys 使用 `nextjs-lab:` 前綴。

### Key 命名規範

#### WebRTC Keys
```typescript
// 房間成員列表
`nextjs-lab:web-rtc-member-list-${roomId}`

// 個別成員類型 (Offer/Answer)
`nextjs-lab:web-rtc-member-type-${roomId}-${userId}`

// ICE Candidate 列表
`nextjs-lab:web-rtc-member-candidate-list-${roomId}`

// SDP Description 列表
`nextjs-lab:web-rtc-member-description-list-${roomId}`
```

#### SSE Keys
```typescript
// 房間訊息
`nextjs-lab:sse-room-messages-${roomId}`
```

### TTL 設定

| Key Pattern | 用途 | TTL |
|------------|------|-----|
| `nextjs-lab:web-rtc-*` | WebRTC 信令資料 | 10 分鐘 |
| `nextjs-lab:sse-room-messages-*` | SSE 房間訊息 | 1 小時 |

### 專案區分

| 專案 | Redis Key 前綴 |
|------|---------------|
| parker-nuxt-lab | (無前綴) |
| parker-nextjs-lab | `nextjs-lab:` |

這樣兩個專案可以安全地共用同一個 Upstash Redis 實例，不會互相干擾。

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
UPSTASH_REDIS_V2_REST_URL=your-redis-url
UPSTASH_REDIS_V2_REST_TOKEN=your-redis-token
```

## 🚀 部署

### Vercel（推薦）
1. 將 GitHub 倉庫連接到 Vercel
2. 在 Vercel 儀表板中配置環境變數
3. 推送到主分支時自動部署

### 注意事項
- WebSocket/Socket.IO 功能需要非 serverless 環境
- 在 Vercel 上使用 SSE 信令進行 WebRTC

## 📚 文件

更詳細的文件請參考 [docs](./docs/) 資料夾：

| 文件 | 說明 |
|------|------|
| [API 文件](./docs/guides/api-documentation.md) | 所有 API 端點與請求/回應範例 |
| [組件目錄](./docs/guides/component-catalog.zh-tw.md) | 完整組件使用指南 |
| [部署指南](./docs/guides/deployment-guide.md) | Vercel、Docker 與手動部署 |
| [程式碼規範](./docs/guides/coding-standards.zh-tw.md) | CSS、TypeScript 與命名規範 |
| [文件索引](./docs/README.md) | 所有文件分類索引 |

## ✅ 測試

本專案包含完整的單元測試：

```bash
# 執行所有測試
yarn test

# 監視模式
yarn test:watch

# 產生覆蓋率報告
yarn test:coverage
```

### 測試統計
- **總測試數**: 189
- **測試檔案**: 18
- **通過率**: 100%
- **執行時間**: ~8s

### 已測試組件
- **表單**: DatePicker, PhoneInput, ImageUpload, Selector, SwitchButton
- **UI**: Banner, Countdown, DialogModal, SlideInPanel, Tabs, LoadingBar
- **工具**: QRCode, PWALoading
- **Hooks**: useDebounce, useThrottle, useLocalStorage, useMediaQuery, useIntersectionObserver

## 🤖 AI Agent 規則

本專案包含 AI Agent（Claude、Cursor 等）的程式碼規則，以確保一致的程式碼生成：

### 規則檔案

| 檔案 | 用途 |
|------|------|
| `CLAUDE.md` | Claude AI 快速參考 |
| `.cursor/rules/css-naming.mdc` | CSS/SCSS 命名規範 |
| `.cursor/rules/css-property-order.mdc` | CSS 屬性順序 |
| `.cursor/rules/security-policy.mdc` | 資安警告政策 |
| `.cursor/rules/lint-policy.mdc` | Lint 禁用註解政策 |
| `.cursor/rules/typescript.mdc` | TypeScript 型別安全規則 |
| `.cursor/rules/i18n.mdc` | 國際化規則 |

### 相關文件

| 文件 | 說明 |
|------|------|
| [程式碼規範](./docs/guides/coding-standards.md) | 完整程式碼規範 (English) |
| [程式碼規範 (中文)](./docs/guides/coding-standards.zh-tw.md) | 完整程式碼規範 |
| [前端測試設計指南](./docs/guides/frontend-testing-guide.md) | 測試設計原則 (English) |
| [前端測試設計指南 (中文)](./docs/guides/frontend-testing-guide.zh-tw.md) | 測試設計原則 |

> 💡 人類開發者也可以參考這些規則以維持一致的程式碼風格。

## 📝 授權

此專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

---

**Parker 的 Next.js 實驗室** - 現代網頁開發展示

