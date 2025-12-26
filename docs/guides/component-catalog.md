# Component Catalog

This document provides complete documentation and usage examples for all reusable components in the project.

---

## 📋 Table of Contents

- [Form Components](#form-components)
- [UI Components](#ui-components)
- [Layout Components](#layout-components)
- [Animation Components](#animation-components)
- [Utility Components](#utility-components)

---

## Form Components

### DatePicker

Date picker component with multi-language and custom format support.

```tsx
import DatePicker from '@/components/DatePicker';

<DatePicker
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  locale="en"
  label="Select Date"
  disabled={false}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | `null` | Selected date |
| `onChange` | `(date: Date) => void` | - | Date change callback |
| `locale` | `'en' \| 'zh-tw' \| 'zh-cn'` | `'en'` | Locale setting |
| `label` | `string` | - | Label text |
| `disabled` | `boolean` | `false` | Disabled state |

---

### PhoneInput

Phone number input with country code selection and validation.

```tsx
import PhoneInput from '@/components/PhoneInput';

<PhoneInput
  value={phone}
  onChange={(value) => setPhone(value)}
  defaultCountryCode="US"
  placeholder="Enter phone number"
  validate={true}
  onValidate={({ isValid, error }) => {
    console.log('Validation result:', isValid, error);
  }}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| PhoneInputValue` | - | Phone number value |
| `onChange` | `(value) => void` | - | Change callback |
| `defaultCountryCode` | `string` | `'TW'` | Default country code |
| `validate` | `boolean` | `true` | Enable validation |
| `returnObject` | `boolean` | `false` | Return object format |

---

### ImageUpload

Image upload component with drag-and-drop and preview support.

```tsx
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  onChange={(file) => handleUpload(file)}
  onError={(error) => showError(error)}
  maxSize={5 * 1024 * 1024} // 5MB
  btnLabel="Upload Image"
  accept="image/*"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(file: File) => void` | - | File selection callback |
| `onError` | `(error: string) => void` | - | Error callback |
| `maxSize` | `number` | - | Max file size (bytes) |
| `btnLabel` | `string` | `'Upload Image'` | Button text |
| `accept` | `string` | `'image/*'` | Accepted file types |

---

### Selector

Custom dropdown select component.

```tsx
import Selector from '@/components/Selector';

<Selector
  value={selected}
  onChange={(value) => setSelected(value)}
  placeholder="Please select"
>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Selector>
```

---

### SwitchButton

Toggle switch button component.

```tsx
import SwitchButton from '@/components/SwitchButton';

<SwitchButton
  value={isOn}
  onChange={(value) => setIsOn(value)}
  onLabel="On"
  offLabel="Off"
/>
```

---

## UI Components

### Banner

Carousel banner component with autoplay and 3D effects.

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
| `banners` | `BannerItem[]` | `[]` | Banner data array |
| `autoplay` | `boolean` | `true` | Enable autoplay |
| `interval` | `number` | `3000` | Autoplay interval (ms) |
| `showIndicators` | `boolean` | `true` | Show indicators |
| `showNavigation` | `boolean` | `true` | Show navigation buttons |
| `height` | `string \| number` | `'300px'` | Banner height |

---

### Countdown

Countdown timer component.

```tsx
import Countdown from '@/components/Countdown';

<Countdown
  initialSeconds={60}
  onCountdownEnd={() => console.log('Time up!')}
  onCountdownStep={(seconds) => console.log('Remaining:', seconds)}
  width={100}
  height={100}
  bgColor="#1976d2"
  color="#fff"
/>
```

---

### DialogModal

Modal dialog component.

```tsx
import DialogModal from '@/components/DialogModal';

<DialogModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Dialog Title"
  maxWidth="md"
  fullWidth
>
  <p>Dialog content</p>
  <button onClick={() => setIsOpen(false)}>Close</button>
</DialogModal>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Open state |
| `onClose` | `() => void` | - | Close callback |
| `title` | `string` | - | Dialog title |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Maximum width |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |

---

### SlideInPanel

Sliding panel component, ideal for notifications.

```tsx
import SlideInPanel from '@/components/SlideInPanel';

<SlideInPanel
  value={message}
  timeout={3000}
  maxRow={5}
  leftEnter={false}
  userRemoveType="click"
  onRemove={(msg) => console.log('Removed:', msg)}
>
  {(message) => <div className="custom-message">{message.content}</div>}
</SlideInPanel>
```

---

### Tabs

Tab navigation component.

```tsx
import { Tabs, TabsContent } from '@/components/Tabs';

const tabs = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' },
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
    <div>{isActive ? `${tab.label} Content` : null}</div>
  )}
</TabsContent>
```

---

### LoadingBar

Loading progress bar component.

```tsx
import LoadingBar from '@/components/LoadingBar';

<LoadingBar
  loading={isLoading}
  color="#1976d2"
  height={4}
/>
```

---

## Layout Components

### ScrollFetch

Infinite scroll component with pull-to-refresh and load more support.

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

Virtual scrolling component for large data lists.

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

## Animation Components

### Ripple

Material Design ripple effect.

```tsx
import Ripple from '@/components/Ripple';

<button className="my-button">
  Click me
  <Ripple color="rgba(255,255,255,0.3)" duration={600} />
</button>
```

---

### GoTop

Back to top button.

```tsx
import GoTop from '@/components/GoTop';

<GoTop
  threshold={300}
  smooth={true}
/>
```

---

## Utility Components

### QRCode

QR Code generator.

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

PWA loading animation.

```tsx
import PWALoading from '@/components/PWALoading';

<PWALoading
  show={isLoading}
  text="Loading..."
/>
```

---

## Test Coverage

All listed components have comprehensive unit test coverage:

| Component | Test Count | Coverage |
|-----------|------------|----------|
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

**Total**: 189 tests across 18 files

---

## Related Documentation

- [API Documentation](./api-documentation.md)
- [Hooks Documentation](../README.md#-custom-hooks-28)
- [CSS Development Standards](./coding-standards.md)
