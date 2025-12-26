# 測試結構說明

本專案採用業界標準的測試資料夾分離結構。

## 📁 資料夾結構

```
parker-nextjs-lab/
├── __tests__/              # Jest 單元測試
│   ├── accessibility/      # 無障礙測試 (jest-axe)
│   ├── components/         # 組件測試
│   └── hooks/              # Hooks 測試
│
├── tests/                  # Playwright E2E 測試
│   └── browser-compatibility.spec.ts
│
├── jest.config.ts          # Jest 配置
└── playwright.config.ts    # Playwright 配置
```

## 🔧 為什麼分開？

| 資料夾 | 測試框架 | 測試類型 |
|--------|----------|----------|
| `__tests__/` | Jest + RTL | 單元/組件測試 |
| `tests/` | Playwright | E2E 測試 |

**這是業界標準做法**：`__tests__` 是 Jest 預設，`tests` 是 Playwright 預設。

## 🚀 執行測試

```bash
# Jest
yarn test

# Playwright
npx playwright test
```

---

**更新日期**: 2025-12-26
