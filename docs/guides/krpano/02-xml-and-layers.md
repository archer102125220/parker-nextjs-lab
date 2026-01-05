# 2. XML 結構與視覺元素

Krpano 的世界是由 XML 構成的。`tour.xml` 是整個全景漫遊的靈魂，定義了場景、外觀、互動元素與邏輯。

## 基礎結構

一個標準的 Krpano XML 檔案結構如下：

```xml
<krpano version="1.23">
    <!-- 引入其他 XML -->
    <include url="skin/vtourskin.xml" />

    <!-- 全域設定 -->
    <skin_settings ... />

    <!-- 場景 1 -->
    <scene name="scene_01" title="客廳"> ... </scene>

    <!-- 場景 2 -->
    <scene name="scene_02" title="廚房"> ... </scene>
</krpano>
```

---

## 關鍵元素詳解

### 1. 場景 (`<scene>`)
場景是漫遊的基本單位。當你使用 `loadscene()` 切換時，就是切換不同的 `<scene>` 區塊。

```xml
<scene name="scene_kitchen" title="現代廚房" onstart="action_on_start();">
    
    <!-- 預覽圖 (載入時顯示的模糊圖) -->
    <preview url="panos/kitchen/preview.jpg" />

    <!-- 視角設定 -->
    <view hlookat="0" vlookat="0" fov="120" fovmin="70" fovmax="140" />

    <!-- 圖片來源 (Cube 為例) -->
    <image>
        <cube url="panos/kitchen/pano_%s.jpg" />
    </image>

    <!-- 場景專屬的熱點 -->
    <hotspot name="spot_to_livingroom" ... />
</scene>
```

### 2. 熱點 (`<hotspot>`) - 3D 空間互動
熱點是定位在 **3D 空間** 中的物件，會隨著視角旋轉。常用於場景切換或標記物體。

```xml
<hotspot name="spot1"
         url="arrow.png"
         ath="45"       <!-- 水平角度 (Horizontal Angle) -->
         atv="10"       <!-- 垂直角度 (Vertical Angle) -->
         scale="0.5"
         onclick="loadscene(scene_livingroom, null, MERGE, BLEND(1));"
         onhover="showtext('去客廳');"
         />
```
*   **ath/atv**: 定位座標，想像你在球體中心，這是經緯度。

### 3. 圖層 (`<layer>`) - 2D 介面
圖層是貼在 **2D 螢幕** 上層的元素，**不會**隨著視角旋轉。常用於製作 Logo、按鈕、地圖或導覽列。

```xml
<layer name="logo"
       url="logo.png"
       align="righttop"  <!-- 對齊方式 -->
       x="10" y="10"     <!-- 邊距 -->
       scale="0.5"
       onclick="openurl('https://example.com');"
       />
```

#### 父子階層 (Nesting)
Layer 支援嵌套，這對於製作複雜 UI 非常有用。

```xml
<layer name="menu_container" type="container" align="bottom" width="100%" height="50">
    <layer name="btn_1" url="btn.png" x="10" align="left" />
    <layer name="btn_2" url="btn.png" x="60" align="left" />
</layer>
```

### 4. 樣式 (`<style>`)
類似 CSS Class，讓你定義一組屬性並重用。

```xml
<!-- 定義樣式 -->
<style name="arrow_style" url="arrow.png" scale="0.5" onover="tween(scale,0.6);" onout="tween(scale,0.5);" />

<!-- 使用樣式 -->
<hotspot name="spot1" style="arrow_style" ath="0" atv="0" />
<hotspot name="spot2" style="arrow_style" ath="90" atv="0" />
```

---

## 實戰技巧

### 座標系統除錯
在開發階段，要在 3D 空間中精準放置熱點是很困難的。可以使用官方的 `editor` 插件，或開啟除錯模式：

1. 在瀏覽器中按 `O` 鍵打開 Log 視窗。
2. 輸入 `showlog()`。
3. 有些 skin 預設包含 Editor，可以在 URL 後面加 `?initvars.editor=true` (視 skin 實作而定)。
4. 或者直接在 action 中寫 `trace(view.hlookat, ' / ', view.vlookat);` 來取得當前視角中心點。

### HTML 內容嵌入
如果你需要在 Layer 中顯示文字或 HTML，可以使用 `<data>` 元素配合 HTML 插件。

```xml
<data name="html_content">
    <![CDATA[
        <div style="color:white; font-size:20px;">
            Hello <b>Krpano</b>
        </div>
    ]]>
</data>

<layer name="text_box" 
       url="%SWFPATH%/plugins/textfield.swf" 
       html="data:html_content" 
       />
```
*(註：新版 HTML5 viewer 不需要 `textfield.swf` 也能透過 `type="text"` 或 `html="..."` 直接支援簡易 HTML)*
