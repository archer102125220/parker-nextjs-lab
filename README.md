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