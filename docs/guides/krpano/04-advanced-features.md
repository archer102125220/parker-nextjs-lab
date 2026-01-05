# 4. 進階功能與事件詳解

本章深入探討 Krpano 的事件系統、插件整合技巧以及除錯工作流。

## 1. 全域事件系統 (`<events>`)

Krpano 的事件驅動核心。除了單個元素的 `onclick`，`<events>` 標籤用於監聽全域狀態變化。

### 屬性參考

| 事件屬性 | 觸發時機 | 典型用途 |
|----------|----------|----------|
| `onxmlcomplete` | XML 檔案解析完成，但還沒載入圖片 | 初始化變數、設定樣式 |
| `onpreviewcomplete` | 模糊預覽圖載入完成 | 顯示載入動畫 |
| `onloadcomplete` | 高解析度全景圖載入完成 | 隱藏載入動畫、開始自動旋轉 |
| `onnewscene` | 切換場景開始時 | 重置特定 UI 狀態 |
| `onremovepano` | 全景圖被移除/卸載時 | 清理計時器或監聽器 |
| `onviewchange` | 視角改變時 (每一幀) | 更新指南針、同步地圖方向 |
| `onresize` | 瀏覽器視窗大小改變 | 調整 RWD 佈局 |
| `onidle` | 使用者閒置一段時間後 (預設 5秒) | 顯示提示訊息、開始自動導覽 |
| `onkeydown` | 按下鍵盤按鍵 | 自訂快捷鍵 |

### 多重事件監聽 (Named Events)
為了避免覆蓋全域的 `<events>` (因為一個 name 只能有一個定義)，建議使用**命名事件**來組織不同功能的邏輯。

```xml
<!-- 導航列專用的事件 -->
<events name="navbar_events" keep="true" 
        onresize="adjust_navbar_layout();" 
        />

<!-- 指南針專用的事件 -->
<events name="compass_events" keep="true" 
        onviewchange="rotate_compass();" 
        />
```
*   **keep="true"**: 確保切換場景後，這些監聽器仍然存在。如果不加，切換場景後這些事件就會失效。

---

## 2. 插件 (Plugins) 深度整合

插件本質上是特殊的 `<layer>` 或 `<hotspot>`，載入了 `.js` 檔案。

### 常用官方插件

#### 1. WebVR (VR 模式)
讓專案支援 VR 頭戴裝置。
```xml
<include url="%SWFPATH%/plugins/webvr.xml" />
<plugin name="WebVR" mobilevr_support="true" mobilevr_fake_support="true" />
```
*   `mobilevr_fake_support`: 允許在桌機瀏覽器模擬手機 VR 視圖（方便除錯）。

#### 2. SoundInterface (音效介面)
支援 3D 定位音效 (隨視角轉動音量變化) 與背景音樂。
```xml
<plugin name="soundinterface"
        url="%SWFPATH%/plugins/soundinterface.js"
        rootpath=""
        preload="true"
        keep="true"
        />
<!-- 播放背景音樂 -->
<action name="start_bgm">
    playsound(bgm, 'music.mp3', 0); <!-- 0 = 無限循環 -->
</action>
```

#### 3. ScrollArea (捲動區域)
用於製作可拖曳的地圖、長選單。
```xml
<layer name="scroll_container" type="container" width="200" height="300" maskchildren="true">
    <layer name="scroll_content" url="%SWFPATH%/plugins/scrollarea.js" align="lefttop" width="200" height="1000" direction="v">
        <!-- 內容放這裡，高度超過父容器 -->
        <layer name="item1" ... y="0" />
        <layer name="item2" ... y="100" />
    </layer>
</layer>
```

---

## 3. 模組化與 Include

### 佔位符 (Placeholders)
在 `<include>` 或路徑中，可以使用特殊佔位符：

- `%SWFPATH%`: `tour.js` 所在的目錄。
- `%CURRENTXML%`: 當前 XML 檔案所在的目錄。
- `%HTMLPATH%`: HTML 頁面所在的目錄。

```xml
<include url="%SWFPATH%/plugins/webvr.xml" />
<include url="%CURRENTXML%/skin/vtourskin.xml" />
```

### 條件引入
雖然 `<include>` 本身不支援 if，但可以透過 JS 動態載入不同的 XML。
或者使用 `if` action 來判斷是否執行某段邏輯。

---

## 4. 除錯與效能優化 (Debugging & Performance)

### 除錯工作流
1.  **開啟除錯模式**: `<krpano debugmode="true" ... >`
2.  **使用 `trace()`**: 類似 `console.log`。
3.  **使用 `showlog()`**: 顯示 Krpano 內建的 Log 視窗。
4.  **檢查 XML 錯誤**: Krpano 會在解析失敗時報錯，仔細看紅色錯誤訊息，通常會指出是哪一行 XML 語法錯誤。

### 效能優化建議
1.  **限制 `onviewchange`**: 不要在這個事件中做繁重的 DOM 操作或大量的 `calc()` 計算。
2.  **正確使用 image size**: 行動裝置載入過大的 Cube 圖片會導致崩潰或卡頓 (建議 multires)。
3.  **Hotspot 數量**: 保持場景中可見的 Hotspot 數量在合理範圍 (數十個通常沒問題，數百個可能會卡)。
4.  **避免頻繁的 loadscene**: 場景切換是昂貴的操作。

### 常用除錯指令
```xml
<!-- 顯示當前視角資訊 -->
trace('hlookat:', view.hlookat, ' vlookat:', view.vlookat);

<!-- 傾印物件的所有屬性 -->
debugvar(view);
```
