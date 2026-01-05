# 2. XML 結構與視覺元素詳解

本章節提供 Krpano 核心視覺元素(`<scene>`, `<view>`, `<hotspot>`, `<layer>`) 的**詳細屬性參考**與進階用法，旨在成為您的中文速查手冊。

## 1. 場景 (`<scene>`)

場景是漫遊的基本單位。切換場景時，Krpano 會清除當前場景的特定元素並載入新場景。

### 常用屬性

| 屬性 | 說明 | 範例 |
|------|------|------|
| `name` | **(必填)** 唯一識別碼，用於 `loadscene()` | `name="scene_kitchen"` |
| `title` | 場景標題，常顯示在 UI 上 | `title="現代廚房"` |
| `thumburl` | 縮圖路徑，用於導覽列 | `thumburl="panos/thumb.jpg"` |
| `onstart` | 場景**載入開始**時執行的 Action | `onstart="activatespot(spot1);"` |
| `lat` / `lng` | (選填) 地理座標 (緯度/經度)，用於地圖插件 | `lat="25.0330" lng="121.5654"` |
| `heading` | (選填) 指北針方向 (0-360) | `heading="0.0"` |

### 結構範例
```xml
<scene name="scene_01" title="客廳" onstart="" thumburl="thumb.jpg">
    <preview url="preview.jpg" />
    <image>
        <cube url="pano_%s.jpg" />
    </image>
    <view hlookat="0" vlookat="0" fov="90" />
</scene>
```

---

## 2. 視角 (`<view>`)

定義使用者進入場景時的初始視角，以及視野限制。

### 常用屬性

| 屬性 | 說明 | 預設值 |
|------|------|--------|
| `hlookat` | 水平視角 (0 ~ 360) | 0 |
| `vlookat` | 垂直視角 (-90 ~ 90) | 0 |
| `fov` | 視野範圍 (Field of View) | 90 |
| `fovmin` | 最小縮放 (拉近極限) | 1 |
| `fovmax` | 最大縮放 (拉遠極限) | 179 |
| `maxpixelzoom` | 最大像素縮放比 (防止圖片模糊) | 無限制 |
| `limitview` | 視野限制模式 | `auto` |

### limitview 模式詳解
- `auto`: 自動限制。
- `lookat`: 限制中心點只能在特定範圍內。
- `range`: 限制可視範圍。
- `off`: 不限制 (可像大風車一樣無限旋轉)。
- `fullrange`: 允許完整 360x180 檢視 (適用於完整球體全景)。

```xml
<view hlookat="0" vlookat="0" fovtype="MFOV" fov="120" fovmin="70" fovmax="140" limitview="auto" />
```

---

## 3. 熱點 (`<hotspot>`) - 3D 互動

熱點是定位在球面上的 3D 物件，會隨視角轉動。

### 坐標系
- **ath** (Angle Horizontal): 水平角度 (-180 ~ 180)。
- **atv** (Angle Vertical): 垂直角度 (-90 ~ 90)。

### 視覺屬性

| 屬性 | 說明 | 範例 |
|------|------|------|
| `url` | 圖片/資源路徑 | `url="arrow.png"` |
| `scale` | 縮放比例 | `scale="0.5"` |
| `rotate` | 自體旋轉角度 (度) | `rotate="45"` |
| `alpha` | 透明度 (0.0 ~ 1.0) | `alpha="0.8"` |
| `visible` | 是否可見 | `visible="true"` |
| `html` | (文字熱點用) 文字內容 | `html="資訊點"` |
| `zoom` | 是否隨 FOV 縮放 (true/false) | `zoom="false"` |

### 互動事件

| 事件 | 說明 |
|------|------|
| `onclick` | 點擊時觸發 |
| `onover` | 滑鼠移入時觸發 |
| `onout` | 滑鼠移出時觸發 |
| `ondown` | 按下時觸發 |
| `onup` | 放開時觸發 |
| `onloaded` | 圖片載入完成時觸發 |

### 多態熱點 (Polygonal Hotspot)
不使用圖片，而是定義一個點擊區域。
```xml
<hotspot name="poly" fillcolor="0xFF0000" fillalpha="0.5" bordercolor="0xFFFFFF" borderalpha="1.0">
    <point ath="0" atv="0" />
    <point ath="10" atv="0" />
    <point ath="10" atv="10" />
    <point ath="0" atv="10" />
</hotspot>
```

---

## 4. 圖層 (`<layer>`) - 2D UI 介面

圖層固定在螢幕上，適合製作按鈕、選單、地圖等 UI。它擁有最強大的排版系統。

### 2D 坐標系與對齊

| 屬性 | 說明 | 可選值 |
|------|------|--------|
| `align` | 自身對齊參考點 | `lefttop`, `top`, `righttop`, `left`, `center`, `right`, `leftbottom`, `bottom`, `rightbottom` |
| `edge` | 自身邊緣參考點 (預設同 align) | 同上 |
| `x` / `y` | 偏移量 (px 或 %) | `x="10" y="20"` |
| `width` / `height` | 寬高 (px 或 %) | `width="100%"` (常用於滿版) |

### 容器 (Container)
`type="container"` 的 Layer 可以包含其他 Layer 作為子元素。子元素的座標是相對於父容器的。

```xml
<!-- 父容器：底部滿版半透明黑條 -->
<layer name="control_bar" type="container" align="bottom" width="100%" height="50" bgcolor="0x000000" bgalpha="0.5">
    
    <!-- 子元素：左側按鈕 -->
    <layer name="btn_left" url="btn.png" align="left" x="20" onclick="..." />
    
    <!-- 子元素：右側按鈕 -->
    <layer name="btn_right" url="btn.png" align="right" x="20" onclick="..." />
    
</layer>
```

### 遮罩 (Masking)
可以使用 `mask` 屬性讓一個 Layer 只顯示在另一個 Layer 的範圍內，常用於捲動視窗或圓形裁切。
```xml
<layer name="mask_circle" url="circle.png" ... />
<layer name="image" url="photo.jpg" mask="mask_circle" ... />
```

---

## 5. 樣式 (`<style>`)

定義可重用的屬性集合。支援繼承。

| 特性 | 說明 |
|------|------|
| **定義** | `<style name="my_btn" url="btn.png" scale="0.5" />` |
| **使用** | `<layer name="btn1" style="my_btn" x="10" />` |
| **繼承** | `<style name="red_btn" parent="my_btn" bgcolor="0xFF0000" />` |
| **覆蓋** | 使用時定義的屬性優先級高於 style 定義的屬性 |

---

## 6. 資料 (`<data>`)

用於儲存大段文字、HTML 或 JSON 資料，避免在 xml 屬性中轉義字元的麻煩。

```xml
<data name="info_text"><![CDATA[
    <b>歡迎光臨</b><br>
    點擊熱點查看更多詳情...
]]></data>
```

在 Action 中使用：
```javascript
// 獲取 data 內容
var content = krpano.get("data[info_text].content");
```
