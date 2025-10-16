# Parker's Next.js Laboratory

[繁體中文說明](./README.zh-tw.md)

A comprehensive Next.js laboratory project showcasing modern web development practices, internationalization, Firebase integration, and custom component libraries.

## 🌟 Features

- **🌍 Internationalization**: Full i18n support with English and Traditional Chinese
- **🔥 Firebase Integration**: Complete Firebase ecosystem including Admin SDK, Messaging, and Analytics
- **📱 PWA Support**: Service Worker implementation with Serwist
- **🎨 Material-UI**: Modern UI components with custom theming
- **🗄️ Database**: PostgreSQL with Sequelize ORM
- **📊 Analytics**: Google Analytics and Google Tag Manager integration
- **🔧 Custom Components**: Reusable component library including Dialog, Drawer, ScrollFetch, and Swiper
- **⚡ Performance**: Optimized with Turbopack support and performance monitoring
- **🔐 Authentication**: WebAuthn/FIDO2 integration for modern authentication
- **📱 Mobile-First**: Responsive design with mobile optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- PostgreSQL database
- Firebase project (for Firebase features)

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
   cp .env.example .env.local
   ```
   Configure your environment variables in `.env.local`:
   - Database connection settings
   - Firebase configuration
   - Google Analytics/Tag Manager IDs

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
   # Standard development
   yarn dev
   
   # With Turbopack (faster)
   yarn dev:turbopack
   
   # With HTTPS
   yarn dev-https
   ```

   Open [http://localhost:3001](http://localhost:3001) to view the application.

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── components/          # Component demos
│   │   ├── firebase/           # Firebase integration
│   │   └── one/                # Single page demos
│   ├── api/                     # API routes
│   └── layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── Dialog/                  # Custom dialog component
│   ├── Drawer/                  # Custom drawer component
│   ├── ScrollFetch/             # Infinite scroll component
│   ├── SwiperJs/                # Swiper.js integration
│   ├── FirebaseInit/            # Firebase initialization
│   └── Google/                  # Google services integration
├── hooks/                       # Custom React hooks
├── i18n/                        # Internationalization
│   └── locales/                 # Translation files
├── services/                    # External service integrations
├── store/                       # Redux store configuration
├── utils/                       # Utility functions
└── styles/                      # Global styles and themes
```

## 🛠️ Available Scripts

### Development
- `yarn dev` - Start development server
- `yarn dev:turbopack` - Start with Turbopack for faster builds
- `yarn dev-https` - Start with HTTPS support

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

## 🎨 Component Library

### Core Components
- **Dialog**: Customizable modal dialogs
- **Drawer**: Side navigation drawer
- **ScrollFetch**: Infinite scroll with data fetching
- **SwiperJs**: Touch slider integration

### Layout Components
- **Header/Footer**: Site navigation
- **PageLoading**: Loading states
- **Message**: Toast notifications

## 📊 Analytics & Tracking

- **Google Analytics 4**: User behavior analytics
- **Google Tag Manager**: Tag management
- **Vercel Analytics**: Performance monitoring
- **Custom Events**: GTM integration for custom tracking

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
```

### Next.js Configuration
The project uses:
- **next-intl**: Internationalization
- **Serwist**: Service Worker/PWA
- **SCSS**: Styling with global variables and mixins

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The project can be deployed to any platform supporting Node.js:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS/GCP/Azure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Material-UI](https://mui.com/) - React component library
- [Firebase](https://firebase.google.com/) - Backend services
- [Serwist](https://serwist.pages.dev/) - Service Worker library
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization

---

**Parker's Next.js Laboratory** - A modern web development showcase