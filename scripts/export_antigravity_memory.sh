#!/bin/bash

# Antigravity Memory Export Script
# 此腳本用於匯出 Antigravity 代理的對話與記憶數據 (Brain Directory)
# 
# 使用方式：
#   ./export_antigravity_memory.sh              # 匯出最新的 Session
#   ./export_antigravity_memory.sh --all        # 匯出全部 Sessions
#   ./export_antigravity_memory.sh <session_id> # 匯出指定的 Session

BRAIN_ROOT="$HOME/.gemini/antigravity/brain"

# 設定輸出目錄 (專案根目錄下的 antigravity-exports)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_ROOT/antigravity-exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 檢查 Brain Root 是否存在
if [ ! -d "$BRAIN_ROOT" ]; then
    echo "❌ 錯誤：找不到 Antigravity 記憶根目錄 $BRAIN_ROOT"
    exit 1
fi

# 解析參數
EXPORT_ALL=false
SESSION_ID=""

if [ "$1" = "--all" ] || [ "$1" = "-a" ]; then
    EXPORT_ALL=true
elif [ -n "$1" ]; then
    SESSION_ID="$1"
fi

# 決定匯出模式
if [ "$EXPORT_ALL" = true ]; then
    # 匯出全部 Sessions
    SOURCE_DIR="$BRAIN_ROOT"
    EXPORT_FILENAME="antigravity_all_sessions_${TIMESTAMP}.zip"
    echo "🌐 模式：匯出全部 Sessions"
    
    # 計算 Session 數量
    SESSION_COUNT=$(find "$BRAIN_ROOT" -maxdepth 1 -type d | wc -l)
    SESSION_COUNT=$((SESSION_COUNT - 1))  # 扣掉根目錄本身
    echo "📊 共有 $SESSION_COUNT 個 Sessions"
else
    # 匯出單一 Session
    if [ -z "$SESSION_ID" ]; then
        # 自動偵測最新的 Session
        LATEST_SESSION=$(ls -td "$BRAIN_ROOT"/*/ 2>/dev/null | head -1 | xargs -I {} basename {})
        
        if [ -z "$LATEST_SESSION" ]; then
            echo "❌ 錯誤：找不到任何 Session 目錄於 $BRAIN_ROOT"
            exit 1
        fi
        
        SESSION_ID="$LATEST_SESSION"
        echo "🔍 自動偵測到最新的 Session: $SESSION_ID"
    else
        echo "📌 使用指定的 Session: $SESSION_ID"
    fi
    
    SOURCE_DIR="$BRAIN_ROOT/$SESSION_ID"
    EXPORT_FILENAME="antigravity_memory_${TIMESTAMP}.zip"
    
    # 檢查來源 Session 是否存在
    if [ ! -d "$SOURCE_DIR" ]; then
        echo "❌ 錯誤：找不到記憶目錄 $SOURCE_DIR"
        exit 1
    fi
fi

# 建立輸出目錄
mkdir -p "$OUTPUT_DIR"

echo "🧠 正在匯出 Antigravity 記憶..."
echo "📍 來源: $SOURCE_DIR"
echo "📂 目標: $OUTPUT_DIR/$EXPORT_FILENAME"

# 執行壓縮
if [ "$EXPORT_ALL" = true ]; then
    # 匯出整個 brain 目錄
    cd "$(dirname "$BRAIN_ROOT")" || exit
    FOLDER_NAME=$(basename "$BRAIN_ROOT")
else
    # 匯出單一 Session
    cd "$BRAIN_ROOT" || exit
    FOLDER_NAME="$SESSION_ID"
fi

if command -v zip >/dev/null 2>&1; then
    zip -r "$OUTPUT_DIR/$EXPORT_FILENAME" "$FOLDER_NAME" -x "*.DS_Store"
    
    if [ $? -eq 0 ]; then
        FILE_SIZE=$(du -h "$OUTPUT_DIR/$EXPORT_FILENAME" | cut -f1)
        echo "✅ 匯出成功！"
        echo "📦 檔案位置: $OUTPUT_DIR/$EXPORT_FILENAME"
        echo "📊 檔案大小: $FILE_SIZE"
        echo ""
        echo "💡 如何使用："
        echo "1. 將此 zip 檔案複製到新電腦"
        if [ "$EXPORT_ALL" = true ]; then
            echo "2. 解壓縮到新電腦的 ~/.gemini/antigravity/ 目錄下 (會產生 brain 資料夾)"
        else
            echo "2. 解壓縮到新電腦的 ~/.gemini/antigravity/brain/ 目錄下"
        fi
        echo "3. 參閱 docs/antigravity-migration-guide.md 進行詳細設定"
    else
        echo "❌ 壓縮失敗"
        exit 1
    fi
elif command -v tar >/dev/null 2>&1; then
    EXPORT_FILENAME="${EXPORT_FILENAME%.zip}.tar.gz"
    tar -czvf "$OUTPUT_DIR/$EXPORT_FILENAME" "$FOLDER_NAME"
    
    if [ $? -eq 0 ]; then
        FILE_SIZE=$(du -h "$OUTPUT_DIR/$EXPORT_FILENAME" | cut -f1)
        echo "✅ 匯出成功！(使用 tar.gz 格式)"
        echo "📦 檔案位置: $OUTPUT_DIR/$EXPORT_FILENAME"
        echo "📊 檔案大小: $FILE_SIZE"
    else
        echo "❌ 壓縮失敗"
        exit 1
    fi
else
    echo "⚠️ 系統未安裝 zip 或 tar，將執行普通複製..."
    cp -r "$SOURCE_DIR" "$OUTPUT_DIR/antigravity_memory_${TIMESTAMP}"
    echo "✅ 複製成功！資料夾位於 $OUTPUT_DIR/antigravity_memory_${TIMESTAMP}"
fi
