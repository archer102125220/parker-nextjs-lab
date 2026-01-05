# 1. 整合與初始化

本文說明如何在 Next.js (React) 環境中正確引入並初始化 Krpano，以及如何封裝一個支援動態更新的 React 組件。

## 核心概念

Krpano 是一個基於瀏覽器的全景查看器，核心檔案為 `tour.js`。初始化過程主要依賴全域函式 `embedpano()`。

### 資源結構
通常將 Krpano 的輸出的資源放置在 `public/` 目錄下：
```
public/
  └── vtour/
      ├── tour.js       # 核心引擎 (必須)
      ├── tour.xml      # 主設定檔 (必須)
      ├── skin/         # 皮膚資源
      └── panos/        # 全景圖磚
```

---

## React 組件封裝實戰

為了符合 React 的生命週期，我們需要一個 Wrapper 組件來處理腳本載入與實例銷毀。

### 1. 定義型別
首先定義 Props 與 Ref 接口，確保 TypeScript 支援。

```typescript
// components/Krpano.tsx

export interface KrpanoProps {
  xml?: string;           // XML 路徑
  targetId?: string;      // 指定容器 ID
  onReady?: (krpano: any) => void; 
  // ...其他自訂參數
}

export interface KrpanoRef {
  callAction: (action: string) => void;
  // ...暴露給父層的方法
}
```

### 2. 載入與初始化
使用 `useEffect` 確保只在 Client 端執行，並避免重複載入。

```tsx
import { useEffect, useRef } from 'react';

const Krpano = ({ xml = '/vtour/tour.xml' }: KrpanoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false); // 防止 React 18 Strict Mode 重複執行

  useEffect(() => {
    if (initialized.current) return;
    
    // 1. 動態載入 Script
    const loadScript = async () => {
      if (window.embedpano) return;
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = '/vtour/tour.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const init = async () => {
      await loadScript();
      
      // 2. 初始化 Krpano
      window.embedpano({
        xml: xml,
        target: containerRef.current.id,
        html5: 'only',
        mobilescale: 1.0,
        onready: (krpanoInterface) => {
          // 初始化成功，保存實例
          initialized.current = true;
          console.log('Krpano Ready');
        }
      });
    };

    init();
    
    // 3. 清理函數
    return () => {
      window.removepano?.(containerRef.current.id);
    };
  }, [xml]);

  return <div id="krpano_root" ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
```

---

## 實現響應式 (Reactivity) 

Krpano 實例建立後，React 的 State/Props 改變**不會**自動影響 Krpano 內部狀態。我們需要透過 `useEffect` 監聽 Props 變化，並手動呼叫 Krpano API 更新。

### 範例：動態切換熱點顯示

假設我們有一個 `enableHotspot` prop：

```tsx
// 在組件內
useEffect(() => {
  const krpano = krpanoInstance.current; // 假設你有存 ref
  if (!krpano) return;

  if (enableHotspot) {
    // 使用 call 執行 Action
    krpano.call("set(hotspot[spot1].visible, true);");
  } else {
    krpano.call("set(hotspot[spot1].visible, false);");
  }
}, [enableHotspot]); // 依賴項改變時執行
```

**最佳實踐**：
不要重新執行 `embedpano`！這非常耗效能。應該始終使用 `krpano.set()` 或 `krpano.call()` 來更新現有實例的狀態。

---

## 常見問題 (FAQ)

### Q: 為什麼 React 重新渲染時 Krpano 會閃爍？
**A:** 這是因為沒有正確處理 `useEffect` 的依賴與清理。確保 `embedpano` 只執行一次。如果你的組件頻繁卸載再掛載，閃爍是正常的（因為 Canvas 重繪），建議使用 `React.memo` 或將 Krpano 提升到更上層的容器，或透過樣式隱藏/顯示而非銷毀。

### Q: 如何從外部 JS 呼叫內部 Action？
**A:** `onready` 回調函式會回傳 Krpano 的 Interface 物件 (通常命名為 `krpano` 或 `krpanoJS`)。
- `krpano.call("action_name();")`: 執行 XML 定義的動作。
- `krpano.set("variable", value)`: 設定變數。
- `krpano.get("variable")`: 取得變數值。
