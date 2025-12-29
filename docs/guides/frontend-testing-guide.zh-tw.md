# 前端測試設計指南

本文件說明如何設計有意義的前端測試，避免「為測試而測試」的陷阱。

## 測試金字塔

```
      /\
     /  \  E2E 測試 (少量，高價值)
    /────\  - 完整用戶流程
   /      \ - 瀏覽器互動
  /────────\ 整合測試 (中等數量)
 /          \ - 組件間互動
/────────────\ - API 整合
  單元測試 (大量，快速)
  - 純函數
  - 工具函數
```

---

## 什麼值得測試？

### ✅ 值得單元測試

| 類型 | 原因 | 範例 |
|------|------|------|
| **純函數** | 輸入→輸出可預測 | `formatAmount(1000)` → `'1,000'` |
| **工具函數** | 核心邏輯，多處使用 | `checkPhone('0912345678')` → `true` |
| **資料轉換** | 容易出錯的轉換邏輯 | 日期格式化、金額計算 |
| **驗證邏輯** | 業務規則 | 表單驗證、權限檢查 |

### ⚠️ 謹慎測試（可能是 E2E 更適合）

| 類型 | 原因 |
|------|------|
| **組件渲染** | 難以模擬完整環境 |
| **用戶互動** | 需要瀏覽器環境 |
| **DOM 操作** | E2E 更準確 |

### ❌ 不值得單元測試

| 類型 | 原因 |
|------|------|
| **Props 是否存在** | 只是記錄程式碼 |
| **預設值是否正確** | 沒有驗證行為 |
| **CSS 樣式** | 應該用視覺回歸測試 |

---

## 好的測試 vs 壞的測試

### ❌ 壞的測試（為測試而測試）

```typescript
// 只是檢查 props 存在，沒有意義
it('應該接受 loading prop', () => {
  render(<LoadingBar loading={true} />);
  // 沒有驗證行為
});
```

### ✅ 好的測試（驗證行為）

```typescript
// 驗證行為：loading 時應該顯示載入狀態
it('loading=true 時應該顯示載入動畫', () => {
  render(<LoadingBar loading={true} />);
  expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
});

it('loading=false 時不應該顯示載入動畫', () => {
  render(<LoadingBar loading={false} />);
  expect(screen.queryByTestId('loading-bar')).not.toBeInTheDocument();
});
```

---

## 純函數測試範本

純函數是最適合單元測試的，因為它們：
- 相同輸入 → 相同輸出
- 無副作用
- 易於理解和維護

```typescript
// utils/amount-format.ts
export function formatAmount(value: number): string {
  return value.toLocaleString();
}

// __tests__/utils/amount-format.test.ts
describe('formatAmount', () => {
  // 正常情況
  it('應該格式化整數', () => {
    expect(formatAmount(1000)).toBe('1,000');
    expect(formatAmount(1000000)).toBe('1,000,000');
  });

  // 邊界情況
  it('應該處理 0', () => {
    expect(formatAmount(0)).toBe('0');
  });

  it('應該處理負數', () => {
    expect(formatAmount(-1000)).toBe('-1,000');
  });
});
```

---

## 組件行為測試範本

只測試**可觀察的行為**，不測試內部實作。

```typescript
describe('LoadingBar 行為測試', () => {
  // 測試條件渲染（這是行為）
  describe('條件顯示', () => {
    it('loading=true 時渲染載入條', () => {
      render(<LoadingBar loading={true} />);
      expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
    });

    it('loading=false 時不渲染', () => {
      render(<LoadingBar loading={false} />);
      expect(screen.queryByTestId('loading-bar')).not.toBeInTheDocument();
    });
  });

  // 測試響應式更新（這是行為）
  describe('動態更新', () => {
    it('loading 變化時應該更新顯示', () => {
      const { rerender } = render(<LoadingBar loading={false} />);
      expect(screen.queryByTestId('loading-bar')).not.toBeInTheDocument();

      rerender(<LoadingBar loading={true} />);
      expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
    });
  });
});
```

---

## E2E 測試範本

對於需要完整瀏覽器環境的測試：

```typescript
// tests/e2e-go-top.spec.ts
import { test, expect } from '@playwright/test';

test.describe('GoTop 按鈕', () => {
  test('滾動後應該顯示按鈕', async ({ page }) => {
    await page.goto('/');
    
    // 滾動到頁面底部
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // 等待按鈕出現
    await expect(page.locator('.go_top')).toBeVisible();
  });

  test('點擊按鈕應該滾動到頂部', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 500));
    
    await page.click('.go_top');
    
    // 驗證滾動到頂部
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });
});
```

---

## 測試設計檢查清單

寫測試前問自己：

1. **這個測試驗證什麼行為？**
   - 如果答不出來，可能不值得測試

2. **如果程式碼有 bug，這個測試會失敗嗎？**
   - 如果不會，測試沒有價值

3. **這個測試會因為重構而失敗嗎？**
   - 如果會（但行為沒變），測試太脆弱

4. **有更好的測試方式嗎？**
   - 單元測試 vs 整合測試 vs E2E

---

## 總結

| 測試類型 | 適用場景 | 工具 |
|----------|----------|------|
| **單元測試** | 純函數、工具函數 | Jest |
| **組件測試** | 簡單的渲染邏輯 | React Testing Library |
| **E2E 測試** | 用戶流程、互動 | Playwright |

**記住：測試的目的是捕獲 bug，而不是達到覆蓋率指標。**
