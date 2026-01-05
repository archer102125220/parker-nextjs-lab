# Krpano 功能特性指南

除了強大的 Action Scripting 之外，Krpano 還擁有許多核心功能，用於構建豐富的全景體驗。本文件介紹這些關鍵特性，並提供官方參考連結。

## 1. 場景 (Scenes) 與 視角 (View)

Krpano 主要透過 `<scene>` 標籤來定義不同的全景圖。每個場景可以有自己獨立的視角設定。

- **功能**：定義全景圖片來源 (Image Source)、預覽圖 (Preview)、初始視角 (hlookat, vlookat, fov)。
- **常用標籤**：
    - `<preview>`: 載入時的模糊預覽圖。
    - `<image>`: 定義 Cube 或 Spherical 全景圖來源。
    - `<view>`: 設定視角限制 (limitview)、FOV 範圍 (fovmin, fovmax) 與起始位置。

> 🔗 **官方文件**
> - [Scene Element](https://krpano.com/docu/xml/#scene)
> - [View Element](https://krpano.com/docu/xml/#view)

---

## 2. 熱點 (Hotspots) 與 圖層 (Layers)

用於在全景圖中添加互動元素。

- **Hotspot (熱點)**：
    - 定位在 3D 空間中 (ath, atv)。
    - 跟隨全景圖旋轉。
    - 用途：場景切換箭頭、資訊標籤、3D 物件。
    
- **Layer (圖層/容器)**：
    - 定位在 2D 螢幕坐標上 (align, x, y)。
    - 固定在螢幕上，不隨全景旋轉。
    - 用途：UI 按鈕、Logo、地圖、導覽列。
    - 支援父子階層 (parent 屬性)，可用來製作複雜 UI。

> 🔗 **官方文件**
> - [Hotspot Element](https://krpano.com/docu/xml/#hotspot)
> - [Layer Element](https://krpano.com/docu/xml/#layer)

---

## 3. 事件監聽 (Events)

Krpano 提供了全域與特定元素的事件系統，可在特定時機觸發 Action。

- **全域事件 (`<events>`)**：
    - `onxmlcomplete`: XML 解析完成時。
    - `onpreviewcomplete`: 預覽圖載入完成。
    - `onloadcomplete`: 全景圖載入完成。
    - `onresize`: 視窗大小改變。
    - `onviewchange`: 視角改變時 (每幀觸發，需小心效能)。
    
- **元素事件**：
    - `onclick`: 點擊時。
    - `onhover`: 滑鼠懸停時。
    - `ondown/onup`: 按下/放開。

> 🔗 **官方文件**
> - [Events Element](https://krpano.com/docu/xml/#events)

---

## 4. 插件 (Plugins)

Krpano 擁有豐富的插件生態系統，可擴充功能。雖然 `<plugin>` 標籤在舊版常用，新版建議統一使用 `<layer>` 或 `<hotspot>` 載入外部 JS/SWF 資源。

- **常用內建插件**：
    - **WebVR**: 支援 VR 模式 (Cardboard, Oculus 等)。
    - **Gyro**: 使用手機陀螺儀控制視角。
    - **SoundInterface**: 播放背景音樂或 3D 音效。
    - **ScrollArea**: 用於製作可捲動的選單或地圖。

> 🔗 **官方文件**
> - [Plugins](https://krpano.com/plugins/)
> - [WebVR Plugin](https://krpano.com/plugins/webvr/)

---

## 5. 樣式 (Style)

類似 CSS Class，可以定義一組屬性集合，讓多個元素共用。

```xml
<style name="icon_style" url="icon.png" scale="0.5" />
<hotspot name="spot1" style="icon_style" ath="0" atv="0" />
<hotspot name="spot2" style="icon_style" ath="90" atv="0" />
```

- **優點**：減少重複代碼，方便統一修改外觀。
- **繼承**：Style 也可以繼承其他的 Style。

> 🔗 **官方文件**
> - [Style Element](https://krpano.com/docu/xml/#style)

---

## 6. 資料 (Data)

用於儲存長文本或 HTML 內容，避免 XML 屬性被特殊字元干擾。通常配合 HTML 顯示插件使用。

```xml
<data name="info_html">
    <![CDATA[
        <h1>歡迎來到 Krpano</h1>
        <p>這是一段 HTML 內容。</p>
    ]]>
</data>
```

> 🔗 **官方文件**
> - [Data Element](https://krpano.com/docu/xml/#data)

---

## 7. 包含 (Include)

將 XML 拆分為多個檔案，利於模組化管理。

```xml
<include url="skin/vtourskin.xml" />
<include url="custom_actions.xml" />
```

- 建議將「皮膚/UI」、「Action 邏輯」、「場景資料」分開存放。

> 🔗 **官方文件**
> - [Include Element](https://krpano.com/docu/xml/#include)

---

## 參考總覽

| 功能 | 說明 | 連結 |
|------|------|------|
| **XML 結構** | 完整的 XML 標籤參考手冊 | [XML Reference](https://krpano.com/docu/xml/) |
| **JS 介面** | Javascript 與 Krpano 的互動 API | [Javascript Interface](https://krpano.com/docu/js/) |
| **工具** | 官方提供的與全景圖製作工具 (Make VTour) | [Krpano Tools](https://krpano.com/tools/) |
