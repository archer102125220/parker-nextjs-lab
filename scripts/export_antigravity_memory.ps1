<#
.SYNOPSIS
    Antigravity Memory Export Script (Windows PowerShell)
    用於匯出當前 Antigravity 代理的對話與記憶數據

.DESCRIPTION
    此腳本將 ~/.gemini/antigravity/brain/[SESSION_ID] 目錄打包為 Zip 檔案。
#>

$ErrorActionPreference = "Stop"

# 設定相關路徑
$CurrentSessionId = "ff96c932-f9bb-4b00-be7e-591d8c6d0aa9"
$UserHome = [System.Environment]::GetFolderPath("UserProfile")
$BrainRoot = Join-Path $UserHome ".gemini\antigravity\brain"
$SourceDir = Join-Path $BrainRoot $CurrentSessionId

# 獲取專案根目錄 (假設腳本在 scripts/ 下)
$ScriptPath = $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptPath -Parent) -Parent
$OutputDir = Join-Path $ProjectRoot "antigravity-exports"

# 產生檔名
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ExportFilename = "antigravity_memory_$Timestamp.zip"
$ExportPath = Join-Path $OutputDir $ExportFilename

# 1. 檢查來源
if (-not (Test-Path $SourceDir)) {
    Write-Error "❌ 錯誤：找不到記憶目錄 $SourceDir"
    exit 1
}

# 2. 建立輸出目錄
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

Write-Host "🧠 正在匯出 Antigravity 記憶 (Windows)..."
Write-Host "📍 來源: $SourceDir"
Write-Host "📂 目標: $ExportPath"

# 3. 執行壓縮
try {
    # 切換到 Brain Root 以保持相對路徑
    Push-Location $BrainRoot
    
    # 使用 Compress-Archive (PowerShell 5.0+)
    # -Update 用於覆寫或更新，這裡我們每次產生新檔名所以沒差，但為了穩定性
    Compress-Archive -Path $CurrentSessionId -DestinationPath $ExportPath -CompressionLevel Optimal
    
    Pop-Location
    
    Write-Host "✅ 匯出成功！"
    Write-Host "📦 檔案位置: $ExportPath"
    Write-Host ""
    Write-Host "💡 如何使用："
    Write-Host "1. 將此 zip 檔案複製到新電腦"
    Write-Host "2. 解壓縮到新電腦的 $UserHome\.gemini\antigravity\brain\ 目錄下"
    Write-Host "3. 參閱 docs/antigravity-migration-guide.md 進行詳細設定"
}
catch {
    Write-Error "❌ 壓縮失敗: $_"
    exit 1
}
