<#
.SYNOPSIS
    Antigravity Memory Export Script (Windows PowerShell)
    用於匯出 Antigravity 代理的對話與記憶數據

.DESCRIPTION
    此腳本可匯出單一 Session 或全部 Sessions 的記憶數據。

.PARAMETER SessionId
    可選：指定要匯出的 Session ID。若未指定，會自動選擇最近修改的 Session。

.PARAMETER All
    若設定此參數，會匯出全部 Sessions（整個 brain 目錄）。

.EXAMPLE
    .\export_antigravity_memory.ps1
    # 自動匯出最近修改的 Session

.EXAMPLE
    .\export_antigravity_memory.ps1 -All
    # 匯出全部 Sessions

.EXAMPLE
    .\export_antigravity_memory.ps1 -SessionId "ddbeace4-49b4-4a10-8a18-07f6fdb0d609"
    # 匯出指定的 Session
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$SessionId,
    
    [Parameter(Mandatory=$false)]
    [switch]$All
)

$ErrorActionPreference = "Stop"

# 設定相關路徑
$UserHome = [System.Environment]::GetFolderPath("UserProfile")
$BrainRoot = Join-Path $UserHome ".gemini\antigravity\brain"

# 檢查 BrainRoot 是否存在
if (-not (Test-Path $BrainRoot)) {
    Write-Error "❌ 錯誤：找不到 Antigravity 記憶根目錄 $BrainRoot"
    exit 1
}

# 獲取專案根目錄 (假設腳本在 scripts/ 下)
$ScriptPath = $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptPath -Parent) -Parent
$OutputDir = Join-Path $ProjectRoot "antigravity-exports"

# 產生檔名
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# 決定匯出模式
if ($All) {
    # 匯出全部 Sessions
    $SourceDir = $BrainRoot
    $ExportFilename = "antigravity_all_sessions_$Timestamp.zip"
    Write-Host "🌐 模式：匯出全部 Sessions"
    
    # 計算 Session 數量
    $SessionCount = (Get-ChildItem -Path $BrainRoot -Directory).Count
    Write-Host "📊 共有 $SessionCount 個 Sessions"
} else {
    # 匯出單一 Session
    if ([string]::IsNullOrWhiteSpace($SessionId)) {
        # 取得最近修改的 Session 目錄
        $LatestSession = Get-ChildItem -Path $BrainRoot -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        
        if (-not $LatestSession) {
            Write-Error "❌ 錯誤：找不到任何 Session 目錄於 $BrainRoot"
            exit 1
        }
        
        $CurrentSessionId = $LatestSession.Name
        Write-Host "🔍 自動偵測到最新的 Session: $CurrentSessionId"
    } else {
        $CurrentSessionId = $SessionId
        Write-Host "📌 使用指定的 Session: $CurrentSessionId"
    }
    
    $SourceDir = Join-Path $BrainRoot $CurrentSessionId
    $ExportFilename = "antigravity_memory_$Timestamp.zip"
    
    # 檢查來源 Session 是否存在
    if (-not (Test-Path $SourceDir)) {
        Write-Error "❌ 錯誤：找不到記憶目錄 $SourceDir"
        exit 1
    }
}

$ExportPath = Join-Path $OutputDir $ExportFilename

# 建立輸出目錄
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

Write-Host "🧠 正在匯出 Antigravity 記憶 (Windows)..."
Write-Host "📍 來源: $SourceDir"
Write-Host "📂 目標: $ExportPath"

# 執行壓縮
try {
    # 載入壓縮所需的 .NET 類別
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    
    # 使用 .NET ZipFile 類別進行壓縮
    Write-Host "📝 正在壓縮..."
    [System.IO.Compression.ZipFile]::CreateFromDirectory($SourceDir, $ExportPath, [System.IO.Compression.CompressionLevel]::Optimal, $true)
    
    # 驗證檔案是否真正創建成功
    if (Test-Path $ExportPath) {
        $FileSize = (Get-Item $ExportPath).Length
        Write-Host "✅ 匯出成功！"
        Write-Host "📦 檔案位置: $ExportPath"
        Write-Host "📊 檔案大小: $([math]::Round($FileSize / 1MB, 2)) MB"
        Write-Host ""
        Write-Host "💡 如何使用："
        Write-Host "1. 將此 zip 檔案複製到新電腦"
        if ($All) {
            Write-Host "2. 解壓縮到新電腦的 .gemini\antigravity\ 目錄下 (會產生 brain 資料夾)"
        } else {
            Write-Host "2. 解壓縮到新電腦的 .gemini\antigravity\brain\ 目錄下"
        }
        Write-Host "3. 參閱 docs/antigravity-migration-guide.md 進行詳細設定"
    } else {
        Write-Error "❌ 壓縮似乎成功但找不到輸出檔案: $ExportPath"
        exit 1
    }
}
catch {
    Write-Error "❌ 壓縮失敗: $_"
    exit 1
}
