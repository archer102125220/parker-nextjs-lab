#!/bin/bash

# Antigravity Memory Export Script
# 此腳本用於匯出當前 Antigravity 代理的對話與記憶數據 (Brain Directory)
# 匯出內容包含：Artifacts (計畫、報告), Logs (對話紀錄), Screenshots (截圖)

# 設定當前 Session ID (此 ID 為當前代理實例的唯一識別碼)
CURRENT_SESSION_ID="ff96c932-f9bb-4b00-be7e-591d8c6d0aa9"
BRAIN_ROOT="$HOME/.gemini/antigravity/brain"
SOURCE_DIR="$BRAIN_ROOT/$CURRENT_SESSION_ID"

# 設定輸出目錄 (專案根目錄下的 antigravity-exports)
PROJECT_ROOT=$(pwd)
OUTPUT_DIR="$PROJECT_ROOT/antigravity-exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_FILENAME="antigravity_memory_${TIMESTAMP}.zip"

# 1. 檢查來源是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ 錯誤：找不到記憶目錄 $SOURCE_DIR"
    exit 1
fi

# 2. 建立輸出目錄
mkdir -p "$OUTPUT_DIR"

echo "🧠 正在匯出 Antigravity 記憶..."
echo "📍 來源: $SOURCE_DIR"
echo "📂 目標: $OUTPUT_DIR/$EXPORT_FILENAME"

# 3. 執行壓縮
# 切換到腦部根目錄以保持相對路徑結構乾淨
cd "$BRAIN_ROOT" || exit
if command -v zip >/dev/null 2>&1; then
    zip -r "$OUTPUT_DIR/$EXPORT_FILENAME" "$CURRENT_SESSION_ID" -x "*.DS_Store"
    
    if [ $? -eq 0 ]; then
        echo "✅ 匯出成功！"
        echo "📦 檔案位置: $OUTPUT_DIR/$EXPORT_FILENAME"
        echo ""
        echo "💡 如何使用："
        echo "1. 將此 zip 檔案複製到新電腦"
        echo "2. 解壓縮到新電腦的 ~/.gemini/antigravity/brain/ 目錄下"
        echo "3. 參閱 docs/antigravity-migration-guide.md 進行詳細設定"
    else
        echo "❌ 壓縮失敗"
        exit 1
    fi
else
    echo "⚠️ 系統未安裝 zip 指令，將執行普通複製..."
    cp -r "$SOURCE_DIR" "$OUTPUT_DIR/antigravity_memory_${TIMESTAMP}"
    echo "✅ 複製成功！資料夾位於 $OUTPUT_DIR/antigravity_memory_${TIMESTAMP}"
fi
