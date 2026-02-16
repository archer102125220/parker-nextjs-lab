# AI Agents 配置指南

本指南說明如何在此專案中配置 AI 助手，以確保不同工具之間的程式碼生成一致性。

---

## 概述

此專案為四個主要 AI 助手提供完整的配置：

| AI 助手 | 配置類型 | 檔案 | 狀態 |
|---------|---------|------|------|
| **Cursor** | Rules | `.cursor/rules/*.mdc` (17 個檔案) | ✅ 完整 |
| **GitHub Copilot** | Rules + Skills | `.github/copilot-instructions.md`<br>`.github/instructions/*.instructions.md` (5 個檔案) | ✅ 完整 |
| **Claude** | Rules + Commands | `.claude/rules/*.md` (18 個檔案)<br>`.claude/commands/*.md` (6 個檔案) | ✅ 完整 |
| **Gemini** | Skills | `.agent/skills/*/SKILL.md` (9 個檔案) | ✅ 完整 |

---

## 配置架構

### Rules vs Skills

**Rules（全域標準）**：
- 簡潔的專案級編碼標準
- 適用於所有檔案或特定檔案類型
- 常見模式的快速參考

**Skills（任務特定指南）**：
- 複雜場景的詳細指南
- 包含決策樹、範例和檢查清單
- 逐步工作流程

---

## 1. Cursor AI

### 配置檔案

**位置**: `.cursor/rules/`

**格式**: `.mdc` (Markdown Configuration)

**結構**:
```markdown
---
description: 簡要描述
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: true
---

# Rule 內容 (Markdown)
```

### 可用 Rules（17 個檔案）

1. `typescript.mdc` - TypeScript 型別安全
2. `css-naming.mdc` - Modified BEM 命名規範
3. `react-hooks.mdc` - React hooks 選擇
4. `server-client-components.mdc` - 組件類型決策
5. `i18n.mdc` - 國際化 (next-intl 4.x)
6. `build-tools.mdc` - Webpack 配置
7. `lint-policy.mdc` - Lint 錯誤處理
8. `no-scripts.mdc` - 程式碼重構安全
9. `file-organization.mdc` - 檔案組織和樣式重用
10. `css-property-order.mdc` - CSS 屬性順序
11. `inline-styles.mdc` - Inline styles 政策
12. `runtime-data-validation.mdc` - Runtime 資料驗證
13. `security-policy.mdc` - 安全最佳實踐
14. `backend-orm.mdc` - Backend ORM (Sequelize)
15. `next-dynamic-import.mdc` - Next.js dynamic import
16. `react-stable-api.mdc` - React stable API 政策
17. `coding-standards.mdc` - 通用編碼標準

### 使用方式

Rules 會根據以下條件自動應用：
- 檔案 glob 模式（frontmatter 中的 `globs`）
- `alwaysApply` 標記
- AI 的相關性檢測

---

## 2. GitHub Copilot

### 配置檔案

#### Repository-wide Instructions
**檔案**: `.github/copilot-instructions.md`

**用途**: 適用於所有檔案的全域規則

**內容**（300+ 行）：
- 專案概述和技術棧
- TypeScript 標準
- CSS/SCSS Modified BEM 命名
- React 最佳實踐
- 國際化模式
- Build tools 要求
- 架構模式
- 資料庫遷移工作流程
- 安全要求
- Skills 系統引用

#### Path-Specific Instructions
**目錄**: `.github/instructions/`

**格式**: `NAME.instructions.md` 帶有 `applyTo` frontmatter

**可用檔案**（5 個）：

1. **typescript.instructions.md**
   ```markdown
   ---
   applyTo: "**/*.{ts,tsx,js,jsx}"
   ---
   ```
   - TypeScript 型別安全規則
   - Runtime 資料驗證
   - Lint disable 政策

2. **react.instructions.md**
   ```markdown
   ---
   applyTo: "**/*.{tsx,jsx}"
   ---
   ```
   - React 19 stable hooks
   - Hook 選擇指南
   - 要避免的反模式
   - RTK vs useContext

3. **scss.instructions.md**
   ```markdown
   ---
   applyTo: "**/*.{scss,css}"
   ---
   ```
   - Modified BEM 命名規範
   - CSS 屬性順序
   - 檔案組織
   - 樣式重用策略

4. **nextjs.instructions.md**
   - Next.js App Router 模式
   - Server vs Client components
   - i18n 實作

5. **backend.instructions.md**
   - 資料庫遷移工作流程
   - Sequelize ORM 模式
   - API 最佳實踐

### 使用方式

- **全域規則**: 自動應用於所有 Copilot 請求
- **路徑特定規則**: 在處理匹配的檔案類型時應用
- **組合**: 全域和路徑特定規則會結合使用

---

## 3. Claude AI

### 配置檔案

#### 主要指令
**檔案**: `CLAUDE.md`

**用途**: Claude 的專案級指令

#### Custom Commands
**目錄**: `.claude/commands/`

**用途**: 常見任務的可重用 slash commands

**可用 Commands**（6 個檔案）：

1. **refactor.md** - 程式碼重構
   - 改善程式碼結構
   - 應用編碼標準
   - 優化效能

2. **test.md** - 測試生成
   - 單元測試 (Jest)
   - 整合測試
   - E2E 測試 (Playwright)

3. **docs.md** - 文檔生成
   - JSDoc/TSDoc 註解
   - README 檔案
   - API 文檔

4. **review.md** - 程式碼審查
   - 品質檢查
   - 標準合規性
   - 安全審查

5. **migrate.md** - 資料庫遷移
   - 建立 migrations
   - 生產 vs 開發工作流程
   - 回滾規劃

6. **component.md** - 組件生成
   - Server/Client component 選擇
   - SCSS modules
   - TypeScript 型別

**使用方式**:
```
/refactor components/UserCard/index.tsx
/test hooks/useLocalStorage.ts
/docs components/ImageUpload/
```

#### Rules
**目錄**: `.claude/rules/`

**用途**: 與 Cursor rules 同步以保持一致性

**檔案**（18 個）：
- `README.md` - 同步指南
- 17 個 rule 檔案（從 `.cursor/rules/*.mdc` 轉換）

**同步方式**：
- Source of truth: `.cursor/rules/*.mdc`
- 轉換: 移除 YAML frontmatter，保留 Markdown 內容
- 同步腳本: `/tmp/convert-rules.sh`

---

## 4. Gemini (Antigravity Agent)

### 配置檔案

#### 主要指令
**檔案**: `GEMINI.md`

**用途**: Gemini 的專案級指令

#### Skills 系統
**目錄**: `.agent/skills/`

**用途**: 詳細的任務特定指南

**可用 Skills**（9 個檔案，3,601 行）：

1. **CSS/SCSS Naming Convention** (308 行)
   - 連字符 vs 底線決策樹
   - Modified BEM 命名
   - 20+ 真實專案範例

2. **Database Migration Workflow** (350 行)
   - 生產 vs 開發工作流程
   - 關鍵決策樹
   - 回滾策略

3. **Code Refactoring Safety** (183 行)
   - 禁止自動化腳本
   - AI 輔助重構工作流程
   - 2026-01-23 事件分析

4. **React Hooks Selection** (655 行)
   - 完整的 hook 選擇決策樹
   - useState → useReducer 重構
   - React 19 新 hooks
   - 效能優化

5. **Server vs Client Components** (625 行)
   - 組件類型決策樹
   - Children 模式範例
   - Bundle 大小優化

6. **File Organization & Style Reuse** (519 行)
   - Placeholder vs component 決策
   - 目錄結構
   - 樣式重用策略

7. **Lint Policy & Error Handling** (323 行)
   - 修復 vs 抑制決策樹
   - 常見 lint 錯誤
   - 臨時 vs 永久抑制

8. **i18n Implementation** (345 行)
   - next-intl 4.x 模式
   - setRequestLocale 要求
   - 多個命名空間

9. **Build Tools & Environment Check** (293 行)
   - Webpack vs Turbopack
   - 環境檢查工作流程
   - 端口配置

**Skill 結構**:
```markdown
---
name: Skill Name
description: 一行描述
---

# Skill Name

## 🎯 When to Use This Skill
## 📋 Decision Tree / Workflow
## ✅ Correct Examples
## ❌ Common Mistakes
## 📝 Checklist
## 💡 Pro Tips
## 🔗 Related Rules
```

---

## 同步策略

### 當前方法

**Source of Truth**: `.cursor/rules/*.mdc`

**同步目標**：
1. `.claude/rules/*.md` - 自動轉換
2. `.github/copilot-instructions.md` - 手動同步
3. `GEMINI.md` - 手動同步
4. `CLAUDE.md` - 手動同步

### 同步工作流程

1. **更新來源**: 編輯 `.cursor/rules/*.mdc`
2. **同步 Claude Rules**: 執行轉換腳本
   ```bash
   /tmp/convert-rules.sh
   ```
3. **更新全域指令**: 手動同步變更到：
   - `.github/copilot-instructions.md`
   - `GEMINI.md`
   - `CLAUDE.md`
4. **驗證**: 使用每個 AI 助手測試

### 未來自動化

計劃: `yarn sync-rules` 命令以自動化同步

---

## 使用指南

### 對開發者

**何時使用各個 AI**：
- **Cursor**: 一般編碼，內聯建議
- **GitHub Copilot**: 程式碼完成和聊天
- **Claude**: 複雜重構、審查、遷移
- **Gemini**: 任務規劃、架構決策

**一致性**: 所有 AI 遵循相同的編碼標準

### 對 AI Agents

**優先順序**：
1. 檢查相關 Skills 以獲取詳細指導
2. 遵循 Rules 以獲取一般標準
3. 參考主要指令 (GEMINI.md, CLAUDE.md)
4. 如不確定則詢問使用者

---

## 維護

### 新增 Rules

1. 在 `.cursor/rules/[name].mdc` 建立 rule
2. 為 Claude 執行同步腳本
3. 如需要更新全域指令
4. 在本指南中記錄

### 新增 Skills

1. 在 `.agent/skills/[name]/SKILL.md` 建立 skill
2. 遵循 skill 模板結構
3. 添加到 Skills Guide
4. 在相關 rules 中引用

### 更新現有 Rules

1. 更新來源檔案 (`.cursor/rules/*.mdc`)
2. 同步到其他 AI 配置
3. 使用所有 AI 助手測試
4. 更新文檔

---

## 快速參考

### 檔案位置

```
parker-nextjs-lab/
├── .agent/
│   └── skills/              # Gemini Skills (9 個檔案)
├── .cursor/
│   └── rules/               # Cursor Rules (17 個檔案)
├── .github/
│   ├── copilot-instructions.md
│   └── instructions/        # Copilot 路徑特定 (5 個檔案)
├── .claude/
│   ├── commands/            # Claude commands (6 個檔案)
│   └── rules/               # Claude rules (18 個檔案)
├── GEMINI.md                # Gemini 主要指令
└── CLAUDE.md                # Claude 主要指令
```

### 總配置

- **檔案**: 60+ 配置檔案
- **行數**: ~10,000+ 行文檔
- **覆蓋率**: 所有主要 AI 助手 100%

---

## 相關文檔

- [Skills Guide](./skills-guide.zh-tw.md) - 詳細的 Skills 文檔
- [Coding Standards](./coding-standards.zh-tw.md) - 完整的編碼標準
- [AI Agents Walkthrough](../../.gemini/antigravity/brain/.../ai-agents-walkthrough.md) - 實作細節

---

## 疑難排解

### AI 未遵循規則

1. 檢查 rule 檔案是否存在
2. 驗證 glob 模式（Cursor）
3. 檢查 `applyTo` frontmatter（Copilot）
4. 重啟 AI 助手
5. 如可用，清除 AI 快取

### Rules 衝突

1. 檢查優先順序
2. 驗證同步
3. 更新衝突的 rules
4. 記錄解決方案

### 缺少配置

1. 檢查本指南的檔案位置
2. 驗證檔案存在
3. 如需要執行同步腳本
4. 遵循模板建立缺少的檔案

---

## 貢獻

新增或更新 AI 配置時：

1. 遵循現有檔案結構
2. 維護所有 AI 之間的一致性
3. 更新本指南
4. 使用所有 AI 助手測試
5. 在 commit 訊息中記錄變更
