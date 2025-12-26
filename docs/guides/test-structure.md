# 測試結構說明 (Test Structure Documentation)

本專案採用業界標準的測試資料夾分離結構。

## 📁 資料夾結構

```
parker-nextjs-lab/
├── __tests__/              # Jest 單元測試 (Unit Tests)
│   ├── accessibility/      # 無障礙測試 (jest-axe)
│   ├── components/         # 組件測試
│   └── hooks/              # Hooks 測試
│
├── tests/                  # Playwright E2E 測試 (End-to-End)
│   └── browser-compatibility.spec.ts
│
├── jest.config.ts          # Jest 配置
└── playwright.config.ts    # Playwright 配置
```

## 🔧 為什麼分開？

| 資料夾 | 測試框架 | 測試類型 | 執行時機 |
|--------|----------|----------|---------|
| `__tests__/` | Jest + RTL | 單元測試、組件測試 | 每次 commit |
| `tests/` | Playwright | 瀏覽器 E2E 測試 | CI/CD、手動 |

### 這是常見做法嗎？

**是的！** 這是業界標準做法：
- `__tests__` 是 Jest 的預設慣例
- `tests` 是 Playwright 的預設資料夾
- Next.js 官方範例也使用這種結構

## 🚀 執行測試

### Jest 單元測試
```bash
# 執行所有單元測試
yarn test

# 執行特定測試
yarn test __tests__/accessibility/a11y.test.tsx

# 監視模式
yarn test:watch

# 覆蓋率報告
yarn test:coverage
```

### Playwright E2E 測試
```bash
# 執行所有 E2E 測試
npx playwright test

# 執行特定測試
npx playwright test tests/browser-compatibility.spec.ts

# 指定瀏覽器
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# 開啟測試報告
npx playwright show-report
```

## 📊 測試統計

| 類型 | 數量 | 狀態 |
|------|------|------|
| 單元測試 | 195 | ✅ 通過 |
| 無障礙測試 | 6 | ✅ 通過 |
| E2E 測試 | 12 | ✅ 通過 |

---

**更新日期**: 2025-12-26
