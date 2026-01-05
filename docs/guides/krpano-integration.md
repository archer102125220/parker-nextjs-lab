# Krpano Integration Guide

本專案整合了 [Krpano](https://krpano.com/) 全景查看器，支援 360 度全景影像展示、熱點 (Hotspot) 互動以及自訂 XML 動作 (Actions)。

## 1. 原生 JavaScript 初始化

Krpano 的核心是透過 `tour.js` 腳本載入，並使用 `embedpano` 函式將查看器嵌入到網頁中。

### 載入腳本
在 React 組件中，我們動態載入 `/vtour/tour.js`：

```javascript
const script = document.createElement('script');
script.src = '/vtour/tour.js';
script.async = true;
document.head.appendChild(script);
```

### 初始化 Viewer
載入完成後，`window.embedpano` 會被註冊。我們使用以下配置初始化：

```javascript
window.embedpano({
  xml: '/vtour/tour.xml', // 主要 XML 設定檔
  target: 'pano_container', // 目標 DOM ID
  html5: 'only', // 強制使用 HTML5
  mobilescale: 1.0, 
  passQueryParameters: 'startscene=scene_name', // 傳遞參數
  onready: (krpano) => {
    // krpano 實例載入完成，可進行操作
    console.log('Krpano Ready:', krpano);
  }
});
```

---

## 2. React 組件使用 (`Krpano.tsx`)

為了簡化在 Next.js 中的使用，我們封裝了 `components/Krpano.tsx`。

### 特性
- **自動載入資源**：自動處理 `tour.js` 的載入與初始化。
- **響應式更新 (Reactivity)**：支援動態更新 Props (如 `hotspotA`, `hotspotB`, `enableToggle`)，組件會自動呼叫 Krpano API 更新畫面，無需重新重載。
- **TypeScript 支援**：提供完整的型別定義 (`KrpanoProps`, `KrpanoRef`)。

### Props 介面

```typescript
interface KrpanoProps {
  xml?: string;           // XML 路徑 (預設: /vtour/tour.xml)
  startScene?: string;    // 初始場景名稱
  hotspotA?: HotspotConfig; // 熱點 A 配置
  hotspotB?: HotspotConfig; // 熱點 B 配置
  enableToggle?: boolean; // 是否啟用切換功能
  bgcolor?: string;       // 背景色
  className?: string;     // 自訂 CSS Class
  onReady?: (krpano: KrpanoInstance) => void;
}
```

### Methods (`ref`)

透過 `useRef` 可以取得以下方法：

- `toggleHotspotA()`: 切換熱點 A 的顯示狀態。
- `toggleHotspotB()`: 觸發熱點 B 的切換動作。
- `loadScene(sceneName)`: 載入指定場景。
- `setHotspotVisible(name, visible)`: 設定特定熱點可見性。
- `getInstance()`: 取得原始 Krpano 實例。

### 使用範例

```tsx
import Krpano, { KrpanoRef } from '@/components/Krpano';
import { useRef } from 'react';

export default function MyPage() {
  const krpanoRef = useRef<KrpanoRef>(null);

  const handleToggle = () => {
    krpanoRef.current?.toggleHotspotA();
  };

  return (
    <Krpano 
      ref={krpanoRef}
      xml="/vtour/tour.xml"
      startScene="scene_01"
      hotspotA={{ 
        name: 'my_spot', 
        url: '/path/to/icon.png',
        onclick: 'toggle_visibility(other_spot);' // 呼叫 XML Action
      }}
    />
  );
}
```

---

## 3. XML 配置與自訂 Action

Krpano 的邏輯與場景定義主要在 XML 檔案中。

### 檔案結構
- `/public/vtour/tour.xml`: 主設定檔，定義場景 (Scenes) 與引入其他資源。
- `/public/vtour/custom_actions.xml`: **自訂邏輯**放置處。

### 自訂 Action 範例
為了實現「點擊 A 切換 B 顯示」的功能，我們在 `custom_actions.xml` 中定義了 `toggle_visibility`：

```xml
<krpano>
  <action name="toggle_visibility">
    if(hotspot[%1].visible,
      set(hotspot[%1].visible, false);
    ,
      set(hotspot[%1].visible, true);
    );
  </action>
</krpano>
```

並在 `tour.xml` 中引入：

```xml
<include url="custom_actions.xml" />
```


這樣 React 組件就可以透過 JS 呼叫此 Action：
`krpano.call('toggle_visibility(hotspot_B)');`

### 動態注入 Action (JS Injection)

除了在 XML 中定義，您也可以透過 JavaScript 動態注入 Action。這在需要根據 JS 變數產生邏輯時非常有用。

使用 `krpano.call('addaction(name, code)')` 即可：

```typescript
// 定義一個名為 'my_dynamic_action' 的 action
krpano.call(`
  addaction(my_dynamic_action,
    trace('Hello from JS injected action!');
    set(hotspot[hotspot_A].scale, 1.2);
  );
`);

// 呼叫它
krpano.call('my_dynamic_action()');
```

> **注意**：雖然 JS 注入很靈活，但將複雜邏輯保留在 `custom_actions.xml` 中通常較易於維護與除錯。

## 參考資源
- [Krpano Action Scripting 指南](./krpano-actions.md) (本專案詳細 Action 語法說明)
- [Krpano 功能特性指南](./krpano-features.md) (場景、熱點、事件等功能介紹)
- [Krpano XML Reference](https://krpano.com/docu/xml/)
- [Krpano Actions / Scripting](https://krpano.com/docu/actions/)
