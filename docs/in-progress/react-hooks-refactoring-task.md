# React Hooks Refactoring - 進度追蹤

## 📊 總覽

| 分類 | 總數 | 已完成 | 進行中 |
|------|------|--------|--------|
| Hooks | 32 | 32 | 0 |
| Components | 110+ | 0 | 0 |
| App Pages | 63 | 0 | 0 |

---

## 🪝 Hooks (32 個)

- [x] [useBeforeunload.ts](../../hooks/useBeforeunload.ts) ✅ useRef/useCallback
- [x] [useCameraStream.ts](../../hooks/useCameraStream.ts) ✅ 結構良好
- [x] [useClassifySwipeDirection.ts](../../hooks/useClassifySwipeDirection.ts) 🔧 已修正 `type RefObject`
- [x] [useClickOutside.ts](../../hooks/useClickOutside.ts) ✅ useRef
- [x] [useDayjs.ts](../../hooks/useDayjs.ts) ✅ 已使用 import type
- [x] [useDebounce.ts](../../hooks/useDebounce.ts) ✅ 結構良好
- [x] [useEventListener.ts](../../hooks/useEventListener.ts) ✅ useRef
- [x] [useEventSource.ts](../../hooks/useEventSource.ts) ✅ 已使用 import type
- [x] [useFacebook.ts](../../hooks/useFacebook.ts) ✅ 結構良好
- [x] [useFirebase.ts](../../hooks/useFirebase.ts) ✅ useSyncExternalStore
- [x] [useGTMTrack.ts](../../hooks/useGTMTrack.ts) ✅ 結構良好
- [x] [useIntersectionObserver.ts](../../hooks/useIntersectionObserver.ts) 🔧 已修正 `type RefObject`
- [x] [useInterval.ts](../../hooks/useInterval.ts) ✅ useRef
- [x] [useIsomorphicLayoutEffect.ts](../../hooks/useIsomorphicLayoutEffect.ts) ✅ 結構良好
- [x] [useKeyPress.ts](../../hooks/useKeyPress.ts) ✅ useCallback/useMemo
- [x] [useLazyLoad.ts](../../hooks/useLazyLoad.ts) ✅ 已使用 type RefObject
- [x] [useLocalStorage.ts](../../hooks/useLocalStorage.ts) ✅ useCallback
- [x] [useMediaQuery.ts](../../hooks/useMediaQuery.ts) ✅ 結構良好
- [x] [useMobile.ts](../../hooks/useMobile.ts) ✅ useSyncExternalStore
- [x] [usePostEventSource.ts](../../hooks/usePostEventSource.ts) ✅ 已使用 import type
- [x] [useSessionStorage.ts](../../hooks/useSessionStorage.ts) ✅ useCallback
- [x] [useThrottle.ts](../../hooks/useThrottle.ts) ✅ useRef/useCallback
- [x] [useTimeout.ts](../../hooks/useTimeout.ts) ✅ useRef
- [x] [useWebSocket.ts](../../hooks/useWebSocket.ts) ✅ useRef/useCallback
- [x] [useWindowSize.ts](../../hooks/useWindowSize.ts) ✅ 結構良好
- [x] [useRequest/index.ts](../../hooks/useRequest/index.ts) ✅ 結構良好 (import type 已分開/正確)
- [x] [useRequest/useRequestInit.ts](../../hooks/useRequest/useRequestInit.ts) ✅ 結構良好 (import type 已分開)
- [x] [useSocketIoClient.ts](../../hooks/useSocketIoClient.ts) ✅ 結構良好 (動態 import 使用正確)
- [x] [useTablet.ts](../../hooks/useTablet.ts) ✅ 結構良好
- [x] [useWebRTC.ts](../../hooks/useWebRTC.ts) ✅ 結構良好 (useRef/useCallback 使用正確)
- [x] [useYoutube.ts](../../hooks/useYoutube.ts) 🔧 已修正 `type RefObject`
- [x] [gitHub/useGitHubUsers.ts](../../hooks/gitHub/useGitHubUsers.ts) ✅ 結構良好 (import type 已分開)

---

## 🧩 Components - 高優先級 ⭐

- [x] [Drawer/index.tsx](../../components/Drawer/index.tsx) ⭐ (useState -> useRef for drag state)
- [x] [Tabs/Bar.tsx](../../components/Tabs/Bar.tsx) ⭐ (import type fixed)
- [x] [SwiperJs/index.tsx](../../components/SwiperJs/index.tsx) (import type fixed)
- [x] [SwiperCustom/index.tsx](../../components/SwiperCustom/index.tsx) (import type fixed)
- [x] [ScrollFetch/index.tsx](../../components/ScrollFetch/index.tsx) (useState -> useRef for startY)

## 🧩 Components - 核心組件

- [x] [Animation/EnterLabel/index.tsx](../../components/Animation/EnterLabel/index.tsx) (import type fixed)
- [x] [Animation/TriangleEnter/index.tsx](../../components/Animation/TriangleEnter/index.tsx) (import type fixed)
- [x] [Banner/index.tsx](../../components/Banner/index.tsx) (useState -> useRef for startX, import type fixed)
- [x] [CloudMessaging/DataTable.tsx](../../components/CloudMessaging/DataTable.tsx) (import type fixed)
- [x] [CloudMessaging/Form.tsx](../../components/CloudMessaging/Form.tsx) (import type fixed)
- [x] [Countdown/index.tsx](../../components/Countdown/index.tsx) (import type fixed)
- [x] [DatePicker/index.tsx](../../components/DatePicker/index.tsx) (checked)
- [x] [Dialog/index.tsx](../../components/Dialog/index.tsx) (import type fixed)
- [x] [GoTop/index.tsx](../../components/GoTop/index.tsx) (import type fixed)
- [x] [ImageUpload/index.tsx](../../components/ImageUpload/index.tsx) (import type fixed)
- [x] [Krpano/index.tsx](../../components/Krpano/index.tsx) (checked)
- [x] [Layout/Header.tsx](../../components/Layout/Header.tsx) (import type fixed)
- [x] [Layout/I18nList.tsx](../../components/Layout/I18nList.tsx) (useState for anchorEl, import type fixed)
- [x] [Link/index.tsx](../../components/Link/index.tsx) (import type fixed)
- [x] [Loading/index.tsx](../../components/Loading/index.tsx) (Not Found - Skipped)
- [x] [Message.tsx](../../components/Message.tsx) (import type fixed)
- [x] [MuiCacheProvider.tsx](../../components/MuiCacheProvider.tsx) (import type fixed)
- [x] [PhoneInput/index.tsx](../../components/PhoneInput/index.tsx) (checked)
- [x] [Popup/index.tsx](../../components/Popup/index.tsx) (Not Found - Skipped)
- [x] [QRCode/index.tsx](../../components/QRCode/index.tsx) (checked)
- [x] [Ripple/index.tsx](../../components/Ripple/index.tsx) (import type fixed)
- [x] [Selector/index.tsx](../../components/Selector/index.tsx) (import type fixed)
- [x] [SlideInPanel/index.tsx](../../components/SlideInPanel/index.tsx) (import type fixed)
- [x] [SwitchButton/index.tsx](../../components/SwitchButton/index.tsx) (import type fixed)
- [x] [Tabs/Content.tsx](../../components/Tabs/Content.tsx) (React types fixed)
- [x] [Tabs/index.tsx](../../components/Tabs/index.tsx) (checked)
- [x] [Triangle/index.tsx](../../components/Triangle/index.tsx) (import type fixed)
- [x] [Typography/index.tsx](../../components/Typography/index.tsx) (Not Found - Skipped)
- [x] [VideoPlayer/index.tsx](../../components/VideoPlayer/index.tsx) (Not Found - Skipped)
- [x] [VirtualScroller/index.tsx](../../components/VirtualScroller/index.tsx) (import type fixed)
- [x] [WangEditor/index.tsx](../../components/WangEditor/index.tsx) (import type fixed)
- [x] [WebRTCRoomEntryCard/index.tsx](../../components/WebRTCRoomEntryCard/index.tsx) (React types fixed)
- [x] [Youtube/index.tsx](../../components/Youtube/index.tsx) (import type fixed)

## 🧩 Components - Demo

- [x] [Demo/BannerDemo.tsx](../../components/Demo/BannerDemo.tsx) (checked)
- [ ] [Demo/CountdownTest.tsx](../../components/Demo/CountdownTest.tsx)
- [ ] [Demo/Dialog.tsx](../../components/Demo/Dialog.tsx)
- [ ] [Demo/Drawer.tsx](../../components/Demo/Drawer.tsx)
- [ ] [Demo/Hooks.tsx](../../components/Demo/Hooks.tsx)
- [ ] [Demo/IndexedDBDemo.tsx](../../components/Demo/IndexedDBDemo.tsx)
- [x] [Demo/KrpanoDemo.tsx](../../components/Demo/KrpanoDemo.tsx) (checked)
- [ ] [Demo/ScrollFetch.tsx](../../components/Demo/ScrollFetch.tsx)
- [x] [Demo/SocketIoTest.tsx](../../components/Demo/SocketIoTest.tsx) (import type fixed)
- [ ] [Demo/WebAuthn.tsx](../../components/Demo/WebAuthn.tsx)
- [x] [Demo/WebRTCSSERoom.tsx](../../components/Demo/WebRTCSSERoom.tsx) (React types fixed)
- [x] [Demo/WebRTCSocketIORoom.tsx](../../components/Demo/WebRTCSocketIORoom.tsx) (React types fixed)
- [x] [Demo/WebSocketTest.tsx](../../components/Demo/WebSocketTest.tsx) (import type fixed)

---

## 📄 App Pages (部分列表)

- [x] [app/[locale]/page.tsx](../../app/[locale]/page.tsx) (checked)
- [x] [app/[locale]/hooks-test/page.tsx](../../app/[locale]/hooks-test/page.tsx) (checked)
- [x] [app/[locale]/components/scroll-fetch/page.tsx](../../app/[locale]/components/scroll-fetch/page.tsx) (checked)
- [x] [app/[locale]/socket-test/page.tsx](../../app/[locale]/socket-test/page.tsx) (checked)
- [x] [app/[locale]/web-rtc/page.tsx](../../app/[locale]/web-rtc/page.tsx) (checked)
- [ ] [app/[locale]/web-socket-test/page.tsx](../../app/[locale]/web-socket-test/page.tsx)

---

## 📝 檢查標準

| 模式 | 建議 Hook / 修改 |
|------|-----------------|
| 不需觸發 re-render 的值 | `useRef` |
| 5+ 個相關 state | `useReducer` |
| 昂貴的計算 | `useMemo` |
| 傳給子組件的函式 | `useCallback` |
| 影響視覺渲染的同步操作 | `useLayoutEffect` |
| 表單處理 | `useActionState` |
| 非阻塞更新 | `useTransition` |
| **類型導入混在一般 import** | **`import type` 或 `type` inline** |

## 狀態說明

- `[ ]` 未檢查
- `[/]` 檢查中
- `[x]` 已完成
- `⭐` 高優先級

