# React Hooks Refactoring Plan

## 目標

檢視整個專案的 React Hooks 使用情況，將過度依賴 `useState` 和 `useEffect` 的地方改為使用更適合的 React 19 Stable Hooks。

**核心更新 (2026-01-12):**
確認 `useEffectEvent` 在 React 19.2.0 中已可作為穩定 API 使用。我們將優先使用它來替代 `useRef` + `useCallback` 模式來處理 Effect 依賴問題。

## 多個相關 `useState` → `useReducer`

| 統計項目 | 數量 |
|----------|------|
| 組件檔案 | 110 個 |
| 自訂 Hooks | 32 個 |
| `useState` 使用次數 | 331+ |
| `useEffect` 使用次數 | 152+ |
| `useMemo` 使用次數 | 19 個檔案 ✅ |
| `useCallback` 使用次數 | 37 個檔案 ✅ |
| `useReducer` 使用次數 | 0 ❌ |
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

-   [ ] `components/Banner/index.tsx`
-   [ ] `components/DialogModal/index.tsx`
-   [ ] `components/SlideInPanel/index.tsx`
-   [ ] `components/Tabs/Bar.tsx`
-   [ ] `components/Selector/index.tsx`
-   [ ] `components/Countdown/index.tsx`
-   [ ] `components/SwitchButton/index.tsx`
-   [ ] `components/VirtualScroller/index.tsx`
-   [ ] `components/Animation/EnterLabel/index.tsx`

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

---

## 階段三：全面 Import Type 檢查（2026-02-16）

### 📋 檢查範圍

在完成核心組件的 Import Type 檢查後，需要全面檢查專案中所有使用 React 的檔案：

#### 1. Components 目錄（109 個 .tsx 檔案）
- ✅ 核心組件（30+ 個）- 已在階段一、二完成
- [ ] Demo 組件（40+ 個）
- [ ] 其他工具組件（30+ 個）

#### 2. App Pages（63 個頁面）
- [ ] `app/[locale]/**/*.tsx` - 所有頁面組件
- 重點檢查 import type 是否符合規範

#### 3. Hooks 目錄（32 個檔案）
- ✅ 已在 Phase 1 完成檢查
- ✅ Import type 全部符合規範

#### 4. Utils 目錄
- [ ] `utils/**/*.ts`
- [ ] `utils/**/*.tsx`
- 檢查是否有使用 React 類型

#### 5. 其他目錄
- [ ] `layout/**/*.tsx`
- [ ] `models/**/*.ts`（如有使用 React 類型）
- [ ] `store/**/*.ts`（如有使用 React 類型）

### 🎯 執行策略

**使用 AI 工具批次檢查**:
- 使用 `grep_search` 工具搜尋所有 React import 語句
- 使用 `find_by_name` 工具列出所有 .tsx 和 .ts 檔案
- 逐一檢查並使用 `replace_file_content` 或 `multi_replace_file_content` 修正
- **禁止使用 sed, awk, find...exec 等腳本工具**

**修正優先順序**:
1. 高頻使用的組件（Demo 組件）
2. 頁面組件（App Pages）
3. 工具函式（Utils）

### 📝 簡化處理記錄

任何在檢查過程中發現的簡化處理或需要後續完善的部分，將記錄在：
- `docs/in-progress/simplified-implementations.md`


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
