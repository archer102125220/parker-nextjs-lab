<#
.SYNOPSIS
    Antigravity Memory Import Script (Windows PowerShell)
    用於將匯出的 Antigravity 記憶還原到本機

.PARAMETER ZipFile
    要匯入的 zip 檔案路徑。若未指定，將自動尋找 antigravity-exports/ 下最新的備份。

.EXAMPLE
    .\import_antigravity_memory.ps1
    .\import_antigravity_memory.ps1 -ZipFile "C:\Users\Parker\Downloads\antigravity_memory_xxx.zip"
#>

param(
    [string]$ZipFile
)

$ErrorActionPreference = "Stop"

$UserHome = [System.Environment]::GetFolderPath("UserProfile")
$BrainRoot = Join-Path $UserHome ".gemini\antigravity\brain"

# 若未指定 zip 檔，嘗試自動尋找
if (-not $ZipFile) {
    $ScriptPath = $MyInvocation.MyCommand.Path
    $ProjectRoot = Split-Path (Split-Path $ScriptPath -Parent) -Parent
    $ExportsDir = Join-Path $ProjectRoot "antigravity-exports"
    
    if (Test-Path $ExportsDir) {
        $LatestZip = Get-ChildItem -Path $ExportsDir -Filter "*.zip" | 
                     Sort-Object LastWriteTime -Descending | 
                     Select-Object -First 1
        if ($LatestZip) {
            $ZipFile = $LatestZip.FullName
        }
    }
}

# 檢查 zip 檔是否存在
if (-not $ZipFile -or -not (Test-Path $ZipFile)) {
    Write-Host "❌ 錯誤：找不到備份檔案" -ForegroundColor Red
    Write-Host ""
    Write-Host "使用方式："
    Write-Host "  .\import_antigravity_memory.ps1 -ZipFile <zip檔案路徑>"
    Write-Host ""
    Write-Host "範例："
    Write-Host "  .\import_antigravity_memory.ps1 -ZipFile `"C:\Users\Parker\Downloads\antigravity_memory_xxx.zip`""
    Write-Host ""
    Write-Host "或將 zip 檔放入 antigravity-exports\ 目錄後直接執行此腳本"
    exit 1
}

Write-Host "🧠 正在匯入 Antigravity 記憶..." -ForegroundColor Cyan
Write-Host "📦 來源: $ZipFile"
Write-Host "📍 目標: $BrainRoot"

# 1. 建立目標目錄
if (-not (Test-Path $BrainRoot)) {
    New-Item -ItemType Directory -Path $BrainRoot -Force | Out-Null
}

# 2. 解壓縮
try {
    Expand-Archive -Path $ZipFile -DestinationPath $BrainRoot -Force
    
    Write-Host ""
    Write-Host "✅ 匯入成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 後續步驟："
    Write-Host "1. 開啟新的 Antigravity 對話"
    Write-Host "2. 告訴 Agent 參考 $BrainRoot 下的舊紀錄"
    Write-Host "3. 或直接將重要知識整理到專案的 docs\ 目錄中"
}
catch {
    Write-Error "❌ 解壓縮失敗: $_"
    exit 1
}
