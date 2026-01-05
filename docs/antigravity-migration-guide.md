# Antigravity 記憶繼承與遷移指南

本文件說明如何將當前電腦上的 Google Antigravity 代理操作紀錄與記憶「繼承」到另一台電腦上。

## 記憶的兩種類型

在 Antigravity 系統中，記憶分為兩層：

### 1. 專案記憶 (Project Memory) - **主要繼承方式**
這類記憶**已經**存在於您的專案代碼庫中，只要透過 Git 同步，新電腦上的代理就能自動讀取。
*   **檔案位置**：
    *   `GEMINI.md`, `CLAUDE.md`: 專案特定的指令與規則。
    *   `.agent/rules/`: 更細緻的代理規則。
    *   `docs/`: 您撰寫的所有技術文檔。
*   **如何遷移**：直接 `git push` 本專案，並在新電腦 `git pull` 即可。

### 2. 會話記憶 (Session Memory) - **操作紀錄與狀態**
這包含了您與代理的具體對話紀錄、生成的暫存計畫 (Artifacts)、執行截圖與思考過程。這些資料預設儲存在您的個人目錄 (`~/.gemini/...`)，**不會**隨 Git 同步。
*   **檔案位置**：`~/.gemini/antigravity/brain/[SESSION_ID]`
*   **內容物**：
    *   `task.md`: 任務列表與進度。
    *   `walkthrough.md`: 實作過程報告。
    *   `logs/`: 詳細對話紀錄。
    *   截圖與錄影。

---

## 如何匯出會話記憶

我已為您準備了一個自動化腳本來打包當前的會話資料。

### 步驟 1：執行匯出腳本

#### macOS / Linux
在專案根目錄執行：
```bash
./scripts/export_antigravity_memory.sh
```

#### Windows
使用 PowerShell 執行：
```powershell
.\scripts\export_antigravity_memory.ps1
```

這將會在 `antigravity-exports/` 資料夾下產生一個 `.zip` 壓縮檔。

> [!WARNING]
> **請勿將匯出的檔案提交到 Git！**
> 
> `antigravity-exports/` 目錄應保持在 `.gitignore` 中（本專案已設定）。
> 匯出的 zip 檔可能包含對話紀錄與截圖，不適合公開或進入版本控制。
> 請透過其他方式（隨身碟、雲端硬碟）傳輸至新電腦。

---

## 如何匯入 (繼承) 到新電腦

我也為您準備了自動化匯入腳本。

### 方法一：使用腳本自動匯入 (推薦)

將 `.zip` 備份檔複製到新電腦的專案目錄下的 `antigravity-exports/`，然後執行：

#### macOS / Linux
```bash
bash scripts/import_antigravity_memory.sh
```

或指定特定的 zip 檔：
```bash
bash scripts/import_antigravity_memory.sh ~/Downloads/antigravity_memory_xxxx.zip
```

#### Windows
```powershell
.\scripts\import_antigravity_memory.ps1
```

或指定特定的 zip 檔：
```powershell
.\scripts\import_antigravity_memory.ps1 -ZipFile "C:\Users\Parker\Downloads\antigravity_memory_xxx.zip"
```

### 方法二：手動解壓縮

#### macOS / Linux
```bash
mkdir -p ~/.gemini/antigravity/brain
unzip ~/Downloads/antigravity_memory_xxxx.zip -d ~/.gemini/antigravity/brain/
```

#### Windows
1.  預設位置在 `C:\Users\[使用者名稱]\.gemini\antigravity\brain`
2.  將 zip 檔解壓至上述目錄
3.  確保解壓後的結構為 `...brain\[SESSION_ID]\...`

### 步驟 3：繼承記憶

### 步驟 3：繼承記憶
在新電腦上啟動 Agent 時，Agent **不會**自動接續舊的 Session ID (因為每個新對話通常是全新的 Session)。但您可以透過以下方式讓 Agent「讀取」舊記憶：

1.  **直接引用 Artifacts**：
    告訴新的 Agent：「請參考 `~/.gemini/antigravity/brain/ff96c932.../walkthrough.md` 來了解上次的進度。」
    
2.  **將關鍵資訊移入專案** (推薦)：
    如果您希望某個記憶永久保存，最好的方式是**將其轉化為文檔**。例如我們剛剛建立的 `docs/guides/krpano/` 就是一種「永久記憶」。新 Agent 只要讀取專案目錄下的 `docs/` 就能無縫接軌，這比還原 Session 資料夾更有效率。

## 常見問題 (FAQ)

### Q: 切換不同的 AI 模型會影響記憶的匯出或繼承嗎？

**A: 不會**。不同模型沒有差異。

Antigravity 的「記憶」是存儲在您電腦的**檔案系統**中（`~/.gemini/antigravity/brain/`），而非 AI 模型本身。當您切換不同的模型（例如從 Gemini 2.5 Pro 切換到其他版本），這些模型都是在讀取**相同的本地檔案**。

因此：
*   **匯出**：無論使用哪個模型，執行的都是相同的腳本，打包的是同一個目錄。
*   **繼承**：還原後，任何模型都能讀取這些資料（只要您告訴它去哪裡找）。

模型本身不持有「記憶」，它只是讀取檔案並理解內容的工具。

---

## 總結

*   **專案規則與知識**：透過 **Git** 繼承 (GEMINI.md, docs/*)。
*   **歷史對話與截圖**：透過 **匯出腳本** 還原到 `~/.gemini` 目錄供查閱。
