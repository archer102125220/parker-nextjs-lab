#!/bin/bash

# Antigravity Memory Import Script (Mac/Linux)
# 此腳本用於將匯出的 Antigravity 記憶還原到本機

set -e

BRAIN_ROOT="$HOME/.gemini/antigravity/brain"

# 使用參數傳入的 zip 檔，或自動尋找最新的備份
if [ -n "$1" ]; then
    ZIP_FILE="$1"
else
    # 尋找 antigravity-exports 目錄下最新的 zip 檔
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
    EXPORTS_DIR="$PROJECT_ROOT/antigravity-exports"
    
    if [ -d "$EXPORTS_DIR" ]; then
        ZIP_FILE=$(ls -t "$EXPORTS_DIR"/*.zip 2>/dev/null | head -n 1)
    fi
fi

# 檢查 zip 檔是否存在
if [ -z "$ZIP_FILE" ] || [ ! -f "$ZIP_FILE" ]; then
    echo "❌ 錯誤：找不到備份檔案"
    echo ""
    echo "使用方式："
    echo "  $0 [zip檔案路徑]"
    echo ""
    echo "範例："
    echo "  $0 ~/Downloads/antigravity_memory_20260105_104237.zip"
    echo ""
    echo "或將 zip 檔放入 antigravity-exports/ 目錄後直接執行此腳本"
    exit 1
fi

echo "🧠 正在匯入 Antigravity 記憶..."
echo "📦 來源: $ZIP_FILE"
echo "📍 目標: $BRAIN_ROOT"

# 1. 建立目標目錄
mkdir -p "$BRAIN_ROOT"

# 2. 解壓縮
if command -v unzip >/dev/null 2>&1; then
    unzip -o "$ZIP_FILE" -d "$BRAIN_ROOT"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 匯入成功！"
        echo ""
        echo "💡 後續步驟："
        echo "1. 開啟新的 Antigravity 對話"
        echo "2. 告訴 Agent 參考 ~/.gemini/antigravity/brain/ 下的舊紀錄"
        echo "3. 或直接將重要知識整理到專案的 docs/ 目錄中"
    else
        echo "❌ 解壓縮失敗"
        exit 1
    fi
else
    echo "❌ 系統未安裝 unzip 指令，請手動解壓縮到 $BRAIN_ROOT"
    exit 1
fi
