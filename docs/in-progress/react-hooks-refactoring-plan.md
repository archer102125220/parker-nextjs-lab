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

1.  **Effect 內部依賴優化 → `useEffectEvent`** (✨ NEW)
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

## 執行步驟

詳細進度請參考：[react-hooks-refactoring-task.md](./react-hooks-refactoring-task.md)

## 驗證計劃

```bash
yarn lint
yarn test
yarn dev:webpack  # 手動功能測試
```
