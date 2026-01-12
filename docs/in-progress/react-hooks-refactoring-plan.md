# React Hooks Refactoring Plan

## 目標

檢視整個專案的 React Hooks 使用情況，將過度依賴 `useState` 和 `useEffect` 的地方改為使用更適合的 React 19 Stable Hooks。

## 現況分析

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

1. **多個相關 `useState` → `useReducer`**
   - [Drawer/index.tsx](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/components/Drawer/index.tsx) (9 useState)
   - [Tabs/Bar.tsx](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/components/Tabs/Bar.tsx) (12 useState)

2. **不需要觸發 re-render 的值 → `useRef`**
   - Timer ID、Interval ID 相關的 state

3. **昂貴計算未 memo 化 → `useMemo`**
   - `.filter(...).map(...)` 鏈式操作

4. **傳給子組件的 callback 未 memo 化 → `useCallback`**

### 🟡 中優先級

5. **表單處理 → `useActionState` + `useFormStatus`**
6. **非阻塞 UI 更新 → `useTransition`**

### 🟢 低優先級

7. **樂觀更新 → `useOptimistic`**

## 執行步驟

詳細進度請參考：[react-hooks-refactoring-task.md](./react-hooks-refactoring-task.md)

## 驗證計劃

```bash
yarn lint
yarn test
yarn dev:webpack  # 手動功能測試
```
