# Parker's Next.js Laboratory

[繁體中文說明](./README.zh-tw.md)

A comprehensive Next.js laboratory project showcasing modern web development practices, internationalization, Firebase integration, and custom component libraries.

## 🌟 Features

- **🌍 Internationalization**: Full i18n support with English and Traditional Chinese
- **🔥 Firebase Integration**: Complete Firebase ecosystem including Admin SDK, Messaging, and Analytics
- **📱 PWA Support**: Service Worker implementation with Serwist, offline fallback page
- **🎨 Material-UI**: Modern UI components with custom theming
- **🗄️ Database**: PostgreSQL with Sequelize ORM
- **📊 Analytics**: Google Analytics and Google Tag Manager integration
- **🔧 Custom Components**: 40+ reusable component library
- **⚡ Performance**: Optimized with Turbopack support and performance monitoring
- **🔐 Authentication**: WebAuthn/FIDO2 and OAuth (Google, Facebook, LINE) integration
- **📱 Mobile-First**: Responsive design with mobile optimization
- **🎥 WebRTC**: Real-time video chat with SSE signaling
- **🤖 AI/ML**: Face detection and face swap features with face-api.js

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- PostgreSQL database
- Firebase project (for Firebase features)
- Upstash Redis (for WebRTC signaling)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parker-nextjs-lab
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables in `.env`:
   - Database connection settings
   - Firebase configuration
   - Google Analytics/Tag Manager IDs
   - Upstash Redis credentials

4. **Database Setup**
   ```bash
   # Initialize database
   yarn initDB
   
   # Or step by step
   yarn createDB
   yarn migrate
   yarn seedAll
   ```

5. **Start Development Server**
   ```bash
   # With Turbopack (default, faster)
   yarn dev
   
   # With Webpack
   yarn dev:webpack
   
   # With HTTPS + Turbopack (required for WebRTC/WebAuthn)
   yarn dev-https
   
   # With HTTPS + Webpack
   yarn dev-https:webpack
   ```

   Open [http://localhost:3001](http://localhost:3001) (or https://localhost:3000 for HTTPS) to view the application.

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── components/           # Component demos (40+ examples)
│   │   ├── css-drawing/          # CSS art and drawings
│   │   ├── directive-effects/    # DOM manipulation demos
│   │   ├── face-swap/            # AI face swap (frontend/backend)
│   │   ├── firebase/             # Firebase integration demos
│   │   ├── hooks-test/           # Custom hooks demos
│   │   ├── server-sent-event-test/ # SSE messaging demos
│   │   ├── socket-test/          # Socket.IO & WebSocket demos
│   │   ├── web-authn/            # WebAuthn/FIDO2 authentication
│   │   ├── web-cam/              # Camera stream demos
│   │   └── web-rtc/              # WebRTC video chat
│   └── api/                      # API routes
│       ├── facebook-oauth-verify/
│       ├── google-oauth-verify/
│       ├── line-oauth-verify/
│       ├── face-swap/process/
│       ├── server-sent-event/    # SSE endpoints
│       ├── web-rtc/              # WebRTC signaling APIs
│       └── web-authn/            # WebAuthn endpoints
├── components/                   # Reusable components (40+)
│   ├── Animation/               # Animation components
│   ├── Banner/                  # Carousel banner
│   ├── Dialog/                  # Modal dialogs
│   ├── Drawer/                  # Side navigation
│   ├── ScrollFetch/             # Infinite scroll
│   ├── SwiperJs/                # Touch slider
│   ├── VirtualScroller/         # Virtual list
│   └── ...                      # Many more
├── hooks/                       # Custom React hooks (28+)
│   ├── useCameraStream.ts       # Camera access
│   ├── useEventSource.ts        # SSE client
│   ├── useWebSocket.ts          # WebSocket client
│   ├── useSocketIoClient.ts     # Socket.IO client
│   └── ...                      # Many more
├── proxy/                       # Middleware modules
├── proxy.ts                     # Middleware entry point
├── i18n/                        # Internationalization
├── services/                    # External service integrations
├── store/                       # Redux store configuration
└── utils/                       # Utility functions
```

## 🛠️ Available Scripts

### Development
- `yarn dev` - Start with Turbopack (port 3001, default)
- `yarn dev:webpack` - Start with Webpack bundler
- `yarn dev-https` - Start with HTTPS + Turbopack (port 3000)
- `yarn dev-https:webpack` - Start with HTTPS + Webpack

### Database
- `yarn initDB` - Initialize database (drop, create, migrate, seed)
- `yarn createDB` - Create database
- `yarn migrate` - Run database migrations
- `yarn seed` - Seed database with sample data

### Internationalization
- `yarn create-i18n` - Generate i18n files from Google Sheets

### Testing & Performance
- `yarn stress` - Run stress testing
- `yarn lint` - Run ESLint

### Build & Deploy
- `yarn build` - Build for production
- `yarn start` - Start production server

## 🌍 Internationalization

The project supports multiple languages with automatic locale detection:

- **English** (default): `/en/`
- **繁體中文**: `/zh-tw/`

Translation files are located in `i18n/locales/` and can be managed through Google Sheets integration.

## 🔥 Firebase Features

- **Authentication**: User management and WebAuthn support
- **Firestore**: Real-time database
- **Cloud Messaging**: Push notifications
- **Analytics**: User behavior tracking
- **Admin SDK**: Server-side Firebase operations

## 🎨 Component Library (40+)

### Core Components
- **Dialog**: Customizable modal dialogs
- **Drawer**: Side navigation drawer
- **ScrollFetch**: Infinite scroll with data fetching
- **SwiperJs/SwiperCustom**: Touch slider integration
- **VirtualScroller**: Virtualized list for performance
- **Banner**: Carousel banner component

### Form Components
- **DatePicker**: Date selection
- **PhoneInput**: Phone number input with validation
- **EnterLabel**: Animated input labels
- **Selector**: Custom select dropdown
- **SwitchButton**: Toggle switch
- **ImageUpload**: Image upload with preview

### UI Components
- **Animation**: Various animation effects
- **Countdown**: Timer countdown
- **GoTop**: Scroll to top button
- **Hexagon/Triangle**: CSS shape components
- **LoadingBar**: Progress indicators
- **SkeletonLoader**: Loading placeholders
- **Ripple**: Material ripple effect
- **Tabs**: Tab navigation
- **SlideInPanel**: Sliding panel

### Utility Components
- **QRCode**: QR code generator
- **Youtube**: YouTube player integration
- **WangEditor**: Rich text editor
- **NotificationPermission**: Push notification prompt

## 🪝 Custom Hooks (28+)

| Hook | Description |
|------|-------------|
| `useCameraStream` | Camera/microphone access |
| `useEventSource` | SSE client (GET) |
| `usePostEventSource` | SSE client (POST) |
| `useWebSocket` | WebSocket client |
| `useSocketIoClient` | Socket.IO client |
| `useDebounce` | Debounce values |
| `useThrottle` | Throttle values |
| `useLocalStorage` | localStorage sync |
| `useSessionStorage` | sessionStorage sync |
| `useMediaQuery` | Responsive breakpoints |
| `useMobile/useTablet` | Device detection |
| `useIntersectionObserver` | Viewport detection |
| `useLazyLoad` | Lazy loading images |
| `useClickOutside` | Click outside detection |
| `useKeyPress` | Keyboard events |
| `useInterval/useTimeout` | Timer hooks |
| `useWindowSize` | Window dimensions |
| `useBeforeunload` | Page leave warning |
| `useYoutube` | YouTube API integration |
| `useFacebook` | Facebook SDK |
| `useFirebase` | Firebase utilities |
| `useGTMTrack` | GTM event tracking |

## 💎 TypeScript Best Practices

This project follows **strict type safety** standards, completely avoiding the use of `any` types.

### Core Principles

#### ❌ Avoid Using `any`
```typescript
// ❌ Bad practice
function processData(data: any) {
  return data.value;
}

// ✅ Good practice
function processData<T extends { value: unknown }>(data: T) {
  return data.value;
}
```

#### ✅ Use Precise Type Definitions
```typescript
// ✅ Use official type definitions
import type * as faceApi from 'face-api.js';

export async function detectFace(
  image: faceApi.TNetInput
): Promise<faceApi.WithFaceLandmarks<...> | null>
```

#### ✅ Type Assertions with `as unknown as`
```typescript
// ✅ Double assertion (safer than as any)
const element = document.getElementById('id') as unknown as CustomElement;

// ❌ Avoid direct as any
const element = document.getElementById('id') as any;
```

### Real-World Examples

#### Face Swap API Type-Safe Implementation

```typescript
// utils/third-party/face-swap.ts

// 1. Use official type definitions
import type * as faceApi from 'face-api.js';

// 2. Explicit function signatures
export async function detectFace(
  image: faceApi.TNetInput
): Promise<faceApi.WithFaceLandmarks<
  { detection: faceApi.FaceDetection },
  faceApi.FaceLandmarks68
> | null> {
  const detection = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks();
  
  return detection || null;
}

// 3. Type assertions when necessary with as unknown as
// Reason: node-canvas types differ from browser types, but are runtime compatible
faceapi.env.monkeyPatch({
  Canvas: Canvas as unknown as typeof HTMLCanvasElement,
  Image: Image as unknown as typeof HTMLImageElement,
  ImageData: ImageData as unknown as typeof globalThis.ImageData
});
```

### Why Avoid `any`?

| Using `any` | Using Precise Types |
|------------|---------------------|
| ❌ Loses type checking | ✅ Compile-time error detection |
| ❌ No autocomplete | ✅ IDE IntelliSense |
| ❌ Difficult refactoring | ✅ Safe refactoring |
| ❌ Runtime errors | ✅ Compile-time errors |

### Type Assertion Guidelines

#### When to Use Type Assertions?

1. **Third-party library type mismatches** (e.g., node-canvas vs browser Canvas)
2. **DOM operations** (requiring specific element types)
3. **Dynamic module loading** (incomplete type definitions)

#### How to Use Safely?

```typescript
// ✅ Use as unknown as (double assertion)
const value = input as unknown as TargetType;

// ✅ Add comments explaining why
// Type assertion: node-canvas Image is compatible with TNetInput at runtime
const detection = await detectFace(img as unknown as faceApi.TNetInput);

// ✅ Use type guards
function isCustomType(value: unknown): value is CustomType {
  return typeof value === 'object' && value !== null && 'property' in value;
}
```

All code in this project follows these type safety principles to ensure code quality and maintainability.

## 🎨 CSS Development Standards

### CSS Property Order Convention

The project follows mainstream CSS property ordering standards to ensure code consistency and maintainability:

1. **Positioning** (position, top, left, z-index...)
2. **Display & Box Model** (display, flex, width, margin, padding, border...)
3. **Typography** (font, color, text-align...)
4. **Visual** (background, box-shadow, opacity...)
5. **Animation** (transition, animation...)
6. **Misc** (cursor, content...)

**Example**:
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
  border: 1px solid #ccc;

  /* Typography */
  font-size: 16px;
  color: #333;

  /* Visual */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  /* Animation */
  transition: all 0.3s;

  /* Misc */
  cursor: pointer;
}
```

> 💡 **Note**: In actual development, to keep code concise, you typically don't need to add comments before each property category. Comments are only recommended in complex styles to improve readability.

### CSS Naming Convention

The project adopts a **Modified BEM Naming Convention**, cleverly sacrificing standard BEM's visual symbols (`__`) for better double-click selection efficiency in development tools, while maintaining CSS specificity and state management semantic integrity through SCSS concatenation and HTML attributes.

#### Naming Structure

- **Block**: Single name, e.g., `.countdown`
- **Element**: Single hyphen `-` connecting Block and Element, e.g., `.countdown-down_enter`, `.countdown-up_leave`
- **Sub-Element**: Single hyphen `-` connecting parent and child elements, with underscores `_` separating semantic words within element names, e.g.:
  - `.countdown-down_enter-down_enter_up`
  - `.image_upload-preview-img`
- **State Modifiers**: Managed through HTML attribute selectors, e.g., `[css-is-anime-start='true']`, `[css-is-active='true']`

#### Root Element Naming Convention

To quickly identify problematic elements in browser dev tools, the project uses the following root element naming convention:

- **Page Root Elements**: Use `[page_name]_page` format
  - Examples: `.hooks_test_page`, `.socket_io_page`, `.web_rtc_page`
- **Component Root Elements**: Use `[component_name]` format
  - Examples: `.scroll_fetch`, `.image_upload`, `.countdown`

**Examples**:
```scss
// Page SCSS (app/[locale]/hooks-test/page.module.scss)
.hooks_test_page {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

// Component SCSS (components/ScrollFetch/scroll_fetch.scss)
.scroll_fetch {
  position: relative;
  width: 100%;
}
```

#### Advantages

1. ✅ **Double-click Selection** - No `__` interruption, complete class name selection
2. ✅ **SCSS Nesting** - Maintains semantic hierarchy through `&-element`
3. ✅ **Semantic Clarity** - Underscores separate multiple semantic words
4. ✅ **State Management** - Uses HTML attributes instead of modifier classes, reducing class count
5. ✅ **Maintainability** - Preserves good readability and maintainability

**Benefits**:
- ✅ Instantly identify element source in browser DevTools
- ✅ Quickly locate problematic files
- ✅ Easier debugging and maintenance

**Important Rule**:
> 📌 **All elements belonging to a page must be nested under the page root class**, making the hierarchy clear in the code.

```scss
// ✅ Correct: All elements nested under hooks_test_page
.hooks_test_page {
  @extend %test_page;
  
  &-description { }      // .hooks_test_page-description
  &-grid { }             // .hooks_test_page-grid
  &-section {            // .hooks_test_page-section
    &-title { }          // .hooks_test_page-section-title
    &-description { }    // .hooks_test_page-section-description
  }
}

// ❌ Wrong: Can't tell which page description and grid belong to
.hooks_test_page { }
.description { }
.grid { }
```

---

### SCSS Placeholders Style Reuse

The project uses **SCSS Placeholders (`%name`)** to achieve style reuse, reducing code duplication and improving maintainability.

#### Why Use Placeholders?

1. ✅ **Reduce Duplication** - Multiple selectors can inherit the same styles
2. ✅ **Improve Maintainability** - Modify once, affect all inheriting locations
3. ✅ **Better Organization** - Centralize shared styles
4. ✅ **Responsive Support** - Placeholders can use mixins

#### Usage Examples

**Defining Placeholders**:
```scss
// Define at the top of component or page <style> block
%data_block {
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  font-size: 16px;
}

%section_title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 20px 0;

  @include tablet {
    font-size: 20px;
  }
  @include mobile {
    font-size: 18px;
  }
}

%data_field {
  padding: 16px;
  text-align: left;

  @include tablet {
    padding: 12px 8px;
  }
  @include mobile {
    padding: 8px 4px;
  }
}
```

**Using Placeholders**:
```scss
.index_page {
  &-list_section {
    &-section_title {
      @extend %section_title;  // Inherit shared styles
    }

    &-loading {
      @extend %data_block;     // Inherit shared styles
      background-color: #e3f2fd;
      color: #1976d2;
    }

    &-error {
      @extend %data_block;     // Inherit shared styles
      background-color: #ffebee;
      color: #c62828;
    }

    &-table {
      &-header {
        @extend %data_field;   // Inherit shared styles
        font-weight: 600;
        color: #ffffff;
      }

      &-cell {
        @extend %data_field;   // Inherit shared styles
        color: #e1e1e1;
      }
    }
  }
}
```

#### Placeholders vs Mixins

**When to Use Placeholders**:
- ✅ Multiple selectors need exactly the same styles
- ✅ Styles don't need parameters (static styles)
- ✅ Want to reduce CSS output size (selectors are merged)

**When to Use Mixins**:
- ✅ Need parameterized styles
- ✅ Need customization based on usage
- ✅ Need conditional logic in styles

**Mixins Example** (Responsive Design):
```scss
// assets/css/mixin.scss
@mixin mobile {
  @media (max-width: 707px) {
    @content;
  }
}

@mixin tablet {
  @media (max-width: 1140px) {
    @content;
  }
}

// Usage
.index_page {
  padding: 20px;

  @include tablet {
    padding: 12px;
  }
  @include mobile {
    padding: 8px;
  }
}
```

---

#### Examples

**Example 1: Basic Block and Element**
```scss
.section {
  /* Block styles */
  padding: 20px;
  background-color: #f5f5f5;
  
  &-title {
    // .section-title (Element connected with hyphen -)
    margin-top: 0;
    font-size: 18px;
  }
  
  &-description {
    // .section-description
    color: #666;
    margin-bottom: 15px;
  }
  
  &-content_box {
    // .section-content_box (Multiple semantic words within element name use underscore _)
    padding: 15px;
    background: white;
  }
}
```

**Example 2: Block with Multiple Semantic Words**
```scss
.image_upload {
  // Block name uses underscore _ for multiple words
  position: relative;
  
  &-preview {
    // .image_upload-preview (Element connected with hyphen -)
    width: 100%;
    
    &-img {
      // .image_upload-preview-img (Sub-Element connected with hyphen -)
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  &-mask {
    // .image_upload-mask
    &[css-is-dragging='true'] {
      opacity: 0.8;
    }
  }
}
```

**Example 3: State Management**
```scss
.dropdown {
  position: relative;
  
  &-menu {
    // .dropdown-menu
    position: absolute;
    
    &-item {
      // .dropdown-menu-item (Sub-Element)
      padding: 8px;
      cursor: pointer;
    }
  }
}

.key_status {
  padding: 10px;
  
  &[data-pressed='true'] {
    // State managed via HTML attributes
    color: white;
  }
}
```

#### HTML Usage Example

**Using CSS Modules**:
```tsx
import styles from './page.module.scss';

// Example 1: Basic usage
<div className={styles.section}>
  <h2 className={styles['section-title']}>Title</h2>
  <p className={styles['section-description']}>Description</p>
  <div className={styles['section-content_box']}>
    Content
  </div>
</div>

// Example 2: Nested structure
<div className={styles.image_upload}>
  <div className={styles['image_upload-preview']}>
    <img className={styles['image_upload-preview-img']} src="..." />
  </div>
  <div className={styles['image_upload-mask']} css-is-dragging="true">
    <p>Drop image here</p>
  </div>
</div>

// Example 3: Dropdown menu
<div className={styles.dropdown}>
  <div className={styles['dropdown-menu']}>
    <div className={styles['dropdown-menu-item']}>Option 1</div>
    <div className={styles['dropdown-menu-item']}>Option 2</div>
  </div>
</div>
```

#### Key Principles

1. **Each element uses only one className** - Don't combine multiple classes
2. **All elements within a Block should be children of that Block** - Connected with hyphen `-`
3. **Multiple semantic words within element names use underscore `_`** - e.g., `content_box`, `value_display`
4. **States use HTML attributes** - e.g., `[css-is-active='true']`, `[data-pressed='true']`

#### Inline Styles Exceptions

While the project follows CSS modularization and BEM naming conventions, inline styles are allowed in the following cases:

1. **MUI sx prop** - Material-UI's official styling method
   ```tsx
   // ✅ Allowed: MUI sx prop
   <Box sx={{ padding: 2, marginBottom: 3 }}>
   ```
   > 💡 **Reason**: The `sx` prop is MUI's officially recommended styling method, supports the theme system, and doesn't require `!important` overrides

2. **CSS Variable Passing** (including dynamic calculated values)
   ```tsx
   // ✅ Allowed: Passing static or dynamic values via CSS variables
   <div style={{ '--editor-height': `${height}px` }}>
   <div style={{ '--offset-y': `${offsetY}px` }}>
   ```
   > 💡 **Reason**: Implement dynamic values through CSS variables, keeping style logic in CSS and improving component flexibility
   
   ```scss
   // Use CSS variables in SCSS
   .element {
     height: var(--editor-height);
     transform: translateY(var(--offset-y));
   }
   ```

3. **Third-party Library Requirements**
   ```tsx
   // ✅ Allowed: Google Tag Manager and other third-party requirements
   <noscript style={{ display: 'none', visibility: 'hidden' }}>
   ```

**❌ Inline Styles to Avoid**:
- Static style values (should use CSS classes)
- Dynamic calculated values (should use CSS variable passing)
- Predictable conditional styles (should use CSS attribute selectors)
- Repeated style patterns (should extract as placeholders or mixins)


All components in this project follow these CSS conventions to ensure code style consistency.

### CSS File Organization

The project adopts a **Hybrid Style Organization** strategy, combining centralized global tool management with component-specific styles placed nearby:

#### Directory Structure

```
parker-nextjs-lab/
├── styles/                    # Global style tools (centralized)
│   ├── globals.scss          # Global styles
│   ├── mixin.scss            # Mixins (reusable style functions)
│   ├── placeholders.scss     # Placeholders (extendable style templates)
│   └── variables.scss        # Variable definitions
│
├── components/                # Component-specific styles (co-located)
│   ├── Button/
│   │   ├── index.tsx
│   │   └── index.scss        # Component styles
│   └── Tabs/
│       ├── Bar.tsx
│       └── Bar.scss
│
└── app/                       # Page-specific styles (co-located)
    └── [locale]/
        ├── page.tsx
        └── page.module.scss  # Page styles
```

#### Style Placement Principles

1. **Global Tools** → `styles/` directory
   - ✅ Mixins (`@mixin`) - Parameterized style functions
   - ✅ Placeholders (`%placeholder`) - Extendable style templates
   - ✅ Variable definitions
   - ✅ Global styles

2. **Component Styles** → Within component directory
   - ✅ Co-located with component files
   - ✅ Use `.scss` or `.module.scss`
   - ✅ Contains only component-specific styles

3. **Page Styles** → Within `app/` directory
   - ✅ Co-located with page files
   - ✅ Use `.module.scss` to avoid global pollution
   - ✅ Contains only page-specific styles

#### Placeholders vs Mixins

**Placeholders (`%name`)**:
```scss
// styles/placeholders.scss
%flex {
  display: flex;
}

// Usage
.my-class {
  @extend %flex;  // Merges selectors, reduces duplicate CSS
}
```

**Mixins (`@mixin`)**:
```scss
// styles/mixin.scss
@mixin flex-layout($gap: 12px) {
  display: flex;
  gap: $gap;
}

// Usage
.my-class {
  @include flex-layout(16px);  // Accepts parameters, more flexible
}
```

#### Usage Example

```scss
// Import global tools in component SCSS
@use '@/styles/mixin' as *;
@use '@/styles/placeholders' as *;

.my-component {
  @extend %flex;                    // Use placeholder
  @include flex-layout(16px);       // Use mixin
  
  &_item {
    @extend %text_primary;
  }
}
```

#### Advantages

1. ✅ **Centralized Management** - Global tools are easy to maintain and update
2. ✅ **Co-location** - Component and page styles are easy to find
3. ✅ **Avoid Duplication** - Placeholders reduce duplicate CSS code
4. ✅ **Flexibility** - Mixins provide parameterized style functions
5. ✅ **Maintainability** - Clear separation of concerns

All style files in this project follow these organizational principles to ensure consistency and maintainability in style management.

### Type Safety Examples in This Project

- ✅ **Face Swap API**: Fully type-safe, zero `any` usage
- ✅ **Custom Hooks**: All hooks have explicit generic definitions
- ✅ **API Routes**: TypeScript interfaces for request/response
- ✅ **Components**: Props defined with interfaces, full IntelliSense support



## 🔀 Middleware Architecture

The project implements a modular middleware system inspired by Nuxt.js.

### Structure

```
├── proxy.ts                      # Main middleware entry
├── proxy/                        # Global middleware modules
│   ├── contentSecurityPolicy.ts  # CSP headers
│   ├── globalTest.ts             # Global test middleware
│   ├── i18n.ts                   # Internationalization
│   └── log.ts                    # Request logging
└── app/[locale]/
    ├── one/proxy.ts              # Page-specific middleware
    └── web-rtc/proxy.ts          # WebRTC UUID generation
```

### How It Works

1. **Policy Middleware**: Security headers (CSP)
2. **Global Middleware**: i18n, logging
3. **Page Middleware**: Route-specific logic (UUID generation, validation)

### Registration

```typescript
// proxy.ts
import { proxy as webRtcMiddleware } from '@/app/[locale]/web-rtc/proxy';

const MIDDLEWARE_SETTINGS = [
  { patch: '/web-rtc', handler: webRtcMiddleware }
];
```

## 📡 API Routes

### OAuth Verification
- `POST /api/facebook-oauth-verify` - Facebook token verification
- `POST /api/google-oauth-verify` - Google ID token verification
- `POST /api/line-oauth-verify` - LINE token verification

### WebRTC Signaling (SSE + Upstash Redis)
- `POST /api/web-rtc/join-room` - Join WebRTC room
- `POST /api/web-rtc/candidate-list` - Exchange ICE candidates
- `POST /api/web-rtc/description` - Exchange SDP offers/answers
- `GET /api/web-rtc/subscription/[roomId]` - SSE subscription

### Server-Sent Events
- `GET /api/server-sent-event` - Global SSE stream
- `GET /api/server-sent-event/room/[roomId]` - Room SSE stream
- `POST /api/server-sent-event/room/[roomId]/send` - Send room message

### WebAuthn
- `POST /api/web-authn/register` - Start registration
- `POST /api/web-authn/authenticate` - Start authentication

## 🔑 Redis Key Prefix Convention

This project shares an Upstash Redis instance with [parker-nuxt-lab](https://github.com/your-username/parker-nuxt-lab). To avoid key conflicts, all Redis keys use the `nextjs-lab:` prefix.

### Key Naming Convention

#### WebRTC Keys
```typescript
// Room member list
`nextjs-lab:web-rtc-member-list-${roomId}`

// Individual member type (Offer/Answer)
`nextjs-lab:web-rtc-member-type-${roomId}-${userId}`

// ICE Candidate list
`nextjs-lab:web-rtc-member-candidate-list-${roomId}`

// SDP Description list
`nextjs-lab:web-rtc-member-description-list-${roomId}`
```

#### SSE Keys
```typescript
// Room messages
`nextjs-lab:sse-room-messages-${roomId}`
```

### TTL Configuration

| Key Pattern | Purpose | TTL |
|------------|---------|-----|
| `nextjs-lab:web-rtc-*` | WebRTC signaling data | 10 minutes |
| `nextjs-lab:sse-room-messages-*` | SSE room messages | 1 hour |

### Project Differentiation

| Project | Redis Key Prefix |
|---------|-----------------|
| parker-nuxt-lab | (no prefix) |
| parker-nextjs-lab | `nextjs-lab:` |

This allows both projects to safely share the same Upstash Redis instance without conflicts.

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# Upstash Redis (for WebRTC)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Notes
- WebSocket/Socket.IO features require non-serverless environments
- Use SSE-based signaling for WebRTC on Vercel

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Parker's Next.js Laboratory** - A modern web development showcase