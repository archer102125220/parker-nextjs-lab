# 常見問題排解 (Troubleshooting Guide)

> 記錄專案開發中遇到的問題及解決方案

---

## React DevTools 導致的 Suspense 邊界錯誤

### 錯誤訊息
```
React instrumentation encountered an error: Error: We are cleaning up async info that was not on the parent Suspense boundary. This is a bug in React.
```

### 發生情境
- 僅在開發環境出現
- 使用客戶端導航（點擊連結）時觸發
- 直接透過 URL 訪問頁面不會出現
- 只在安裝了 React DevTools 瀏覽器擴充功能時發生

### 根本原因
這是 **React DevTools 瀏覽器擴充功能**的 bug，不是程式碼問題。React DevTools 在處理 React 19 的 async Suspense boundaries 時存在相容性問題。

### 官方討論
- [Next.js GitHub Discussion #84973](https://github.com/vercel/next.js/discussions/84973)
- [React DevTools Issue #31025](https://github.com/facebook/react/issues/31025)

### 解決方案

| 方案 | 操作 | 效果 |
|------|------|------|
| **方案 1** | 停用 React DevTools 瀏覽器擴充功能 | ✅ 錯誤完全消失 |
| **方案 2** | 使用無痕模式測試 | ✅ 錯誤不會出現 |
| **方案 3** | 等待 React DevTools 官方更新 | ⏳ 尚未發布修復 |

### 重要說明
- ✅ **程式碼沒有問題** - 這是外部工具的 bug
- ✅ **不影響生產環境** - DevTools 只在開發時運行
- ✅ **不影響功能** - 網站功能完全正常
- ⚠️ 這個錯誤只在開發環境出現

### 最佳實踐（仍建議遵循）
雖然這個錯誤是 DevTools 的問題，但以下做法仍是 next-intl 的最佳實踐：

```tsx
// ✅ 正確：setRequestLocale 在其他 await 之前調用
async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);  // 首先設定 locale
  
  const headers = await headers();  // 其他 async 操作
  const t = await getTranslations('namespace');
  // ...
}
```

---

## 記錄日期
- **2025-12-28**: 首次記錄此問題
