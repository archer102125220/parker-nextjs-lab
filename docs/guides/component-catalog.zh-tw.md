# 組件目錄 (Component Catalog)

本文件提供專案中所有可重用組件的完整說明與使用範例。

---

## 📋 目錄

- [表單組件 (Form Components)](#表單組件-form-components)
- [UI 組件 (UI Components)](#ui-組件-ui-components)
- [佈局組件 (Layout Components)](#佈局組件-layout-components)
- [動畫組件 (Animation Components)](#動畫組件-animation-components)
- [工具組件 (Utility Components)](#工具組件-utility-components)

---

## 表單組件 (Form Components)

### DatePicker

日期選擇器，支援多語系和自訂格式。

```tsx
import DatePicker from '@/components/DatePicker';

<DatePicker
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  locale="zh-tw"
  label="選擇日期"
  disabled={false}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | `null` | 選定的日期 |
| `onChange` | `(date: Date) => void` | - | 日期變更回調 |
| `locale` | `'en' \| 'zh-tw' \| 'zh-cn'` | `'en'` | 語系設定 |
| `label` | `string` | - | 標籤文字 |
| `disabled` | `boolean` | `false` | 是否禁用 |

---

### PhoneInput

電話號碼輸入框，支援國碼選擇與驗證。

```tsx
import PhoneInput from '@/components/PhoneInput';

<PhoneInput
  value={phone}
  onChange={(value) => setPhone(value)}
  defaultCountryCode="TW"
  placeholder="請輸入電話號碼"
  validate={true}
  onValidate={({ isValid, error }) => {
    console.log('驗證結果:', isValid, error);
  }}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| PhoneInputValue` | - | 電話號碼值 |
| `onChange` | `(value) => void` | - | 變更回調 |
| `defaultCountryCode` | `string` | `'TW'` | 預設國碼 |
| `validate` | `boolean` | `true` | 是否驗證 |
| `returnObject` | `boolean` | `false` | 是否回傳物件格式 |

---

### ImageUpload

圖片上傳組件，支援拖曳上傳和預覽。

```tsx
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  onChange={(file) => handleUpload(file)}
  onError={(error) => showError(error)}
  maxSize={5 * 1024 * 1024} // 5MB
  btnLabel="上傳圖片"
  accept="image/*"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(file: File) => void` | - | 檔案選擇回調 |
| `onError` | `(error: string) => void` | - | 錯誤回調 |
| `maxSize` | `number` | - | 最大檔案大小 (bytes) |
| `btnLabel` | `string` | `'上傳圖片'` | 按鈕文字 |
| `accept` | `string` | `'image/*'` | 接受的檔案類型 |

---

### Selector

自訂下拉選單組件。

```tsx
import Selector from '@/components/Selector';

<Selector
  value={selected}
  onChange={(value) => setSelected(value)}
  placeholder="請選擇"
>
  <option value="1">選項一</option>
  <option value="2">選項二</option>
</Selector>
```

---

### SwitchButton

開關切換按鈕。

```tsx
import SwitchButton from '@/components/SwitchButton';

<SwitchButton
  value={isOn}
  onChange={(value) => setIsOn(value)}
  onLabel="開"
  offLabel="關"
/>
```

---

## UI 組件 (UI Components)

### Banner

輪播橫幅組件，支援自動播放和 3D 效果。

```tsx
import Banner from '@/components/Banner';

const banners = [
  { id: 1, image: '/banner1.jpg', title: 'Banner 1' },
  { id: 2, image: '/banner2.jpg', title: 'Banner 2' },
  { id: 3, image: '/banner3.jpg', title: 'Banner 3' },
];

<Banner
  banners={banners}
  autoplay={true}
  interval={3000}
  showIndicators={true}
  showNavigation={true}
  height={300}
  onChange={(index) => console.log('Current:', index)}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `banners` | `BannerItem[]` | `[]` | 橫幅資料陣列 |
| `autoplay` | `boolean` | `true` | 自動播放 |
| `interval` | `number` | `3000` | 播放間隔 (ms) |
| `showIndicators` | `boolean` | `true` | 顯示指示器 |
| `showNavigation` | `boolean` | `true` | 顯示導航按鈕 |
| `height` | `string \| number` | `'300px'` | 高度 |

---

### Countdown

倒數計時器組件。

```tsx
import Countdown from '@/components/Countdown';

<Countdown
  initialSeconds={60}
  onCountdownEnd={() => console.log('時間到！')}
  onCountdownStep={(seconds) => console.log('剩餘:', seconds)}
  width={100}
  height={100}
  bgColor="#1976d2"
  color="#fff"
/>
```

---

### DialogModal

模態對話框組件。

```tsx
import DialogModal from '@/components/DialogModal';

<DialogModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="對話框標題"
  maxWidth="md"
  fullWidth
>
  <p>對話框內容</p>
  <button onClick={() => setIsOpen(false)}>關閉</button>
</DialogModal>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | 是否開啟 |
| `onClose` | `() => void` | - | 關閉回調 |
| `title` | `string` | - | 標題 |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | 最大寬度 |
| `closeOnBackdrop` | `boolean` | `true` | 點擊背景關閉 |

---

### SlideInPanel

滑入面板組件，適合用於通知訊息。

```tsx
import SlideInPanel from '@/components/SlideInPanel';

<SlideInPanel
  value={message}
  timeout={3000}
  maxRow={5}
  leftEnter={false}
  userRemoveType="click"
  onRemove={(msg) => console.log('移除:', msg)}
>
  {(message) => <div className="custom-message">{message.content}</div>}
</SlideInPanel>
```

---

### Tabs

分頁標籤組件。

```tsx
import { Tabs, TabsContent } from '@/components/Tabs';

const tabs = [
  { value: 'tab1', label: '標籤一' },
  { value: 'tab2', label: '標籤二' },
  { value: 'tab3', label: '標籤三' },
];

<Tabs
  tabs={tabs}
  value={activeTab}
  onChange={(value, index) => setActiveTab(value)}
  variant="default"
/>

<TabsContent
  tabs={tabs}
  value={activeTab}
  onChange={(value) => setActiveTab(value)}
>
  {(tab, index, isActive) => (
    <div>{isActive ? `${tab.label} 內容` : null}</div>
  )}
</TabsContent>
```

---

### LoadingBar

載入進度條組件。

```tsx
import LoadingBar from '@/components/LoadingBar';

<LoadingBar
  loading={isLoading}
  color="#1976d2"
  height={4}
/>
```

---

## 佈局組件 (Layout Components)

### ScrollFetch

無限滾動組件，支援下拉刷新和觸底載入。

```tsx
import ScrollFetch from '@/components/ScrollFetch';

<ScrollFetch
  height="400px"
  onRefresh={handleRefresh}
  onInfinityFetch={loadMore}
  loading={isLoading}
  infinityEnd={hasNoMore}
>
  {items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</ScrollFetch>
```

---

### VirtualScroller

虛擬滾動組件，適合大量資料列表。

```tsx
import VirtualScroller from '@/components/VirtualScroller';

<VirtualScroller
  items={largeList}
  itemHeight={50}
  containerHeight={400}
  renderItem={(item, index) => (
    <div key={index} style={{ height: 50 }}>{item.name}</div>
  )}
/>
```

---

## 動畫組件 (Animation Components)

### Ripple

Material Design 漣漪效果。

```tsx
import Ripple from '@/components/Ripple';

<button className="my-button">
  點擊我
  <Ripple color="rgba(255,255,255,0.3)" duration={600} />
</button>
```

---

### GoTop

返回頂部按鈕。

```tsx
import GoTop from '@/components/GoTop';

<GoTop
  threshold={300}
  smooth={true}
/>
```

---

## 工具組件 (Utility Components)

### QRCode

QR Code 生成器。

```tsx
import QRCode from '@/components/QRCode';

<QRCode
  value="https://example.com"
  size={200}
  logo="/logo.png"
  logoSize={50}
/>
```

---

### PWALoading

PWA 載入動畫。

```tsx
import PWALoading from '@/components/PWALoading';

<PWALoading
  show={isLoading}
  text="載入中..."
/>
```

---

## 測試覆蓋率

所有列出的組件都有完整的單元測試覆蓋：

| 組件 | 測試數量 | 覆蓋率 |
|------|----------|--------|
| QRCode | 12 | 97.5% |
| SwitchButton | 12 | 96% |
| LoadingBar | 11 | 100% |
| Selector | 13 | 94% |
| PWALoading | 6 | 100% |
| DatePicker | 10 | - |
| Tabs | 11 | - |
| PhoneInput | 11 | - |
| ImageUpload | 13 | - |
| Banner | 14 | - |
| Countdown | 10 | - |
| DialogModal | 15 | - |
| SlideInPanel | 12 | - |

**總計**: 189 tests across 18 files

---

## 相關文件

- [API 文件](./api-documentation.md)
- [Hooks 文件](../README.md#-custom-hooks-28)
- [CSS 開發規範](./coding-standards.md)
