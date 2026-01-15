# React Hooks Refactoring - 進度追蹤

## 📊 總覽

| 分類 | 總數 | 已完成 | 進行中 |
|------|------|--------|--------|
| Hooks | 32 | 7 | 0 |
| Components | 110+ | 3 | 0 |
| App Pages | 63 | 0 | 0 |

---

## 🪝 Hooks (32 個)

### 需檢查的自訂 Hooks
- [ ] `useBeforeunload.ts`
- [ ] `useCameraStream.ts`
- [ ] `useClassifySwipeDirection.ts`
- [ ] `useClickOutside.ts`
- [ ] `useDayjs.ts`
- [ ] `useDebounce.ts`
- [x] `useEventListener.ts` ✅ useEffectEvent
- [x] `useEventSource.ts` ✅ useEffectEvent
- [ ] `useFacebook.ts`
- [ ] `useFirebase.ts`
- [ ] `useGTMTrack.ts`
- [ ] `useIntersectionObserver.ts`
- [x] `useInterval.ts` ✅ useEffectEvent
- [ ] `useIsomorphicLayoutEffect.ts`
- [ ] `useKeyPress.ts`
- [ ] `useLazyLoad.ts`
- [ ] `useLocalStorage.ts`
- [ ] `useMediaQuery.ts`
- [ ] `useMobile.ts`
- [ ] `usePostEventSource.ts`
- [ ] `useRequest/index.ts`
- [ ] `useRequest/useRequestInit.ts`
- [ ] `useSessionStorage.ts`
- [x] `useWebSocket.ts` ✅ useEffectEvent
- [x] `useSocketIoClient.ts` ✅ useEffectEvent
- [ ] `useTablet.ts`
- [ ] `useThrottle.ts`
- [x] `useTimeout.ts` ✅ useEffectEvent
- [x] `useWebRTC.ts` ✅ useEffectEvent
- [ ] `useWindowSize.ts`
- [ ] `useYoutube.ts`
- [ ] `gitHub/useGitHubUsers.ts`

---

## 🧩 Components (高優先級)

### ⚠️ 需重構 - 多個 useState (建議 useReducer)
- [ ] `Drawer/index.tsx` ⭐ (9 useState)
- [ ] `Tabs/Bar.tsx` ⭐ (12 useState)
- [ ] `SwiperJs/index.tsx`
- [ ] `SwiperCustom/index.tsx`
- [ ] `ScrollFetch/index.tsx`

### 需檢查的核心組件
- [ ] `Animation/EnterLabel/index.tsx`
- [ ] `Animation/TriangleEnter/index.tsx`
- [ ] `AxiosInit.tsx`
- [ ] `Banner/index.tsx`
- [ ] `ClientProvider.tsx`
- [ ] `CloudMessaging/DataTable.tsx`
- [ ] `CloudMessaging/Form.tsx`
- [ ] `Countdown/index.tsx`
- [ ] `DatePicker/index.tsx`
- [ ] `Dialog/index.tsx`
- [ ] `GoTop/index.tsx`
- [ ] `Hexagon/Container.tsx`
- [ ] `ImageUpload/index.tsx`
- [ ] `Krpano/index.tsx`
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

---

## 狀態說明

- `[ ]` 未檢查
- `[/]` 檢查中
- `[x]` 已完成（無需修改或已修改）
- `⭐` 高優先級
