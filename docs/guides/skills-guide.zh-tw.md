# Skills 指南

## 什麼是 Skills？

**Skills** 是詳細的、針對特定任務的指南，用於補充編碼標準。**Rules** 提供簡潔的核心標準，而 **Skills** 則提供包含決策樹、豐富範例和實用檢查清單的全面指導，專門用於處理複雜場景。

### Skills vs Rules

| 面向 | Rules（規則） | Skills（技能） |
|------|--------------|---------------|
| **目的** | 核心標準與原則 | 詳細的任務特定指導 |
| **長度** | 簡潔（1-2 頁） | 全面（3-10 頁） |
| **範例** | 最少 | 豐富的真實案例 |
| **使用時機** | 始終（基礎） | 特定複雜場景 |
| **格式** | 快速參考 | 逐步工作流程 |

---

## 可用的 Skills

### 🔴 高優先級 Skills

這些 Skills 處理最常見和最關鍵的場景：

#### 1. [CSS/SCSS 命名規範](.agent/skills/css-naming-convention/SKILL.md)

**使用時機**：創建組件、審查 CSS、不確定連字符與底線的使用

**主要特色**：
- 連字符 `-` vs 底線 `_` 決策樹
- HTML 屬性狀態管理
- 20+ 個真實專案範例
- 常見錯誤與修正

**快速參考**：
- 層級（子元素）→ 連字符：`.card-header`
- 多詞概念 → 底線：`.scroll_area`
- 狀態 → HTML 屬性：`css-is-active="true"`

---

#### 2. [資料庫遷移工作流程](.agent/skills/database-migration-workflow/SKILL.md)

**使用時機**：在任何資料庫架構變更之前

**主要特色**：
- 關鍵決策樹（生產環境 vs 開發環境）
- 逐步遷移工作流程
- 破壞性變更策略
- 回滾規劃

**關鍵規則**：在修改遷移之前，務必詢問「此專案是否已部署到生產環境？」

---

#### 3. [程式碼重構安全](.agent/skills/code-refactoring-safety/SKILL.md)

**使用時機**：批次程式碼修改、重構任務

**主要特色**：
- 禁止使用自動化腳本（sed、awk 等）
- AI 驅動的工具工作流程
- 匯入驗證策略
- 真實事件範例

**關鍵規則**：絕不使用腳本進行程式碼重構。使用 AI 工具（`replace_file_content`、`multi_replace_file_content`）。

---

### 🟡 中優先級 Skills

這些 Skills 協助架構和優化決策：

#### 4. [React Hooks 選擇指南](.agent/skills/react-hooks-selection/SKILL.md)

**使用時機**：選擇 hooks、重構組件、優化效能

**主要特色**：
- Hook 選擇決策樹
- useState → useReducer 重構
- useEffect → useEffectEvent 模式
- 效能優化指南

**快速參考**：
- 5+ 個相關狀態 → `useReducer`
- 昂貴的計算 → `useMemo`
- 傳遞給記憶化子組件的回調 → `useCallback`

---

#### 5. [Server vs Client 組件](.agent/skills/server-client-components/SKILL.md)

**使用時機**：創建頁面、決定 `'use client'`、優化打包大小

**主要特色**：
- Server vs Client 決策樹
- Children 模式範例
- 常見錯誤（整個頁面標記為 client）
- 效能影響

**快速參考**：預設使用 Server Components。僅在需要互動性、hooks 或瀏覽器 API 時使用 Client。

---

#### 6. [檔案組織與樣式重用](.agent/skills/file-organization/SKILL.md)

**使用時機**：決定 placeholder 與 component、組織專案結構

**主要特色**：
- Placeholder vs Component 決策樹
- 單頁 vs 多頁重用策略
- 目錄結構最佳實踐

**快速參考**：
- 單頁重用 → Placeholder（`%name`）
- 多頁重用 → Component 或全域 placeholder

---

### 🟢 低優先級 Skills

這些 Skills 處理特定技術需求：

#### 7. [Lint 政策與錯誤處理](.agent/skills/lint-policy/SKILL.md)

**使用時機**：遇到 lint 錯誤、決定 disable 註解

**關鍵規則**：絕不在沒有明確使用者指示的情況下添加 `eslint-disable` 註解。

---

#### 8. [i18n 實作模式](.agent/skills/i18n-implementation/SKILL.md)

**使用時機**：創建帶有 i18n 的頁面、修復 i18n 錯誤

**關鍵模式**：在 Server Components 中，務必在 `getTranslations` 之前呼叫 `setRequestLocale(locale)`。

---

#### 9. [建置工具與環境檢查](.agent/skills/build-tools/SKILL.md)

**使用時機**：啟動開發伺服器、建置生產版本

**關鍵規則**：務必使用 Webpack（`yarn dev:webpack`、`yarn build:webpack`）。Turbopack 與 SCSS `:export` 不相容。

---

## 如何使用 Skills

### 對於 AI Agents

1. **Skills 會在對話開始時自動載入**
2. **遇到技能描述中提到的複雜場景時參考 skills**
3. **使用決策樹**進行系統化決策
4. **遵循檢查清單**確保不遺漏任何事項

**範例工作流程**：
```
使用者：「在 users 表中新增一個欄位」
AI：[檢查資料庫遷移工作流程 Skill]
AI：「此專案是否已部署到生產環境？」
使用者：「是的」
AI：[遵循生產環境工作流程 - 創建新的遷移]
```

### 對於開發者

1. **在開始複雜任務前閱讀 skills**
2. **在程式碼審查期間使用檢查清單**
3. **不確定時參考範例**
4. **與團隊成員分享 skills**

**範例工作流程**：
- 創建新組件前 → 閱讀 CSS 命名規範 Skill
- 資料庫變更前 → 閱讀資料庫遷移工作流程 Skill
- 重構前 → 閱讀程式碼重構安全 Skill

---

## Skill 結構

每個 skill 遵循此結構：

### 🎯 何時使用此 Skill
明確的適用場景

### 📋 決策樹 / 工作流程
逐步決策過程

### ✅ 正確範例
來自專案的真實範例

### ❌ 常見錯誤
反模式與說明

### 📝 檢查清單
任務前/中/後檢查清單

### 🔗 相關規則
相關規則檔案的連結

---

## 快速參考：何時使用哪個 Skill

| 場景 | Skill |
|------|-------|
| 創建新組件樣式 | CSS/SCSS 命名規範 |
| 資料庫架構變更 | 資料庫遷移工作流程 |
| 批次程式碼重構 | 程式碼重構安全 |
| 選擇 React hooks | React Hooks 選擇指南 |
| 決定 'use client' | Server vs Client 組件 |
| 重用樣式 | 檔案組織與樣式重用 |
| Lint 錯誤 | Lint 政策與錯誤處理 |
| i18n 實作 | i18n 實作模式 |
| 啟動開發伺服器 | 建置工具與環境檢查 |

---

## 貢獻 Skills

### 何時創建新 Skill

在以下情況下創建新 skill：
1. 需要**複雜的決策制定**
2. 涉及**多個步驟**
3. **常見錯誤**經常發生
4. **真實範例**會有所幫助

### Skill 格式

```markdown
---
name: [Skill 名稱]
description: [一行描述]
---

# [Skill 名稱]

## 🎯 何時使用此 Skill
[特定場景]

## 📋 決策樹 / 工作流程
[逐步指南]

## ✅ 正確範例
[多個範例]

## ❌ 常見錯誤
[反模式與說明]

## 📝 檢查清單
[任務前/中/後檢查清單]

## 🔗 相關規則
[規則檔案連結]
```

---

## 相關文檔

- [編碼標準](./coding-standards.md) - 核心編碼標準與規則（英文）
- [編碼標準（繁體中文）](./coding-standards.zh-tw.md) - 核心編碼標準與規則
- [疑難排解](./troubleshooting.md) - 常見問題與解決方案
