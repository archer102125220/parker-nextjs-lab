# Parker Next.js Lab - Coding Standards (Agent Rules)

> This file defines the coding standards that MUST be followed when working on this project.
> These rules are mandatory and should be enforced by AI agents and human developers alike.

---

## 0. AI Agent Rules & Configuration

This project provides dedicated rule configuration files for different AI assistant tools to ensure consistency in code style and standards.

| AI Model/Tool | Rule File Location | Description |
|---|---|---|
| **Antigravity (Agent)** | `.agent/rules/*.md` | Rules for automated Agent (Antigravity) |
| **Gemini Code Assist** | `GEMINI.md` | Context for IDE Extension (Gemini Code Assist) |
| **Claude** | `CLAUDE.md` | Project instructions for Claude |
| **Cursor AI** | `.cursor/rules/*.mdc` | Granular rule files for Cursor (using `.mdc` format) |
| **GitHub Copilot** | `.github/copilot-instructions.md`<br>`.github/instructions/*.instructions.md` | Repository-wide and file-specific instructions |

> **Developer Note**: When updating this document, you MUST synchronize updates to all the above rule files to ensure consistent AI behavior.

---

## 1. TypeScript Standards

### 1.1 Type Safety (MANDATORY)

- **NEVER use `any` type** - Use precise type definitions, generics, or `unknown` instead
- **Use `as unknown as TargetType`** for type assertions when necessary (double assertion)
- **NEVER use `as any`** - Always use `as unknown as TargetType` for safer assertions
- **Add explanatory comments** when using type assertions to explain why it's necessary
- **Use inline type imports** - `import { useState, type ReactNode } from 'react'`

```typescript
// ❌ FORBIDDEN
function processData(data: any) { }
const element = document.getElementById('id') as any;

// ✅ REQUIRED
function processData<T extends { value: unknown }>(data: T) { }
const element = document.getElementById('id') as unknown as CustomElement;
```

### 1.2 Runtime Data Validation (Strict)

To ensure robustness, always use strict type checks based on the variable's initialization state.

| Type | Do NOT Use | MUST Use |
|------|------------|----------|
| **String** | `if (str)` | `if (str !== '')` |
| **Number** | `if (num)` | `typeof num === 'number'`, `num !== 0`, `Number.isFinite(num)` |
| **Object** | `if (obj)` | `typeof obj === 'object' && obj !== null`<br>`if (obj instanceof MyClass)` |
| **Array** | `if (arr)` | `Array.isArray(arr) && arr.length > 0` |
| **Equality** | `==`, `!=` | `===`, `!==` |

---

## 2. CSS/SCSS Standards

### 2.1 CSS Property Order (MANDATORY)

Properties MUST be ordered in this sequence:
1. **Positioning** (position, top, left, z-index...)
2. **Display & Box Model** (display, flex, width, margin, padding, border...)
3. **Typography** (font, color, text-align...)
4. **Visual** (background, box-shadow, opacity...)
5. **Animation** (transition, animation...)
6. **Misc** (cursor, content...)

```scss
.example {
  /* Positioning */
  position: relative;
  top: 0;
  z-index: 10;

  /* Display & Box Model */
  display: flex;
  width: 100%;
  padding: 20px;

  /* Typography */
  font-size: 16px;
  color: #333;

  /* Visual */
  background-color: #fff;

  /* Animation */
  transition: all 0.3s;

  /* Misc */
  cursor: pointer;
}
```

### 2.2 BEM Naming Convention (MANDATORY)

The project uses a **Modified BEM** naming convention:

| Element Type | Format | Example |
|--------------|--------|---------|
| Block | single name | `.countdown` |
| Element | hyphen `-` | `.countdown-title` |
| Sub-Element | hyphen `-` | `.countdown-title-icon` |
| Multi-word names | underscore `_` | `.image_upload`, `.content_box` |
| State/Modifier | HTML attribute | `[css-is-active='true']` |

#### Key Rules:
- **Each element MUST have its own unique class** - Critical for two reasons:
  1. **CSS relies primarily on class names** for styling (not tag selectors)
  2. **Quick DOM debugging** - Instantly identify which element has issues in browser DevTools
  - ❌ Bad: `.footer-links a { ... }` (targeting tag)
  - ✅ Good: `.footer-link { ... }` (unique class)
  - ✅ Exception: Dynamic content areas (e.g., `.content p { ... }`)
  - ✅ Exception: Third-party content (e.g., `:global a { ... }` in WangEditor)
- **Use `-` (hyphen)** to connect Block and Element: `.block-element`
- **Use `_` (underscore)** for multi-word names within a single segment: `.image_upload`, `.content_box`
- **NEVER use `__` (double underscore) or `--` (double hyphen)** - use HTML attributes instead
- **HTML attributes for states MUST start with `css-`**: `css-is-active`, `css-is-dragging`
- **CSS variables MUST use `_` (underscore)**: `--editor_height`, `--offset_y`

#### HTML Attribute Usage Guidelines:

**When to use HTML attributes**:
1. **States**: `[css-is-active='true']`, `[css-is-disabled='true']`
2. **Color variants**: `[css-color='red']`, `[css-color='blue']`
3. **Size variants**: `[css-size='small']`, `[css-size='large']`

**When to use separate classes**:
When the class name itself has **clear semantic meaning** (not just describing appearance):
```scss
// ✅ Semantic class names
.alert {
  &-success { }  // Success message (semantic)
  &-error { }    // Error message (semantic)
}
```

```scss
// ✅ CORRECT: Using HTML attributes
.image_upload {
  &-preview {        // .image_upload-preview
    &-img { }        // .image_upload-preview-img
  }
  &[css-is-dragging='true'] { }
}

.demo_box {
  background: #f5f5f5;
  
  &[css-color='red'] {
    background: #ffcdd2;
  }
}
```

```tsx
// ✅ CORRECT: Single className + HTML attribute
<Box className={style.demo_box} css-color="red">
  Red demo
</Box>

// ❌ WRONG: Multiple classNames
<Box className={`${style.demo_box} ${style['demo_box--red']}`}>
```

```scss
// ❌ WRONG
.image__upload { }   // Don't use __
.image-upload__preview { }  // Don't use __
.button--red { }     // Don't use -- (use HTML attributes instead)
```

### 2.3 Page Root Class Naming (MANDATORY)

- **Page root elements MUST use**: `[page_name]_page` format
  - Examples: `.hooks_test_page`, `.socket_io_page`, `.web_rtc_page`
- **Component root elements MUST use**: `[component_name]` format
  - Examples: `.scroll_fetch`, `.image_upload`, `.countdown`
- **Each page MUST have a unique root class name** - No sharing between pages

```scss
// ✅ CORRECT - All elements nested under page root
.hooks_test_page {
  &-description { }    // .hooks_test_page-description
  &-grid { }           // .hooks_test_page-grid
  &-section {          // .hooks_test_page-section
    &-title { }        // .hooks_test_page-section-title
  }
}

// ❌ WRONG - Elements not nested
.hooks_test_page { }
.description { }    // Can't identify which page this belongs to
.grid { }
```

### 2.4 Style File Organization (MANDATORY)

| Style Type | Location | Format |
|------------|----------|--------|
| Global tools | `styles/` | `.scss` |
| Placeholders | `styles/placeholders/` | `_*.scss` |
| Component styles | Component directory | `.scss` or `.module.scss` |
| Page styles | `app/` directory | `.module.scss` |

#### Forbidden Practices:
- ❌ **NEVER create `_shared` SCSS directories within `app/`**
- ❌ **NEVER share CSS class names between pages**
- ❌ **NEVER share a single CSS file between multiple pages**

#### Required Practices:
- ✅ Cross-page shared styles MUST be defined in `styles/placeholders/`
- ✅ Import placeholders via `@use '@/styles/placeholders' as *;`
- ✅ If pages have similar DOM, create a **component** that accepts `pageClassName` prop

### 2.5 Component with Page Identification Pattern (MANDATORY)

When a component encapsulates entire page content:

```tsx
// components/MyCard/index.tsx
import './index.scss';  // Component's own styles

interface MyCardProps {
  title: string;
  pageClassName?: string;  // Only for page identification
}

export default function MyCard({ title, pageClassName }: MyCardProps) {
  const rootClassName = pageClassName 
    ? `${pageClassName} my_card` 
    : 'my_card';

  return (
    <div className={rootClassName}>
      <h2 className="my_card-title">{title}</h2>
    </div>
  );
}
```

```tsx
// app/[locale]/page-a/page.tsx
import MyCard from '@/components/MyCard';
import style from './page.module.scss';

export default function PageA() {
  return <MyCard title="Title" pageClassName={style.page_a} />;
}
```

### 2.6 Inline Styles (RESTRICTED)

#### Allowed Inline Styles:
- ✅ **MUI `sx` prop** - Official Material-UI styling method
- ✅ **CSS Variable passing** - `style={{ '--editor_height': '300px' }}`
- ✅ **Third-party library requirements** - e.g., GTM hidden containers

#### Forbidden Inline Styles:
- ❌ Static style values - Use CSS classes
- ❌ Dynamic calculated values - Use CSS variable passing
- ❌ Conditional styles - Use CSS attribute selectors
- ❌ Repeated patterns - Extract as placeholders

---

## 3. File Organization Standards

### 3.1 SCSS Import Order (RECOMMENDED)

```scss
// 1. Global tools
@use '@/styles/placeholders' as *;
@use '@/styles/mixin' as *;

// 2. Component styles
.my_component { }
```

### 3.2 Component Structure (RECOMMENDED)

```
components/
└── MyComponent/
    ├── index.tsx       # Component implementation
    ├── index.scss      # Component styles (if needed)
    └── types.ts        # Type definitions (if complex)
```

### 3.3 Demo Components Organization (`components/Demo/`) (MANDATORY)

Full-page Client Components for feature demonstrations, using PascalCase naming:

#### Naming Rules:
- **Full-page Client Component** → `components/Demo/[PageName].tsx`
  - Examples: `BannerDemo.tsx`, `LazyLoadTest.tsx`, `RippleTest.tsx`
- **Pages with multiple sub-components** → `components/[PageName]/` folder
  - Examples: `components/ScrollFetch/`, `components/WebRTC/`

#### Usage Example:

```tsx
// app/[locale]/components/banner-demo/page.tsx (Server Component)
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const BannerDemoClient = dynamic(() => import('@/components/Demo/BannerDemo'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Banner Carousel Component Test',
    description: 'Demonstrating various Banner component usages'
  };
}

export default function BannerDemoPage() {
  return <BannerDemoClient />;
}
```

```tsx
// components/Demo/BannerDemo.tsx (Client Component)
'use client';

import { useState } from 'react';
import Banner from '@/components/Banner';
import style from '@/app/[locale]/components/banner-demo/page.module.scss';

export default function BannerDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ... component logic
}
```

---

## 4. Quick Reference

### Naming Examples

| What | Format | Example |
|------|--------|---------|
| Page root class | `[name]_page` | `.hooks_test_page` |
| Component root class | `[name]` | `.image_upload` |
| Element | `block-element` | `.image_upload-preview` |
| Sub-element | `block-element-child` | `.image_upload-preview-img` |
| Multi-word segment | `word_word` | `.content_box`, `.section_title` |
| State attribute | `css-is-[state]` | `css-is-active`, `css-is-dragging` |
| CSS variable | `--word_word` | `--editor_height`, `--offset_y` |

### Do's and Don'ts

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use `as unknown as Type` | Use `as any` |
| Use `-` for BEM elements | Use `__` for BEM elements |
| Use `_` for multi-word names | Use `-` for multi-word names within a segment |
| Use `css-` prefix for state attributes | Use arbitrary attribute names for CSS states |
| Use `_` in CSS variable names | Use `-` in CSS variable names |
| Create placeholders in `styles/placeholders/` | Create `_shared` folders in `app/` |
| Give each page a unique root class | Share CSS class names between pages |
| Create components for shared DOM | Share CSS files between pages |

---

## 5. Next.js Standards

### 5.1 Dynamic Import and SSR (MANDATORY)

#### Correct Usage

```tsx
// ✅ CORRECT: Use dynamic() with default behavior (SSR enabled)
import dynamic from 'next/dynamic';
const DemoComponent = dynamic(() => import('@/components/Demo/Example'));
```

#### Wrong Usage

```tsx
// ❌ WRONG: Do NOT arbitrarily disable SSR
const DemoComponent = dynamic(() => import('@/components/Demo/Example'), { ssr: false });
```

#### When Should You Use `{ ssr: false }`?

Only in these rare cases:
1. Third-party packages that use `window` or `document` internally and cannot run in Node.js
2. The package doesn't provide an SSR-compatible version
3. You've confirmed there are no other solutions

#### Consequences of Misuse

1. **Build Failure**: May cause build errors in certain configurations
2. **SEO Damage**: Search engines cannot properly crawl page content
3. **Performance Degradation**: Increases first contentful paint (FCP/LCP)
4. **Layout Shift**: May cause page content to jump

### 5.2 Internationalization (next-intl 4.x) (MANDATORY)

This project uses `next-intl` 4.x for internationalization. **Every page using translations in Server Components MUST follow this pattern:**

#### Required Pattern

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

async function MyPage({ params }: Props) {
  const { locale } = await params;
  
  // MANDATORY: Call before any translation functions
  setRequestLocale(locale);
  
  const t = await getTranslations('pages.myPage');
  return <h1>{t('title')}</h1>;
}

export default MyPage;
```

#### Key Rules

| Rule | Description |
|------|-------------|
| `setRequestLocale` first | Must be called BEFORE `getTranslations` or `getMessages` |
| Page must have `params` | Every page needs `params: Promise<{ locale: string }>` |
| Layout also needs it | `app/[locale]/layout.tsx` must also call `setRequestLocale` |

#### Consequences of Missing `setRequestLocale`

- ❌ Server Components will default to the fallback language (zh-tw)
- ❌ Language switching from URL (`/en` vs `/zh-tw`) will not work for page content
- ✅ Client Components (Header, etc.) will still work correctly

#### Language Files Location

```
i18n/
├── locales/
│   ├── zh-tw.json   # Traditional Chinese (default)
│   └── en.json      # English
├── navigation.ts     # Navigation utilities
├── request.ts        # Request config
└── routing.ts        # Routing config
```

### 5.3 useLayoutEffect vs useEffect (RECOMMENDED)

When synchronizing external props to internal state that affects **visual rendering**, use `useLayoutEffect`:

#### When to use `useLayoutEffect`

```tsx
// ✅ CORRECT: Prevents visual flickering during slider/swiper transitions
useLayoutEffect(() => {
  setSliderIndex(externalValue);
}, [externalValue]);
```

**Use cases:**
- Slider/Swiper position sync
- Animation state initialization  
- DOM measurements before paint
- Any state sync that affects layout/position

#### When to use `useEffect`

```tsx
// ✅ CORRECT: For non-visual side effects
useEffect(() => {
  fetchData();
  subscribeToEvents();
}, [dependencies]);
```

**Use cases:**
- Data fetching
- Event subscriptions
- Timers and intervals
- Analytics tracking

#### Key Differences

| Aspect | `useEffect` | `useLayoutEffect` |
|--------|-------------|-------------------|
| Timing | After browser paint | Before browser paint |
| Execution | Asynchronous | Synchronous |
| Blocks UI | No | Yes |

> ⚠️ **Warning**: `useLayoutEffect` runs synchronously and blocks the browser from painting. Avoid heavy computations.

#### Important: React Timing vs JavaScript async/await

The terms "synchronous" and "asynchronous" here refer to **React's rendering cycle timing**, NOT JavaScript's `async/await`:

| Concept | Meaning |
|---------|---------|
| **React timing (this section)** | When the hook runs relative to browser paint |
| **JavaScript async/await** | Handling Promises for async operations (API calls, file I/O) |

```
React Rendering Flow:
Render → Commit → [useLayoutEffect] → Paint → [useEffect]
                       ↑ Synchronous           ↑ Asynchronous
                   (blocks paint)          (after paint)
```

**Quick Summary:**
- React synchronous/asynchronous → Affects **screen rendering order**
- JavaScript async/await → Handles **asynchronous operations** (API, Timer, etc.)

### 5.4 React Stable API Policy (MANDATORY)

This project prioritizes **React Stable APIs**, **avoids experimental syntax**, and requires **proper hook selection**.

#### Complete React 19 Stable Hooks

| Category | Hooks |
|----------|-------|
| State | `useState`, `useReducer` |
| Context | `useContext` |
| Ref | `useRef`, `useImperativeHandle` |
| Effect | `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent` |
| Performance | `useMemo`, `useCallback` |
| Scheduling | `useTransition`, `useDeferredValue` |
| Other | `useId`, `useSyncExternalStore`, `useDebugValue` |
| React 19 New | `useActionState`, `useFormStatus`, `useOptimistic`, `use` |

#### Hook Selection Guidelines

| Scenario | Hook |
|----------|------|
| Expensive calculations | `useMemo` |
| Callbacks passed to children | `useCallback` |
| Prevent unnecessary re-renders | `memo` |
| Access DOM / mutable values | `useRef` |
| Complex state logic | `useReducer` |
| Share state across components | `useContext` |
| Visual sync (prevent flicker) | `useLayoutEffect` |
| Form action state (React 19) | `useActionState` |
| Optimistic updates (React 19) | `useOptimistic` |
| Non-blocking UI updates | `useTransition` |
| Reactive events inside effects | `useEffectEvent` |

#### Anti-Patterns to Avoid

- ❌ DON'T use inline arrow functions in JSX when passing to memoized children → use `useCallback`
- ❌ DON'T recalculate values on every render → use `useMemo`
- ❌ DON'T use `useState` for values that don't need re-render → use `useRef`

#### RTK vs useContext (When using Redux Toolkit)

| Use RTK for | Use useContext for |
|-------------|-------------------|
| Global app state (user, cart, notifications) | Theme Provider (MUI ThemeContext) |
| Cross-page shared data | Locale/i18n (next-intl) |
| Persisted state | Local component tree state |
| Complex async data (RTK Query) | Third-party Provider (React Query, SWR) |
| State needing DevTools debugging | Component library internal state (FormContext) |

#### Experimental Features to Avoid

- ❌ React Compiler / React Forget (experimental)
- ❌ Any feature marked as "Canary" or "Experimental" in React docs
- ❌ Unstable APIs (prefixed with `unstable_`)

### 5.5 Build & Dev Tooling (MANDATORY)

Due to SCSS `:export` syntax incompatibility with Turbopack, you MUST use the following scripts:

- **Development**:
  - `yarn dev:webpack` (HTTP)
  - `yarn dev-https:webpack` (HTTPS - Required for WebRTC/WebAuthn)
- **Production Build**:
  - `yarn build:webpack`

**FORBIDDEN**: Do not use `yarn dev` or `yarn build` directly as they may default to Turbopack or lack necessary configurations.

**Environment Check**: When starting the development server, ALWAYS check if `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_DOMAIN` in `.env` match the port/domain settings in `package.json` scripts. If there is a mismatch (e.g., .env port 3000 vs script port 3001), OR if `.env` is gitignored and unreadable by the IDE, you MUST wait for user confirmation before proceeding.


### 5.6 Server Components vs Client Components (MANDATORY)

**Core Principle**: Default to Server Components, use Client Components only when needed.

#### When to use Server Components (default)

| Scenario | Reason |
|----------|--------|
| Data fetching | Reduces client bundle, faster load |
| Backend resources | Direct DB queries, file access |
| Sensitive data | API keys, tokens not exposed |
| Static content | Non-interactive UI |

#### When to use Client Components (`'use client'`)

| Scenario | Reason |
|----------|--------|
| Interactivity | onClick, onChange events |
| Hooks | useState, useEffect, useContext |
| Browser APIs | localStorage, window |
| Third-party client libs | Libraries that depend on window |

#### Best Practices

1. **Push `'use client'` to leaf components** - Don't mark entire pages as client
2. **Server fetches, Client renders** - Fetch data in Server Component, pass to Client
3. **Use children pattern** - Server can wrap Client which wraps Server via children


### 5.7 Hydration Strategy and State Management (CRITICAL)

For critical data that affects **Initial Render** (such as `nonce`, theme settings, locale), you **MUST** use **Props** or **Context** for passing data, instead of relying solely on Redux.

#### Why not just Redux?

Redux state initialization on the Client often happens slightly later than React's Hydration, or starts with an "empty" initial state. This leads to:

1. **Server Side**: HTML contains correct data (e.g., `nonce="xyz"`).
2. **Client Side (Hydration)**: Redux is not yet synced, using initial value (e.g., `nonce=""`).
3. **Result**: React detects attribute mismatch and throws **Hydration Mismatch Error**.

#### Correct Approach

| Data Type | Recommended Method | Reason |
|-----------|--------------------|--------|
| **Critical Data** (Nonce, Locale) | **Props / Context** | Ensures Server HTML and Client Initial Render match perfectly |
| **Interactive Data** (User, Cart) | **Redux / React Query** | Can be loaded or updated after Hydration |

**Example (Correct - Using Context for synchronization):**

```tsx
// Server Component (Layout)
<NonceProvider nonce={nonce}>
  {children}
</NonceProvider>

// Client Component
const nonce = useNonce(); // Gets the correct value during the very first render
```

---

## 6. Database Standards

### 6.1 Backend ORM Best Practices (MANDATORY)

When implementing database operations, **always prioritize**:
1. **Official ORM patterns** - Use sequelize-cli official approach
2. **Community best practices** - Well-established community patterns
3. **Custom implementation** - Only if no official pattern exists

#### ⚠️ Database Modification Confirmation (CRITICAL)

**Before ANY database schema change** (migrations, model changes, table alterations), you MUST:

1. **Ask the human developer**: "專案是否已部署上線？(Is this project deployed to production?)"
2. **Based on the answer**:
   - **Not deployed**: May modify existing migrations, then use `yarn initDB` or `yarn migrate:undo` + `yarn migrate`
   - **Deployed**: NEVER modify existing migrations; always create NEW migration files

This applies to:
- Creating new tables
- Adding/removing columns
- Changing column types or constraints
- Adding/removing indexes
- Any schema modifications

#### Migrations & Seeders
- Use `sequelize-cli` via `yarn sequelize` or `yarn sequelize:ts`
- **IMPORTANT**: sequelize-cli generates `.js` files by default. Convert to `.ts` with proper type annotations
- Location: `db/migrations/`, `db/seeders/`
- Commands: `yarn migrate`, `yarn seed`, `yarn initDB`
- **Migration Modification Policy:**
  - **Early Development (Pre-production)**: 
    - Modify original migrations directly instead of creating new `addColumn` migrations
    - Add new columns to the original `createTable` migration
    - Run `yarn initDB` (or equivalent reset sequence) to apply changes
  - **Post-production**: Never modify executed migrations; create new migration files

---

## 7. No Scripts for Code Refactoring (⚠️ CRITICAL)

**ABSOLUTELY FORBIDDEN: Using automated scripts (sed, awk, powershell, batch scripts) to modify code files.**

### Why
- Scripts only change text, they don't understand context or imports
- 2026-01-23 incident: `sed` changed `React.FormEvent` → `FormEvent` but forgot imports → compilation errors

### ✅ Allowed
- Use AI tools: `replace_file_content`, `multi_replace_file_content`
- MUST verify imports are correct after every change

### ❌ Forbidden
- `sed`, `awk`, `perl`, `powershell -Command`, `find ... -exec`
- Any batch text processing

### Exception
If absolutely necessary:
1. Get explicit human approval FIRST
2. Show complete script for review
3. Explain why manual tools can't do it

### Remember
**Scripts are blind. AI should be intelligent.**
