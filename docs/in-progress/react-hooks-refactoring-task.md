# React Hooks Refactoring - 進度追蹤

## 📊 總覽

| 分類 | 總數 | 已完成 | 進行中 |
|------|------|--------|--------|
| Hooks | 32 | 32 | 0 |
| Components | 110+ | 25 | 0 |
| App Pages | 63 | 0 | 0 |

---

## 🪝 Hooks (32 個)

### 已完成（無需修改）
- [x] `useDayjs.ts` ✅ OK
- [x] `useDebounce.ts` ✅ OK
- [x] `useEventListener.ts` ✅ useEffectEvent
- [x] `useEventSource.ts` ✅ useEffectEvent + useLayoutEffect (2026-01-17)
- [x] `useFirebase.ts` ✅ useSyncExternalStore
- [x] `useGTMTrack.ts` ✅ OK
- [x] `useIntersectionObserver.ts` ✅ OK
- [x] `useInterval.ts` ✅ useEffectEvent
- [x] `useIsomorphicLayoutEffect.ts` ✅ OK
- [x] `useLocalStorage.ts` ✅ OK
- [x] `useMediaQuery.ts` ✅ OK
- [x] `useMobile.ts` ✅ useSyncExternalStore
- [x] `useRequest/index.ts` ✅ OK
- [x] `useSessionStorage.ts` ✅ OK
- [x] `useWebSocket.ts` ✅ useEffectEvent + useLayoutEffect (2026-01-17)
- [x] `useSocketIoClient.ts` ✅ useEffectEvent + useLayoutEffect (2026-01-17)
- [x] `useThrottle.ts` ✅ OK
- [x] `useTimeout.ts` ✅ useEffectEvent
- [x] `useWebRTC.ts` ✅ useEffectEvent
- [x] `useClassifySwipeDirection.ts` ✅ OK
- [x] `gitHub/useGitHubUsers.ts` ✅ OK

### 已重構（useEffectEvent）
- [x] `useBeforeunload.ts` ✅ useEffectEvent
- [x] `useClickOutside.ts` ✅ useEffectEvent
- [x] `useKeyPress.ts` ✅ useEffectEvent（重新設計，將 handlers 移入 Effect 內）
- [x] `useLazyLoad.ts` ✅ useEffectEvent
- [x] `useFacebook.ts` ✅ useEffectEvent（重新設計，加入 JSDoc）
- [x] `usePostEventSource.ts` ✅ useEffectEvent（重新設計，4 個 callbacks 都使用 useEffectEvent）

### 已重構（useSyncExternalStore）
- [x] `useTablet.ts` ✅ useSyncExternalStore
- [x] `useWindowSize.ts` ✅ useSyncExternalStore

### 維持現狀（特殊情況）
- [x] `useCameraStream.ts` ✅ useRef + useLayoutEffect (2026-01-17)

### 已完成（本次重構）
- [x] `useYoutube.ts` ✅ useEffectEvent + useLayoutEffect (2026-01-17)

---

## 🧩 Components (高優先級)

### ⚠️ 需重構 - 多個 useState (建議 useReducer)
- [x] `Drawer/index.tsx` ⭐ ✅ useReducer + useRef + useLayoutEffect（4 個拖曳狀態合併，3 個 callback refs）
- [x] `Tabs/Bar.tsx` ⭐ ✅ useReducer x 2（6 個導航狀態 + 2 個指示器狀態，12 → 3 useState）
- [x] `SwiperJs/index.tsx` ⭐ ✅ useRef + useLayoutEffect（17 個 callback refs，依賴陣列精簡）
- [x] `SwiperCustom/index.tsx` ✅ useEffectEvent（2 個 callback，移出 Effect deps）
- [x] `ScrollFetch/index.tsx` ⭐ ✅ useReducer x 3（16 → 1 useState）

### 已完成檢查與測試（2026-02-16）
- [x] `Banner/index.tsx` ✅ useReducer + useMemo（已測試）
- [x] `Dialog/index.tsx` ✅ useMemo + useLayoutEffect（已測試）
- [x] `GoTop/index.tsx` ✅ useMemo 衍生狀態（已測試）
- [x] `Message.tsx` ✅ useReducer + useMemo（已測試，新建測試頁面）
- [x] `Selector/index.tsx` ✅ useMemo 衍生狀態（已測試）

### 需檢查的核心組件
- [x] `Animation/EnterLabel/index.tsx` ✅ useEffectEvent（2026-03-18）
- [x] `Animation/TriangleEnter/index.tsx` ✅ useEffectEvent (animationInited) + ref pattern (animationFinish)（2026-04-06）
- [ ] `AxiosInit.tsx`
- [x] `ClientProvider.tsx` ✅ useWindowSize/useMobile/useTablet hooks → WindowSizeSync（2026-04-06）
- [x] `CloudMessaging/DataTable.tsx` ✅ useMemo (nonce) + 補完整 useCallback deps（2026-04-06）
- [x] `CloudMessaging/Form.tsx` ✅ useMemo (nonce) + 補完整 useCallback/useEffect deps（2026-04-06）
- [x] `Countdown/index.tsx` ✅ 初始化流程與 callback refs（2026-04-03）
- [ ] `DatePicker/index.tsx`
- [x] `DialogModal/index.tsx` ✅ useEffectEvent + useLayoutEffect（2026-03-18）
  - ⚠️ 關閉動畫仍需由人類開發者手動調整
- [ ] `Hexagon/Container.tsx`
- [ ] `ImageUpload/index.tsx`
- [x] `Krpano/index.tsx` ✅ useEffectEvent (onReady, onLoadComplete)（2026-04-06）
- [ ] `Layout/Header.tsx`
- [x] `Layout/I18nList.tsx` ✅ useMemo (nonce + pathname.startsWith)（2026-04-06）
- [x] `Link/index.tsx` ✅ useMemo (nonce)（2026-04-06）
- [x] `Link/ListItemButton.tsx` ✅ useMemo (nonce)（2026-04-06）
- [x] `MuiCacheProvider.tsx` ✅ useMemo (nonce)（2026-04-06）
- [x] `NotificationPermission/index.tsx` ✅ useMemo (nonce) + 補完整 deps（2026-04-06）
- [x] `PhoneInput/index.tsx` ✅ 5 個 useState → useReducer + handlers → useCallback（2026-04-06）
- [x] `QRCode/index.tsx` ✅ useEffectEvent 讓 callbacks 脫離 useEffect deps（2026-04-06）
- [ ] `Ripple/index.tsx`
- [ ] `SkeletonLoader/index.tsx`
- [ ] `SlideInPanel/index.tsx`
- [x] `Tabs/Content.tsx` ✅ refreshDisable 同步與 memo 整理（2026-04-03）
- [ ] `Triangle/index.tsx`
- [ ] `VirtualScroller/index.tsx`
- [ ] `WangEditor/index.tsx`
- [ ] `WebRTCRoomEntryCard/index.tsx`

### Demo 組件
- [ ] `Demo/BannerDemo.tsx`
- [ ] `Demo/CountdownTest.tsx`
- [ ] `Demo/Dialog.tsx`
- [ ] `Demo/Drawer.tsx`
- [ ] `Demo/EnterLabelTest.tsx`
- [ ] `Demo/FaceSwapBackend.tsx`
- [ ] `Demo/FaceSwapFrontend.tsx`
- [ ] `Demo/FaceSwapIndex.tsx`
- [ ] `Demo/FrontendApiCacheTest.tsx`
- [ ] `Demo/GoTop.tsx`
- [ ] `Demo/Hooks.tsx`
- [ ] `Demo/ImageUploadTest.tsx`
- [ ] `Demo/IndexedDBDemo.tsx`
- [ ] `Demo/KrpanoDemo.tsx`
- [ ] `Demo/LazyLoadTest.tsx`
- [ ] `Demo/OfflinePageClient.tsx`
- [ ] `Demo/ParamsBackTest.tsx`
- [ ] `Demo/PhoneInputTest.tsx`
- [ ] `Demo/QRCodeTest.tsx`
- [ ] `Demo/QueryBackTest.tsx`
- [ ] `Demo/RippleTest.tsx`
- [ ] `Demo/ScrollFetch.tsx`
- [ ] `Demo/SelectorTest.tsx`
- [ ] `Demo/SkeletonLoader.tsx`
- [ ] `Demo/SlideInPanelTest.tsx`
- [ ] `Demo/SocketIoTest.tsx`
- [ ] `Demo/SocketTestIndex.tsx`
- [ ] `Demo/SSEGlobalGet.tsx`
- [ ] `Demo/SSEGlobalPost.tsx`
- [ ] `Demo/SSERoomGet.tsx`
- [ ] `Demo/SSERoomPost.tsx`
- [ ] `Demo/SSETestIndex.tsx`
- [ ] `Demo/SvgColorChabge.tsx`
- [ ] `Demo/SwiperJs.tsx`
- [ ] `Demo/SwiperTest.tsx`
- [ ] `Demo/SwitchButtonTest.tsx`
- [ ] `Demo/TabTest.tsx`
- [ ] `Demo/TriangleAnimation.tsx`
- [ ] `Demo/VirtualScrollerTest.tsx`
- [ ] `Demo/WangEditorTest.tsx`
- [ ] `Demo/WebAuthn.tsx`
- [x] `Demo/WebRTCSSERoom.tsx` ✅ useEffectEvent
- [x] `Demo/WebRTCSocketIORoom.tsx` ✅ useEffectEvent
- [x] `Demo/WebSocketTest.tsx`

---

## 📄 App Pages (63 個)

### 主要頁面
- [ ] `[locale]/page.tsx`
- [ ] `[locale]/about/page.tsx`
- [ ] `[locale]/hooks-test/page.tsx`
- [ ] `[locale]/offline/page.tsx`

### Components 展示頁
- [ ] `[locale]/components/page.tsx`
- [ ] `[locale]/components/banner-demo/page.tsx`
- [ ] `[locale]/components/countdown-test/page.tsx`
- [ ] `[locale]/components/dialog/page.tsx`
- [ ] `[locale]/components/drawer/page.tsx`
- [ ] `[locale]/components/enter-label/page.tsx`
- [ ] `[locale]/components/go-top/page.tsx`
- [ ] `[locale]/components/image-upload-test/page.tsx`
- [ ] `[locale]/components/phone-input/page.tsx`
- [ ] `[locale]/components/qr-code-test/page.tsx`
- [ ] `[locale]/components/scroll-fetch/page.tsx`
- [ ] `[locale]/components/selector/page.tsx`
- [ ] `[locale]/components/skeleton-loader/page.tsx`
- [ ] `[locale]/components/slide-in-panel/page.tsx`
- [ ] `[locale]/components/swiper-js/page.tsx`
- [ ] `[locale]/components/swiper-test/page.tsx`
- [ ] `[locale]/components/switch-button/page.tsx`
- [ ] `[locale]/components/tab-test/page.tsx`
- [ ] `[locale]/components/virtual-scroller/page.tsx`
- [ ] `[locale]/components/wang-editor-test/page.tsx`
- [ ] `[locale]/components/youtube-test/page.tsx`

### CSS Drawing 頁面
- [ ] `[locale]/css-drawing/page.tsx`
- [ ] `[locale]/css-drawing/hexagon-test/page.tsx`
- [ ] `[locale]/css-drawing/svg-color-change/page.tsx`
- [ ] `[locale]/css-drawing/triangle-anime-test/page.tsx`
- [ ] `[locale]/css-drawing/triangle-full-test/page.tsx`
- [ ] `[locale]/css-drawing/triangle-test/page.tsx`

### 其他功能頁
- [ ] `[locale]/directive-effects/page.tsx`
- [ ] `[locale]/directive-effects/lazyload-test/page.tsx`
- [ ] `[locale]/directive-effects/ripple-test/page.tsx`
- [ ] `[locale]/face-swap/page.tsx`
- [ ] `[locale]/face-swap/backend/page.tsx`
- [ ] `[locale]/face-swap/frontend/page.tsx`
- [ ] `[locale]/firebase/page.tsx`
- [ ] `[locale]/firebase/cloud-messaging/page.tsx`
- [ ] `[locale]/frontend-api-cache-test/page.tsx`
- [ ] `[locale]/indexeddb-demo/page.tsx`
- [ ] `[locale]/krpano-demo/page.tsx`
- [ ] `[locale]/route/page.tsx`
- [ ] `[locale]/route/params-back-test/[testData]/page.tsx`
- [ ] `[locale]/route/query-back-test/page.tsx`
- [ ] `[locale]/server-sent-event-test/page.tsx`
- [ ] `[locale]/server-sent-event-test/global-get/page.tsx`
- [ ] `[locale]/server-sent-event-test/global-post/page.tsx`
- [ ] `[locale]/socket-io-test/page.tsx`
- [ ] `[locale]/web-authn/page.tsx`
- [ ] `[locale]/web-rtc/page.tsx`
- [ ] `[locale]/web-socket-test/page.tsx`

---

## 📝 檢查標準

每個檔案檢查時，需評估：

1. **useState → useRef**: 不需觸發 re-render 的值（timer ID, interval ID）
2. **多個 useState → useReducer**: 5+ 個相關聯的 state
3. **計算 → useMemo**: 昂貴的 filter/map/sort 操作
4. **callback → useCallback**: 傳給子組件的函式
5. **useEffect → useLayoutEffect**: 影響視覺渲染的同步操作
6. **表單 → useActionState**: React 19 表單處理
7. **非阻塞更新 → useTransition**: 大量資料過濾/搜尋
8. **Effect 內部依賴優化 → useEffectEvent**: 替換 useRef + useCallback 模式
9. **Import Type**: 檢查並修正類型導入
10. **Callback Ref 同步 → useLayoutEffect**: 確保 refs 在繪製前更新

---

## 📋 審查記錄

### 2026-01-17 全面審查

**審查範圍**: 35 個已完成檔案（32 hooks + 3 Demo + 5 高優先級 Components）

**發現的改進機會**: `useEffect` → `useLayoutEffect` for callback ref sync

**已更新檔案** (7 個):

| 檔案 | 改進 |
|------|------|
| `useWebSocket.ts` | listenersRef sync |
| `useSocketIoClient.ts` | listenersRef sync |
| `useCameraStream.ts` | onReadyRef, onErrorRef, optionsRef sync |
| `useYoutube.ts` | optionsRef sync |
| `useEventSource.ts` | reconnectRef sync |
| `SwiperJs/index.tsx` | 17 個 callback refs sync |
| `Drawer/index.tsx` | 3 個 callback refs sync |

**原因**: `useLayoutEffect` 在瀏覽器繪製前同步執行，確保 refs 在任何用戶交互前都是最新值，避免 race condition。

---

### 2026-01-25 Nonce/Hydration Refactor (Need Double Check)

**審查範圍**: 解決 CSP Nonce 在 SSR/Hydration 中的傳遞問題，以及防毒軟體干擾導致的 Hydration Mismatch。

---

### 2026-03-18 Components Batch

**審查範圍**: `EnterLabel`, `SwitchButton`, `DialogModal`

**已完成改進**:

| 檔案 | 改進 |
|------|------|
| `Animation/EnterLabel/index.tsx` | `useEffectEvent` 取代 ref + callback 動畫遞迴 |
| `SwitchButton/index.tsx` | inline type imports、controllable pattern、callback ref 量測 icon 寬度 |
| `DialogModal/index.tsx` | `useEffectEvent` 穩定 keydown handler、`useLayoutEffect` 同步 body overflow；關閉動畫仍需人類開發者手動調整 |

**關鍵變更**:
1. `EnterLabel` 用 `useEffectEvent` 收斂動畫步進邏輯，移除舊的 ref + callback 間接呼叫。
2. `SwitchButton` 改成 controllable / uncontrolled 兼容模式，避免 effect 內同步 state。
3. `SwitchButton` 以 callback ref 取代 effect 量測 icon 寬度，保留視覺定位行為。
4. `DialogModal` 以 `useEffectEvent` 穩定 Escape 關閉邏輯，並用 `useLayoutEffect` 同步 body overflow。

**需二次檢查檔案** (7 個):

| 檔案 | 改進 / 變更 |
|------|-------------|
| `components/Providers/NonceProvider.tsx` | 新增 Context Provider |
| `components/Layout/Body.tsx` | 注入 NonceProvider |
| `components/Layout/Header.tsx` | 新增 useNonce fallback, useMemo 優化 |
| `components/Layout/Footer.tsx` | 新增 useNonce fallback, useMemo 優化 |
| `components/PageLoading.tsx` | 新增 useNonce fallback, useMemo 優化 |
| `layout/default/index.tsx` | 恢復為 Server Component，傳遞 Props |
| `app/[locale]/css-drawing/loading.tsx` | 改為同步元件，移除 async/headers |
| `app/[locale]/about/page.tsx` | Layout 結構調整 (User Edit) |
| `app/[locale]/about/layout.tsx` | Layout 結構調整 (User Edit) |

---

### 2026-02-16 組件測試與修復

**審查範圍**: 5 個核心組件的深度檢查與瀏覽器測試

**已完成組件** (5 個):

| 組件 | 重構內容 | 測試狀態 | 備註 |
|------|---------|---------|------|
| `Banner/index.tsx` | useReducer + useMemo | ✅ 通過 | 導航、拖曳功能正常 |
| `GoTop/index.tsx` | useMemo 衍生狀態 | ✅ 通過 | 修復 useScroll hook 無限迴圈 |
| `Dialog/index.tsx` | useMemo + useLayoutEffect | ✅ 通過 | 修復測試頁面關閉邏輯 |
| `Selector/index.tsx` | useMemo 衍生狀態 | ✅ 通過 | 修復 useWindowSize hook |
| `Message.tsx` | useReducer + useMemo | ✅ 通過 | 新建測試頁面 |

**修復的 Hooks** (2 個):

| Hook | 問題 | 修復方式 |
|------|------|----------|
| `useScroll.ts` | getScrollSnapshot 無限迴圈 | 實作快取機制 |
| `useWindowSize.ts` | getServerSnapshot 無限迴圈 | 使用常數快取 |

**新建檔案** (4 個):
- `components/Demo/Message.tsx` - Message 測試組件
- `app/[locale]/components/message/page.tsx` - 頁面路由
- `app/[locale]/components/message/loading.tsx` - 載入骨架
- i18n 翻譯（中英文）

**關鍵學習**:
1. `useSyncExternalStore` 的 snapshot 函數必須返回穩定引用
2. 相同值時應返回相同物件，避免無限重渲染
3. Server snapshot 應使用常數快取

---

## 狀態說明

- `[ ]` 未檢查
- `[/]` 檢查中
- `[x]` 已完成（無需修改或已修改）
- `⭐` 高優先級

---

### 2026-04-06 Nonce/Hooks Pattern Batch

**審查範圍**: 12 個核心組件，主要處理 nonce 同步模式、event callbacks 脫離 deps、useState → useReducer

**已完成組件** (12 個):

| 組件 | 重構內容 |
|------|----------|
| `Animation/TriangleEnter/index.tsx` | `useEffectEvent` (animationInited)；`ref` pattern (animationFinish，因規則限制) |
| `ClientProvider.tsx` | 改用 `useWindowSize`/`useMobile`/`useTablet` hooks，拆出 `WindowSizeSync` 子組件 |
| `CloudMessaging/DataTable.tsx` | `useMemo` (nonce)；移除靜態字串 `useMemo`；補完整 `useCallback` deps |
| `CloudMessaging/Form.tsx` | `useMemo` (nonce)；補完整 `handlePushNotification` / `serverTokenList` deps |
| `Krpano/index.tsx` | `useEffectEvent` (onReady, onLoadComplete)；hotspots 刻意排除 deps（見 simplified-implementations.md）|
| `Layout/I18nList.tsx` | `useMemo` (nonce + pathname.startsWith 路徑判斷)；移除多餘 useEffect |
| `Link/index.tsx` | `useMemo` (nonce)，取代 `useEffect + useState` |
| `Link/ListItemButton.tsx` | `useMemo` (nonce)，取代 `useEffect + useState` |
| `MuiCacheProvider.tsx` | `useMemo` (nonce)，取代 `useEffect + useState` |
| `NotificationPermission/index.tsx` | `useMemo` (nonce)；補完整 deps；移除無效 `eslint-disable` 注釋 |
| `PhoneInput/index.tsx` | 5 個 `useState` → `useReducer`；所有 handlers → `useCallback`；衍生值 → `useMemo` |
| `QRCode/index.tsx` | `useEffectEvent` 讓 `onBeforeCreate`/`onSuccess` 脫離 `useEffect` deps |

**同步完成** (Hooks):

| Hook | 改動 |
|------|------|
| `useMobile.ts` | import 來源從 `mediaQuery.ts` 改為 `scss_variable_export.module.scss` |
| `useTablet.ts` | import 來源從 `mediaQuery.ts` 改為 `scss_variable_export.module.scss` |

**需關注的特殊實作** (詳見 `simplified-implementations.md`):
1. `TriangleEnter/animationFinish` — 使用 ref 取代 `useEffectEvent`（規則：後者不能在 onClick 中呼叫）
2. `Krpano/hotspots` — 刻意從初始化 deps 排除，避免 Krpano 實例重新初始化
