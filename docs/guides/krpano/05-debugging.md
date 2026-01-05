# Krpano 除錯與開發工具指南

雖然 Krpano 沒有完全像 A-Frame Inspector 那樣內建的圖形化「場景圖 (Scene Graph) 檢測器」，但它擁有一套相當強大的除錯工具集，可協助開發者進行問題排查與參數調校。

## 1. 啟用除錯模式 (Debug Mode) 與 Log 視窗

這是最基礎也最重要的工具。它能顯示錯誤訊息、`trace()` 輸出以及載入狀態。

### 如何啟用

**方法一：透過 XML (靜態)**
在 `public/krpano/tour.xml` 根標籤 `<krpano>` 中加入 `debugmode="true"`：

```xml
<krpano version="1.23" title="Virtual Tour" debugmode="true">
    ...
</krpano>
```

**方法二：透過程式碼 (動態，推薦)**
本專案的 `Krpano` 組件已支援 `debug` prop。只需在組件上設定 `debug={true}` 即可動態開啟除錯模式，無需修改 XML。

```tsx
<Krpano debug={isDebug} ... />
```

### 如何使用

- **開啟 Log 視窗**：在全景圖中按下鍵盤 **`~` (Tilde)** 鍵（位於 ESC 鍵下方）。
    - *舊版 Krpano (1.20.4 之前) 預設為 `O` 鍵，若您的版本較舊可嘗試 `O`。*
- **程式碼控制**：在 XML action 或 JS 中執行 `showlog(true);`。
- **互動指令**：在 Log 視窗底部的輸入框直接輸入 Action 代碼並執行（類似瀏覽器的 Console）。
    - 例如輸入 `trace(view.hlookat);` 來查看當前視角。
    - 輸入 `trace(xml.scene);` 查看當前場景名稱。

## 2. 使用內建變數檢視器 (Debugvar Plugin)

Krpano 提供 `debugvar` action，可以將物件的所有屬性印在 Log 中，方便檢視物件狀態。

```xml
<!-- 範例：檢查某個 hotspot 的所有屬性 -->
<action name="inspect_hotspot">
    debugvar(hotspot[spot1]);
</action>
```

## 3. VTour Editor (虛擬導覽編輯器)

這是 Krpano 官方提供的一個視覺化外掛，通常包含在 `vtourskin.xml` 中。它允許開發者直接在畫面上拖拉 Hotspot、設定初始視角 (View) 等。

如果是使用官方 Droplet 建立的專案，通常會在 URL 加上 `?initvars.design=flat` 之類的參數開啟類似編輯模式的介面。

## 4. Options Plugin (選配)

官方有一個 `plugins/options.xml` (需另外引入)，它會在畫面右側提供一個面板，讓你即時調整許多參數（如 Flash/HTML5 模式切換、渲染品質、滑鼠控制靈敏度等）。

## 5. 在 Next.js Component 中控制 Debug 模式

在 `components/Krpano.tsx` 的實作中，你可以透過 Props 來動態控制是否開啟 Debug 模式，而不需要每次都修改 XML 檔案。

### 實作建議

```tsx
// components/Krpano.tsx

// 1. 定義 Prop
export interface KrpanoProps {
  // ... 其他 props
  debug?: boolean;
}

// 2. 在 embedpano 初始化時設定
const initPano = async () => {
  // ...
  window.embedpano({
    // ...
    // 方法 A：透過 initvars 傳遞變數給 XML
    initvars: {
      debugmode: debug // 在 XML 中可以使用 get(debugmode) 來判斷
    },
    // 方法 B：動態設定 (本專案採用)
    krpano.set('debugmode', debug);
    krpano.call(`showlog(${debug})`);
  }, [debug]);
};
```
