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

- [ ] [Drawer/index.tsx](../../components/Drawer/index.tsx) ⭐ (9 useState)
- [ ] [Tabs/Bar.tsx](../../components/Tabs/Bar.tsx) ⭐ (12 useState)
- [ ] [SwiperJs/index.tsx](../../components/SwiperJs/index.tsx)
- [ ] [SwiperCustom/index.tsx](../../components/SwiperCustom/index.tsx)
- [ ] [ScrollFetch/index.tsx](../../components/ScrollFetch/index.tsx)

## 🧩 Components - 核心組件

- [ ] [Animation/EnterLabel/index.tsx](../../components/Animation/EnterLabel/index.tsx)
- [ ] [Animation/TriangleEnter/index.tsx](../../components/Animation/TriangleEnter/index.tsx)
- [ ] [Banner/index.tsx](../../components/Banner/index.tsx)
- [ ] [CloudMessaging/DataTable.tsx](../../components/CloudMessaging/DataTable.tsx)
- [ ] [CloudMessaging/Form.tsx](../../components/CloudMessaging/Form.tsx)
- [ ] [Countdown/index.tsx](../../components/Countdown/index.tsx)
- [ ] [DatePicker/index.tsx](../../components/DatePicker/index.tsx)
- [ ] [Dialog/index.tsx](../../components/Dialog/index.tsx)
- [ ] [GoTop/index.tsx](../../components/GoTop/index.tsx)
- [ ] [ImageUpload/index.tsx](../../components/ImageUpload/index.tsx)
- [ ] [Krpano/index.tsx](../../components/Krpano/index.tsx)
- [ ] [Layout/Header.tsx](../../components/Layout/Header.tsx)
- [ ] [Layout/I18nList.tsx](../../components/Layout/I18nList.tsx)
- [ ] [Link/index.tsx](../../components/Link/index.tsx)
- [ ] [Message.tsx](../../components/Message.tsx)
- [ ] [MuiCacheProvider.tsx](../../components/MuiCacheProvider.tsx)
- [ ] [PhoneInput/index.tsx](../../components/PhoneInput/index.tsx)
- [ ] [QRCode/index.tsx](../../components/QRCode/index.tsx)
- [ ] [Ripple/index.tsx](../../components/Ripple/index.tsx)
- [ ] [Selector/index.tsx](../../components/Selector/index.tsx)
- [ ] [SlideInPanel/index.tsx](../../components/SlideInPanel/index.tsx)
- [ ] [SwitchButton/index.tsx](../../components/SwitchButton/index.tsx)
- [ ] [Tabs/Content.tsx](../../components/Tabs/Content.tsx)
- [ ] [VirtualScroller/index.tsx](../../components/VirtualScroller/index.tsx)
- [ ] [WangEditor/index.tsx](../../components/WangEditor/index.tsx)

## 🧩 Components - Demo

- [ ] [Demo/BannerDemo.tsx](../../components/Demo/BannerDemo.tsx)
- [ ] [Demo/CountdownTest.tsx](../../components/Demo/CountdownTest.tsx)
- [ ] [Demo/Dialog.tsx](../../components/Demo/Dialog.tsx)
- [ ] [Demo/Drawer.tsx](../../components/Demo/Drawer.tsx)
- [ ] [Demo/Hooks.tsx](../../components/Demo/Hooks.tsx)
- [ ] [Demo/IndexedDBDemo.tsx](../../components/Demo/IndexedDBDemo.tsx)
- [ ] [Demo/KrpanoDemo.tsx](../../components/Demo/KrpanoDemo.tsx)
- [ ] [Demo/ScrollFetch.tsx](../../components/Demo/ScrollFetch.tsx)
- [ ] [Demo/SocketIoTest.tsx](../../components/Demo/SocketIoTest.tsx)
- [ ] [Demo/WebAuthn.tsx](../../components/Demo/WebAuthn.tsx)
- [ ] [Demo/WebRTCSSERoom.tsx](../../components/Demo/WebRTCSSERoom.tsx)
- [ ] [Demo/WebSocketTest.tsx](../../components/Demo/WebSocketTest.tsx)

---

## 📄 App Pages (部分列表)

- [ ] [app/[locale]/page.tsx](../../app/[locale]/page.tsx)
- [ ] [app/[locale]/hooks-test/page.tsx](../../app/[locale]/hooks-test/page.tsx)
- [ ] [app/[locale]/components/scroll-fetch/page.tsx](../../app/[locale]/components/scroll-fetch/page.tsx)
- [ ] [app/[locale]/socket-io-test/page.tsx](../../app/[locale]/socket-io-test/page.tsx)
- [ ] [app/[locale]/web-rtc/page.tsx](../../app/[locale]/web-rtc/page.tsx)
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

