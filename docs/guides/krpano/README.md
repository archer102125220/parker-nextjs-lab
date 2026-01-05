# Krpano 開發者指南 (中文版)

本指南旨在為開發者提供一份完整、可實踐的 Krpano 中文技術文檔。鑑於 Krpano 官方文檔多為英文且社群資源分散，本系列文章整理了從基礎整合到進階 Action 腳本的核心知識，並結合 React/Next.js 實戰範例。

## 目錄

### 1. [整合與初始化](./01-integration.md)
   - 如何在 Next.js / React 專案中載入 Krpano
   - 封裝 `Krpano` 組件
   - 處理響應式 (Reactivity) 更新
   - TypeScript 型別定義

### 2. [XML 結構與視覺元素](./02-xml-and-layers.md)
   - XML 檔案結構 (`tour.xml`)
   - 場景 (`<scene>`) 與 視角 (`<view>`)
   - 熱點 (`<hotspot>`) 與 互動 3D 元素
   - 圖層 (`<layer>`) 與 2D UI 介面
   - 樣式 (`<style>`) 的重用繼承

### 3. [Action 腳本編程](./03-actions-scripting.md)
   - Action 定義與呼叫
   - 語法基礎：變數、表達式、計算
   - 控制邏輯：`if`, `loop`, `for`
   - 常用指令集錦
   - JavaScript 與 Action 的雙向交互

### 4. [進階功能與事件](./04-advanced-features.md)
   - 事件系統 (`<events>`)
   - 插件 (Plugins) 應用 (WebVR, Gyro)
   - `include` 模組化管理
   - 除錯技巧

## 為什麼選擇 Krpano？

Krpano 是目前市場上功能最強大、靈活性最高的前端全景查看器之一。雖然學習曲線較陡峭，但其基於 XML 的組件系統和強大的 Action Scripting 語言，能讓你創造出高度客製化的虛擬導覽體驗。

## 快速開始

如果您正在維護本專案，請參考 `components/Krpano.tsx` 與 `public/krpano/` 目錄下的檔案結構。本指南中的範例代碼大多基於此專案的實作方式。
