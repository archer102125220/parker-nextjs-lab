# React Hooks Refactoring - 進度追蹤

## 📊 總覽

| 分類 | 總數 | 已完成 | 進行中 |
|------|------|--------|--------|
| Hooks | 32 | 32 | 0 |
| Components | 110+ | 3 | 0 |
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

### 需檢查的核心組件

#### ✅ Phase 3 已檢查（2026-02-16）
- [x] `Animation/EnterLabel/index.tsx` ✅ 已優化（useCallback, useRef）
- [x] `Banner/index.tsx` ✅ 已優化（useCallback, useRef, 拖曳邏輯）
- [x] `Countdown/index.tsx` ✅ 已優化（useMemo, useRef, 動畫管理）
- [x] `DatePicker/index.tsx` ✅ 已優化（handleChange 使用 useCallback）
- [x] `Dialog/index.tsx` ✅ 已優化（useMemo, useCallback）
- [x] `GoTop/index.tsx` ✅ 已優化（useMemo, useCallback, 滾動事件）
- [x] `ImageUpload/index.tsx` ✅ 已優化（6 個事件處理器使用 useCallback）
- [x] `Krpano/index.tsx` ✅ 已優化（useCallback, useImperativeHandle, useId）
- [x] `PhoneInput/index.tsx` ✅ 已優化（useMemo, 國家列表）
- [x] `QRCode/index.tsx` ✅ 已優化（useCallback, 異步生成）

**Phase 3 結果**：10 個組件全部已優化（100%）✅

#### 待檢查的核心組件
- [ ] `Animation/TriangleEnter/index.tsx`
- [ ] `AxiosInit.tsx`
- [ ] `ClientProvider.tsx`
- [ ] `CloudMessaging/DataTable.tsx`
- [ ] `CloudMessaging/Form.tsx`
- [ ] `Hexagon/Container.tsx`
### 🔵 新增：Import Type 檢查 ✅ 完成

8.  **混合 import → 分離 `import type`**

以下檔案需要將類型導入（ReactNode, CSSProperties 等）改為 `import type`：

-   [x] `components/Banner/index.tsx` ✅ 已正確
-   [x] `components/DialogModal/index.tsx` ✅ 已修正 (2026-02-16)
-   [x] `components/SlideInPanel/index.tsx` ✅ 已正確
-   [x] `components/Tabs/Bar.tsx` ✅ 已正確
-   [x] `components/Selector/index.tsx` ✅ 已正確
-   [x] `components/Countdown/index.tsx` ✅ 已正確
-   [x] `components/SwitchButton/index.tsx` ✅ 已正確
-   [x] `components/VirtualScroller/index.tsx` ✅ 已正確
-   [x] `components/Animation/EnterLabel/index.tsx` ✅ 已正確
- [ ] `Layout/Header.tsx`
- [ ] `Layout/I18nList.tsx`
- [ ] `Link/index.tsx`
- [ ] `Link/ListItemButton.tsx`
- [ ] `Message.tsx`
- [ ] `MuiCacheProvider.tsx`
- [ ] `NotificationPermission/index.tsx`
- [ ] `PhoneInput/index.tsx`
- [ ] `QRCode/index.tsx`
- [ ] `Ripple/index.tsx`
- [ ] `Selector/index.tsx`
- [ ] `SkeletonLoader/index.tsx`
- [ ] `SlideInPanel/index.tsx`
- [ ] `SwitchButton/index.tsx`
- [ ] `Tabs/Content.tsx`
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

## 🔍 階段三：全面 Import Type 檢查 (2026-02-16)

### Utils 目錄
- [ ] 掃描 `utils/**/*.ts` 和 `utils/**/*.tsx`
- [ ] 檢查是否有使用 React 類型
- [ ] 修正不符合規範的 import type

### Layout 目錄
- [ ] `layout/**/*.tsx`
- [ ] 檢查所有 layout 組件的 import type

### Models 目錄
- [ ] `models/**/*.ts`
- [ ] 檢查是否有使用 React 類型（如 ReactNode, FC 等）

### Store 目錄
- [ ] `store/**/*.ts`
- [ ] 檢查 Redux store 相關檔案是否有使用 React 類型

### 批次檢查方法
**使用 AI 工具**:
- `grep_search` - 搜尋所有 React import 語句
- `find_by_name` - 列出所有 .tsx/.ts 檔案
- `replace_file_content` / `multi_replace_file_content` - 修正檔案
- **禁止**: sed, awk, find...exec 等腳本

### 簡化處理記錄
任何在檢查過程中發現的簡化處理或需要後續完善的部分，記錄在：
- [simplified-implementations.md](file:///Users/parkerchen/Desktop/code/parker-nextjs-lab/docs/in-progress/simplified-implementations.md)

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

**關鍵變更**:
1. 引入 `NonceContext` (`NonceProvider`) 以避免 Prop Drilling 並支援深層元件存取。
2. `DefaultLayout` 保持 Server Component，但 `Header`/`Footer` 改為從 Context 獲取 Nonce 作為 fallback。
3. `loading.tsx` 移除 `async` 改為同步，避免 React Instrumentation Error。
4. 使用 `useMemo` 優化 Nonce 的合併邏輯 (`props.nonce || contextNonce || reduxNonce`)。

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

## 狀態說明

- `[ ]` 未檢查
- `[/]` 檢查中
- `[x]` 已完成（無需修改或已修改）
- `⭐` 高優先級
