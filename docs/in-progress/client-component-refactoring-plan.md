# Client Component Refactoring Plan (Refined)

## 原則

遵守 Next.js 最佳實踐：
1. **優先使用 Server Components** - 頁面預設為 Server Component
2. **最小化 Client Components** - 只有需要互動的部分才標記為 'use client'
3. **組件內聯** - 如果只有少量狀態，直接在頁面內創建 Client Component
4. **Demo Component 模式** - 只有當整個頁面都需要互動時，才效仿 scroll-fetch 模式

---

## 頁面分類分析

### 📊 分類標準

| 類型 | 特徵 | 重構策略 |
|------|------|---------|
| **Type A: 內聯 Client Component** | 只有少量狀態（1-3 個 useState），主要是靜態內容 | 將互動部分提取為內聯 Client Component |
| **Type B: 提取 Client Component** | 中等複雜度，部分互動邏輯 | 提取為獨立的 Client Component 文件 |
| **Type C: Demo Component 模式** | 整頁都是互動邏輯，大量狀態管理 | 效仿 scroll-fetch，創建 Demo Component |

---

## 分類結果

### Type A: 內聯 Client Component (15 個) ⭐⭐⭐⭐⭐

**特徵**: 簡單狀態，大部分是靜態內容

| 頁面 | 狀態數量 | 重構策略 |
|------|---------|---------|
| `components/banner-demo` | 1 useState | 提取 BannerDemo 為內聯 Client Component |
| `components/countdown-test` | 0-1 useState | 提取 CountdownDemo 為內聯 Client Component |
| `components/enter-label` | 1-2 useState | 提取 EnterLabelDemo 為內聯 Client Component |
| `components/go-top` | 0 useState | 提取 GoTopDemo 為內聯 Client Component |
| `components/qr-code-test` | 1-2 useState | 提取 QRCodeDemo 為內聯 Client Component |
| `components/selector` | 1-2 useState | 提取 SelectorDemo 為內聯 Client Component |
| `components/switch-button` | 1 useState | 提取 SwitchButtonDemo 為內聯 Client Component |
| `components/youtube-test` | 2-3 useState | 提取 YoutubeDemo 為內聯 Client Component |
| `directive-effects/page` | 0 useState | 靜態內容，移除 'use client' |
| `directive-effects/lazyload-test` | 0 useState | 靜態內容，移除 'use client' |
| `directive-effects/ripple-test` | 0 useState | 靜態內容，移除 'use client' |
| `route/page` | 0 useState | 靜態內容，移除 'use client' |
| `route/params-back-test/[testData]` | 0 useState | 使用 useParams hook，提取為內聯 Client Component |
| `route/query-back-test` | 0 useState | 使用 useSearchParams hook，提取為內聯 Client Component |
| `offline` | 1 useState | 提取 OfflineDetector 為內聯 Client Component |

**預估時間**: 3-4 小時

---

### Type B: 提取 Client Component (12 個) ⭐⭐⭐⭐

**特徵**: 中等複雜度，需要獨立文件但不需要 Demo 模式

| 頁面 | 複雜度 | 重構策略 |
|------|--------|---------|
| `components/image-upload-test` | 中 | 提取為 `components/Demo/ImageUploadTest.tsx` |
| `components/phone-input` | 中 | 提取為 `components/Demo/PhoneInputTest.tsx` |
| `components/slide-in-panel` | 中 | 提取為 `components/Demo/SlideInPanelTest.tsx` |
| `components/swiper-test` | 中 | 提取為 `components/Demo/SwiperTest.tsx` |
| `components/tab-test` | 中 | 提取為 `components/Demo/TabTest.tsx` |
| `components/wang-editor-test` | 中 | 提取為 `components/Demo/WangEditorTest.tsx` |
| `components/virtual-scroller` | 中 | 提取為 `components/Demo/VirtualScrollerTest.tsx` |
| `web-cam` | 中 | 提取為 `components/Demo/WebCamTest.tsx` |
| `frontend-api-cache-test` | 中 | 提取為 `components/Demo/FrontendApiCacheTest.tsx` |
| `face-swap/page` | 中 | 提取為 `components/Demo/FaceSwapIndex.tsx` |
| `socket-test/page` | 中 | 提取為 `components/Demo/SocketTestIndex.tsx` |
| `socket-test/socket-io` | 中 | 提取為 `components/Demo/SocketIoTest.tsx` |

**預估時間**: 4-5 小時

---

### Type C: Demo Component 模式 (15 個) ⭐⭐⭐

**特徵**: 整頁都是互動邏輯，大量狀態管理，效仿 scroll-fetch

| 頁面 | 原因 | Demo Component |
|------|------|---------------|
| `hooks-test` | 10+ hooks，整頁互動 | `components/Demo/Hooks.tsx` |
| `web-authn` | 複雜表單，多步驟流程 | `components/Demo/WebAuthn.tsx` |
| `face-swap/frontend` | 複雜 canvas 操作 | `components/Demo/FaceSwapFrontend.tsx` |
| `face-swap/backend` | 複雜 API 互動 | `components/Demo/FaceSwapBackend.tsx` |
| `web-rtc/page` | 複雜媒體控制 | `components/Demo/WebRTC.tsx` |
| `web-rtc/socket-io/page` | 複雜即時通訊 | `components/Demo/WebRTCSocketIO.tsx` |
| `web-rtc/socket-io/room/[roomId]` | 複雜房間邏輯 | `components/Demo/WebRTCSocketIORoom.tsx` |
| `web-rtc/server-sent-event/page` | 複雜 SSE 邏輯 | `components/Demo/WebRTCSSE.tsx` |
| `web-rtc/server-sent-event/room/[roomId]` | 複雜房間邏輯 | `components/Demo/WebRTCSSERoom.tsx` |
| `server-sent-event-test/page` | 複雜 SSE 邏輯 | `components/Demo/SSE.tsx` |
| `server-sent-event-test/global-get` | 複雜 SSE 邏輯 | `components/Demo/SSEGlobalGet.tsx` |
| `server-sent-event-test/global-post` | 複雜 SSE 邏輯 | `components/Demo/SSEGlobalPost.tsx` |
| `server-sent-event-test/room-get/[[...uuId]]` | 複雜房間邏輯 | `components/Demo/SSERoomGet.tsx` |
| `server-sent-event-test/room-post/[[...uuId]]` | 複雜房間邏輯 | `components/Demo/SSERoomPost.tsx` |
| `socket-test/websocket` | 複雜 WebSocket 邏輯 | `components/Demo/WebSocketDemo.tsx` |

**預估時間**: 5-6 小時

---

## 重構模式範例

### Pattern A: 內聯 Client Component

```tsx
// app/[locale]/components/banner-demo/page.tsx
import type { Metadata } from 'next';
import BannerDemoClient from './BannerDemoClient';
import style from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Banner 輪播組件測試',
    description: '展示 3D 輪播效果、拖曳支援、鍵盤導航和自動播放功能'
  };
}

export default function BannerDemoPage() {
  return (
    <div className={style.banner_demo_page}>
      <h1>Banner 輪播組件測試</h1>
      <p className={style['banner_demo_page-description']}>
        展示 3D 輪播效果、拖曳支援、鍵盤導航和自動播放功能
      </p>
      <BannerDemoClient />
    </div>
  );
}
```

```tsx
// app/[locale]/components/banner-demo/BannerDemoClient.tsx
'use client';
import { useState } from 'react';
import Banner from '@/components/Banner';
import type { BannerItem } from '@/components/Banner';
import style from './page.module.scss';

export default function BannerDemoClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const banners: BannerItem[] = [
    // ... banner data
  ];

  return (
    <>
      <div className={style['banner_demo_page-section']}>
        <h2>基本用法</h2>
        <Banner
          banners={banners}
          value={currentIndex}
          onChange={setCurrentIndex}
          autoplay={true}
          interval={3000}
          height={400}
        />
        <p>當前索引: {currentIndex}</p>
      </div>
      {/* ... more sections */}
    </>
  );
}
```

---

### Pattern B: 提取 Client Component

```tsx
// app/[locale]/components/image-upload-test/page.tsx
import type { Metadata } from 'next';
import ImageUploadDemo from '@/components/ClientDemo/ImageUploadDemo';
import style from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Image Upload 組件測試',
    description: 'Image Upload 組件演示頁面'
  };
}

export default function ImageUploadTestPage() {
  return (
    <section className={style.image_upload_test_page}>
      <h1>Image Upload 組件測試</h1>
      <ImageUploadDemo />
    </section>
  );
}
```

```tsx
// components/ClientDemo/ImageUploadDemo.tsx
'use client';
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import style from '@/app/[locale]/components/image-upload-test/page.module.scss';

export default function ImageUploadDemo() {
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // ... demo logic
  
  return (
    <div className={style['image_upload_test_page-demo']}>
      {/* ... demo content */}
    </div>
  );
}
```

---

### Pattern C: Demo Component 模式 (效仿 scroll-fetch)

```tsx
// app/[locale]/hooks-test/page.tsx
import type { Metadata } from 'next';
import DemoHooks from '@/components/Demo/Hooks';
import style from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hooks 測試頁面',
    description: '展示各種自訂 Hooks 的功能'
  };
}

export default function HooksTestPage() {
  return (
    <section className={style.hooks_test_page}>
      <h1>Hooks 測試頁面</h1>
      <p className={style['hooks_test_page-description']}>
        展示各種自訂 Hooks 的功能
      </p>
      <DemoHooks />
    </section>
  );
}
```

```tsx
// components/Demo/Hooks.tsx
'use client';
import { useState } from 'react';
import useThrottle from '@/hooks/useThrottle';
// ... other hooks
import style from '@/app/[locale]/hooks-test/page.module.scss';

export function DemoHooks() {
  // ... all the interactive logic
  
  return (
    <div className={style['hooks_test_page-grid']}>
      {/* ... all the interactive content */}
    </div>
  );
}

export default DemoHooks;
```

---

## 執行順序

### 階段 1: Type A - 內聯 Client Component (15 個)
**優先級**: ⭐⭐⭐⭐⭐  
**預估時間**: 3-4 小時  
**原因**: 最簡單，風險最低，快速見效

### 階段 2: Type B - 提取 Client Component (12 個)
**優先級**: ⭐⭐⭐⭐  
**預估時間**: 4-5 小時  
**原因**: 中等複雜度，需要創建新文件但模式清晰

### 階段 3: Type C - Demo Component 模式 (15 個)
**優先級**: ⭐⭐⭐  
**預估時間**: 5-6 小時  
**原因**: 最複雜，需要仔細處理狀態和邏輯

---

## Verification Plan

每個階段完成後檢查：
- [ ] `generateMetadata` 正常運作
- [ ] SEO meta tags 正確
- [ ] 無 hydration errors
- [ ] 互動功能正常
- [ ] 無 console errors

```bash
# 測試 build
yarn build

# 檢查是否有錯誤
yarn lint
```

---

## 總預估時間

| 階段 | 頁面數 | 預估時間 |
|------|--------|---------|
| Type A: 內聯 Client Component | 15 | 3-4 小時 |
| Type B: 提取 Client Component | 12 | 4-5 小時 |
| Type C: Demo Component 模式 | 15 | 5-6 小時 |
| **總計** | **42** | **12-15 小時** |

---

## 備註

- **error.tsx** 必須保持 'use client'（Next.js 要求）
- 每完成一個類型就測試一次
- 保持 Git commits 清晰
- 優先處理 Type A，快速見效
