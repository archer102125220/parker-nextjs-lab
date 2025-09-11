# Drawer 組件

這是一個從 Vue 3 轉換為 React TSX 的抽屜組件，支持從四個方向滑出，具有拖拽關閉功能。

## 功能特性

- ✅ 支持四個方向滑出（top, bottom, left, right）
- ✅ 拖拽關閉功能
- ✅ 動畫效果
- ✅ 遮罩層
- ✅ 自定義內容
- ✅ 響應式設計
- ✅ TypeScript 支持

## 使用方法

### 基本用法

```tsx
import React, { useState } from 'react';
import Drawer from './components/Drawer';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        打開抽屜
      </button>
      
      <Drawer
        open={isOpen}
        anchor="left"
        onChange={(value) => setIsOpen(value)}
      >
        <div style={{ padding: '20px' }}>
          <h3>抽屜內容</h3>
          <p>這裡是抽屜的內容</p>
        </div>
      </Drawer>
    </div>
  );
};
```

### 高級用法

```tsx
<Drawer
  open={isOpen}
  anchor="right"
  hasAnimation={true}
  hasMask={true}
  dragCloseDisabled={false}
  width={400}
  height={300}
  triggerPercentage={0.25}
  onChange={handleChange}
  onOpen={handleOpen}
  onClose={handleClose}
  OpenBtn={({ open, anchor }) => (
    <button onClick={open}>自定義打開按鈕</button>
  )}
  CloseBtn={({ close, anchor }) => (
    <button onClick={close}>自定義關閉按鈕</button>
  )}
  Drag={({ anchor, isVertical, isHorizontal, onClick, onDragStart, onDraging, onDragEnd }) => (
    <div
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      onMouseMove={onDraging}
      onTouchMove={onDraging}
      onMouseUp={onDragEnd}
      onTouchEnd={onDragEnd}
      onClick={onClick}
    >
      自定義拖拽條
    </div>
  )}
  Container={({ onClose, isDraging }) => (
    <div>
      <button onClick={onClose}>關閉</button>
      <div>自定義容器內容</div>
    </div>
  )}
>
  <div>抽屜內容</div>
</Drawer>
```

## Props

| 屬性 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| open | boolean | false | 控制抽屜的開關狀態 |
| hasAnimation | boolean | true | 是否啟用動畫效果 |
| dragCloseDisabled | boolean | false | 是否禁用拖拽關閉 |
| anchor | 'top' \| 'bottom' \| 'left' \| 'right' | 'left' | 抽屜滑出的方向 |
| rootPosition | string | undefined | 根元素定位方式 |
| wrappingPosition | string | 'fixed' | 包裝元素定位方式 |
| hasMask | boolean | true | 是否顯示遮罩層 |
| maskPosition | string | 'absolute' | 遮罩層定位方式 |
| position | string | 'absolute' | 抽屜定位方式 |
| width | number \| string | undefined | 抽屜寬度 |
| minWidth | number \| string | undefined | 抽屜最小寬度 |
| maxWidth | number \| string | undefined | 抽屜最大寬度 |
| height | number \| string | undefined | 抽屜高度 |
| minHeight | number \| string | undefined | 抽屜最小高度 |
| maxHeight | number \| string | undefined | 抽屜最大高度 |
| top | number \| string | '0px' | 頂部位置 |
| right | number \| string | '0px' | 右側位置 |
| bottom | number \| string | '0px' | 底部位置 |
| left | number \| string | '0px' | 左側位置 |
| zIndex | number \| string | '1' | 層級 |
| triggerPercentage | number \| string | 0.25 | 拖拽觸發關閉的百分比 |
| children | ReactNode | undefined | 抽屜內容 |
| OpenBtn | ElementType | undefined | 自定義打開按鈕組件 |
| CloseBtn | ElementType | undefined | 自定義關閉按鈕組件 |
| Drag | ElementType | undefined | 自定義拖拽條組件 |
| Container | ElementType | undefined | 自定義容器組件 |

## 事件回調

| 事件 | 類型 | 說明 |
|------|------|------|
| onChange | (value: boolean) => void | 狀態改變時觸發 |
| onClose | () => void | 關閉時觸發 |
| onOpen | () => void | 打開時觸發 |

## 自定義組件 (Custom Components)

| 組件 | 類型 | 說明 |
|------|------|------|
| OpenBtn | ElementType | 自定義打開按鈕組件，接收 props: { open: () => void; anchor: anchorType } |
| CloseBtn | ElementType | 自定義關閉按鈕組件，接收 props: { close: () => void; anchor: anchorType } |
| Drag | ElementType | 自定義拖拽條組件，接收 props: { anchor: anchorType; isVertical: boolean; isHorizontal: boolean; isDraging: boolean; onClick: () => void; onDragStart: (e: DragEvent) => void; onDraging: (e: DragEvent) => void; onDragEnd: () => void } |
| Container | ElementType | 自定義容器組件，接收 props: { onClose: () => void; isDraging: boolean } |
| children | ReactNode | 抽屜內容 |

## 樣式文件

- `drawer.scss` - 全局樣式
- `drawer.module.scss` - 組件樣式模組

## 從 Vue 3 轉換的主要變化

1. **模板語法**: Vue template 轉換為 React JSX
2. **響應式數據**: Vue 的 `ref` 和 `reactive` 轉換為 React 的 `useState`
3. **計算屬性**: Vue 的 `computed` 轉換為 React 的 `useMemo`
4. **生命週期**: Vue 的生命週期鉤子轉換為 React 的 `useEffect`
5. **事件處理**: Vue 的事件處理轉換為 React 的事件處理
6. **插槽**: Vue 的插槽轉換為 React 的 ElementType 組件
7. **CSS 模組**: 將嵌套的 SCSS 語法展開為平鋪的類名
8. **Props 命名**: `modelValue` 改為 `open`，更符合 React 慣例
9. **組件命名**: 插槽名稱改為 PascalCase（`OpenBtn`、`CloseBtn`、`Drag`、`Container`）

## 注意事項

1. 組件使用 CSS 變量來動態控制樣式，這會產生內聯樣式的 linter 警告，但這是必要的
2. 拖拽功能支持鼠標和觸摸事件
3. 組件會自動管理 HTML 元素的 `drawer_open` 類別
4. 支持 ESC 鍵關閉抽屜
5. 自定義組件需要接收指定的 props 才能正常工作
6. 拖拽條預設會顯示，可以通過自定義 `Drag` 組件來隱藏或自定義樣式
