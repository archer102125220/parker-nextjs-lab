# React Hooks Refactoring Plan

## 目標

檢視整個專案的 React Hooks 使用情況，將過度依賴 `useState` 和 `useEffect` 的地方改為使用更適合的 React 19 Stable Hooks。

**核心更新 (2026-01-12):**
確認 `useEffectEvent` 在 React 19.2.0 中已可作為穩定 API 使用。我們將優先使用它來替代 `useRef` + `useCallback` 模式來處理 Effect 依賴問題。

## 多個相關 `useState` → `useReducer`

| 統計項目 | 數量 |
|----------|------|
| 組件檔案 | 110 個 |
| 自訂 Hooks | 32 個（✅ 全部完成） |
| 已檢查組件 | 13 個（Banner, Dialog, GoTop, Message, Selector, EnterLabel 等） |
| `useState` 使用次數 | 331+ |
| `useEffect` 使用次數 | 152+ |
| `useMemo` 使用次數 | 19+ 個檔案 ✅ |
| `useCallback` 使用次數 | 37+ 個檔案 ✅ |
| `useReducer` 使用次數 | 5+ 個檔案 ✅ |
| `useSyncExternalStore` 使用次數 | 4 個 Hooks ✅ |
| `useTransition` 使用次數 | 0 ❌ |

## 重構優先順序

### 🔴 高優先級

1.  **Effect 內部依賴優化 → `useEffectEvent`** (✨ NEW) ✅ 已完成
    -   **目標**：替換 `useRef` + `useCallback` 模式
    -   **優勢**：解決閉包問題，同時保持 Effect 依賴純淨
    -   **適用**：`useEventSource`, `useWebSocket` 等 Hook

2.  **多個相關 `useState` → `useReducer`**
    -   [Drawer/index.tsx](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/components/Drawer/index.tsx) (9 useState)
    -   [Tabs/Bar.tsx](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/components/Tabs/Bar.tsx) (12 useState)

3.  **不需要觸發 re-render 的值 → `useRef`**
    -   Timer ID、Interval ID 相關的 state

4.  **昂貴計算未 memo 化 → `useMemo`**
    -   `.filter(...).map(...)` 鏈式操作

5.  **傳給子組件的 callback 未 memo 化 → `useCallback`**

### 🟡 中優先級

6.  **表單處理 → `useActionState` + `useFormStatus`**
7.  **非阻塞 UI 更新 → `useTransition`**

### 🟠 新增：Callback Ref 同步優化 (2026-01-17)

8.  **Callback Ref 同步 → `useLayoutEffect`**

    當使用 `useRef` 來同步 props/callback 到 ref 時，應使用 `useLayoutEffect` 而非 `useEffect`：

    ```typescript
    // ✅ 正確：使用 useLayoutEffect
    useLayoutEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

    // ❌ 避免：使用 useEffect 可能有 race condition
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);
    ```

    **原因**：`useLayoutEffect` 在繪製前同步執行，確保 ref 在任何用戶交互前都是最新的。

    **已更新的檔案**：
    - `useWebSocket.ts` - listenersRef
    - `useSocketIoClient.ts` - listenersRef
    - `useCameraStream.ts` - onReadyRef, onErrorRef, optionsRef
    - `useYoutube.ts` - optionsRef
    - `useEventSource.ts` - reconnectRef
    - `SwiperJs/index.tsx` - 17 個 callback refs
    - `Drawer/index.tsx` - 3 個 callback refs

### 🔵 新增：Import Type 檢查

8.  **混合 import → 分離 `import type`**

以下檔案需要將類型導入（ReactNode, CSSProperties 等）改為 `import type`：

-   [x] `components/Banner/index.tsx` ✅
-   [x] `components/DialogModal/index.tsx` ✅
-   [ ] `components/SlideInPanel/index.tsx`
-   [ ] `components/Tabs/Bar.tsx`
-   [x] `components/Selector/index.tsx` ✅
-   [x] `components/Countdown/index.tsx` ✅ (2026-04-03)
-   [x] `components/SwitchButton/index.tsx` ✅
-   [ ] `components/VirtualScroller/index.tsx`
-   [x] `components/Animation/EnterLabel/index.tsx` ✅

**修改範例：**

```typescript
// ❌ Before
import { useState, useEffect, ReactNode, CSSProperties } from 'react';

// ✅ After (inline type - 推薦)
import { useState, useEffect, type ReactNode, type CSSProperties } from 'react';

// ✅ After (分開寫)
import { useState, useEffect } from 'react';
import type { ReactNode, CSSProperties } from 'react';
```

### 🟢 低優先級

9.  **樂觀更新 → `useOptimistic`**


### 🟣 新增：Nonce Hydration 策略 (2026-01-25)

10. **Nonce Context & Hydration Stability**
    -   **問題**：Redux 狀態初始化延遲導致 Hydration Mismatch；Async loading.tsx 導致 Instrumentation Error。
    -   **解法**：建立 `NonceProvider`，使用 `useContext` 在 hydrate 階段同步 nonce。
    -   **相關檔案** (需二次檢查)：
        -   `components/Providers/NonceProvider.tsx`
        -   `components/Layout/Header.tsx`
        -   `components/Layout/Footer.tsx`
        -   `components/PageLoading.tsx`

## 執行步驟

詳細進度請參考：[react-hooks-refactoring-task.md](./react-hooks-refactoring-task.md)

## 驗證計劃

```bash
yarn lint
yarn test
yarn dev:webpack  # 手動功能測試
```

## 最新進度（2026-02-16）

### ✅ 已完成組件測試

5 個核心組件已完成深度檢查、重構和瀏覽器測試：

1. **Banner** - useReducer 管理狀態，導航和拖曳功能正常
2. **GoTop** - useMemo 衍生狀態，修復 useScroll hook 無限迴圈
3. **Dialog** - useMemo + useLayoutEffect，修復測試頁面
4. **Selector** - useMemo 衍生狀態，修復 useWindowSize hook
5. **Message** - useReducer + useMemo，新建測試頁面

### 🔧 修復的 Hooks

- `useScroll.ts` - 實作 snapshot 快取機制
- `useWindowSize.ts` - 使用常數快取 server snapshot

### 📝 關鍵發現

**useSyncExternalStore 最佳實踐**:
- getSnapshot 和 getServerSnapshot 必須返回穩定引用
- 相同值時應返回相同物件實例
- Server snapshot 應使用常數快取避免無限迴圈

詳細測試報告：`brain/f5d7e8a7-68a4-4e1e-a8eb-b12717526c87/components_test_report.md`

## 最新進度（2026-03-18）

### ✅ 本次完成

1. **EnterLabel** - 改用 `useEffectEvent` 取代 `useRef` + `useCallback` 遞迴動畫模式，補上元件測試
2. **SwitchButton** - 補齊 inline type imports，改成 controllable pattern，並以 callback ref 量測 icon 寬度
3. **DialogModal** - 使用 `useEffectEvent` 穩定 Escape listener，並將 body overflow 同步改為 `useLayoutEffect`
   - ⚠️ 關閉動畫表現仍需由人類開發者手動調整與最終確認

### 🧪 本次驗證

- `__tests__/components/EnterLabel.test.tsx`
- `__tests__/components/SwitchButton.test.tsx`
- `__tests__/components/DialogModal.test.tsx`

## 近期進度（2026-04-03）

### 本次完成

1. **Countdown** - 合併 mount 與 prop 變更的初始化流程，避免首輪重複啟動；callback 改以 ref 同步，但保留原本動畫流程
2. **Tabs/Content** - 補回 `isTabMoving` 對 `refreshDisable` 的影響，並收斂重複的 tab value / CSS variable 推導

### 驗證

- `__tests__/components/Countdown.test.tsx`
- `components/Tabs/Content.tsx` 目前沒有專屬測試，先以 ESLint 驗證
