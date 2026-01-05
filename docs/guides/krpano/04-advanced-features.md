# 4. 進階功能與事件

掌握了 XML 結構與 Action 腳本後，本章將介紹如何利用事件監聽、插件整合以及模組化技巧來構建專業級的全景應用。

## 事件監聽 (`<events>`)

Krpano 的事件驅動模型允許你在特定的生命週期節點觸發自訂邏輯。這是實作「載入動畫」、「視角限制」、「自訂導航」的關鍵。

```xml
<events name="my_events" keep="true"
        onxmlcomplete="trace('XML 解析完成');"
        onpreviewcomplete="remove_loading_animation();"
        onloadcomplete="start_autorotate();"
        onviewchange="update_compass();"
        onresize="adjust_layout();"
        />
```

### 關鍵屬性
- **keep="true"**: **非常重要**。預設情況下，切換場景時 Krpano 會清除所有非 keep 的元素。如果你希望這個事件監聽器在整個遊覽過程中都持續存在（例如全局導航列的邏輯），必須設為 true。
- **onviewchange**: 當視角改變時（每一幀）都會觸發。**請勿在此放入重度運算邏輯**，否則會嚴重影響效能。

---

## 插件整合 (Plugins)

Krpano 雖然核心輕量，但透過插件可以實現 VR、陀螺儀、3D 音效等功能。

### 1. WebVR
讓全景圖支援 VR 模式（如 Google Cardboard, Oculus）。

```xml
<include url="%SWFPATH%/plugins/webvr.xml" />
<plugin name="WebVR" mobilevr_support="true" />
```
*通常官方的 `vtourskin.xml` 已經內建整合，只需開啟設定即可。*

### 2. Gyro (陀螺儀)
在行動裝置上，允許使用者透過轉動手機來觀看全景。

```xml
<plugin name="gyro" 
        url="%SWFPATH%/plugins/gyro2.js" 
        enabled="true" 
        camroll="true"
        friction="0.0" 
        velastic="0.0" 
        />
```

---

## 模組化管理 (`<include>`)

不要把所有代碼都塞進一個 `tour.xml`！隨著專案變大，良好的檔案結構至關重要。

### 推薦結構
我們建議將不同類型的邏輯拆分為獨立的 XML 檔案：

1.  **tour.xml**: 入口檔案，只負責 `<include>` 和最基礎的設定。
2.  **skin/**: 存放 UI 相關設定。
3.  **logic/actions.xml**: 存放通用的 Action 函式庫。
4.  **scenes/scene_01.xml**: 如果場景很多，可以將每個場景拆開（雖然通常 `tour.xml` 包含所有場景定義比較方便預載）。

**範例 tour.xml**:
```xml
<krpano>
    <!-- 1. 引入皮膚與樣式 -->
    <include url="skin/default_skin.xml" />
    <include url="styles/hotspots.xml" />

    <!-- 2. 引入自訂邏輯 -->
    <include url="logic/my_actions.xml" />

    <!-- 3. 定義場景 -->
    <scene name="scene1"> ... </scene>
</krpano>
```

---

## 除錯技巧 (Debugging)

### 1. Log 視窗
在 Krpano 畫面中按下 **`O`** 鍵 (英文 O)，會開啟 Log 視窗。這是最直接的除錯方式。
- 配合 `trace('Variable:', var);` 使用。
- 紅色訊息代表錯誤 (Error)，黃色代表警告 (Warning)。

### 2. Debug Mode
在初始化時開啟 debug mode (雖預設通常開啟)，或在 XML 中加入：
```xml
<krpano debugmode="true" ... >
```

### 3. 查看當前變數
在 JS Console 中，你可以直接檢查 Krpano 的內部狀態：
```javascript
// 取得全域變數
krpano.get("view.hlookat");
krpano.get("xml.scene");

// 檢查特定熱點是否存在
krpano.get("hotspot[spot1].name"); // 如果回傳 null 代表不存在
```

---

## 總結

Krpano 是一個深不可測的工具。本指南涵蓋了 React 整合、XML 結構、Action 編程與進階功能，希望能成為您開發路上的指引。更多細節，請永遠記得查閱 [Krpano 官方英文文檔](https://krpano.com/docu/)，那裡有最原始且完整的參數定義。
