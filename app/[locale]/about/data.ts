// About page content data types
export interface DescriptionItem {
  text: string;
  isDel?: boolean;
}

export interface Section {
  title: string;
  description?: DescriptionItem[];
  listItemList?: string[];
}

// About page content data (Traditional Chinese)
export const ABOUT_CONTENT_DATA_ZH: Section[] = [
  {
    title: '專案宗旨',
    description: [
      {
        isDel: false,
        text: '本專案為「Parker Chen 的Next.js實驗室」，聚焦於 Next.js 生態的整合與實驗'
      },
      {
        isDel: false,
        text: '，並透過實際頁面與 API 演示多語系、PWA、ISR、安全性、即時互動等主題。'
      }
    ]
  },
  {
    title: '核心模組與技術',
    listItemList: [
      'Next.js 16、React 19、Redux Toolkit 狀態管理',
      'Material-UI 元件庫',
      'next-intl 多語系（含語系目錄與瀏覽器語言偵測）',
      'Serwist PWA（injectManifest，自訂 service-worker）',
      'SCSS + PostCSS（含 px-to-rem 與客製 plugin）'
    ]
  },
  {
    title: '渲染與快取策略',
    description: [
      {
        isDel: false,
        text: '路由採用 SSR 與 ISR 混合策略，首頁與多語系路由皆啟用 ISR。'
      }
    ],
    listItemList: [
      '全域預渲染以利 PWA 完整快取',
      '多數功能頁（components、directives、css-drawing、route...）設為 ISR',
      'Next.js App Router 架構'
    ]
  },
  {
    title: 'API 與整合項目',
    listItemList: [
      'WebAuthn（註冊/驗證流程）',
      'FIDO2-lib 實作',
      'Firebase Admin 推播（Web / iOS / Android）與 Token 維護',
      '前端 API 快取測試與 Scroll Fetch 範例',
      'Server-Sent Events 與 Socket.IO 範例'
    ]
  },
  {
    title: 'PWA 與應用外觀',
    listItemList: [
      '以 Serwist 整合 service worker，離線與版本更新自動化',
      '自訂 Manifest（名稱、語言、colors、icons）',
      '站點圖示與 Favicon 已配置，顯示模式為 standalone'
    ]
  },
  {
    title: '多語系與導覽',
    listItemList: [
      '支援 zh / en，並提供語系切換 UI',
      '頁面 head 設定 lang 與多語系路由',
      '站名與標題整合 i18n 文案'
    ]
  },
  {
    title: '特色頁面與實驗',
    listItemList: [
      'Components / Directives / CSS Drawing 示範頁',
      'WebAuthn、FIDO2、生物辨識流程',
      'WebCam 與臉部識別（Face API）',
      'Server-Sent Events 與 Socket.IO 互動測試',
      '前端 API 快取測試（Frontend API Cache Test）',
      'Firebase（含 Cloud Messaging）'
    ]
  },
  {
    title: '設計與版權',
    listItemList: [
      '本站圖像與圖示由 Google Gemini 輔助生成與設計',
      '© Parker Chen 的Next.js實驗室'
    ]
  }
];

// About page content data (English)
export const ABOUT_CONTENT_DATA_EN: Section[] = [
  {
    title: 'Project Purpose',
    description: [
      {
        isDel: false,
        text: 'This project is "Parker Chen\'s Next.js Laboratory", focusing on Next.js ecosystem integration and experimentation'
      },
      {
        isDel: false,
        text: ', and demonstrates topics such as multi-language, PWA, ISR, security, real-time interaction through actual pages and APIs.'
      }
    ]
  },
  {
    title: 'Core Modules and Technologies',
    listItemList: [
      'Next.js 16, React 19, Redux Toolkit state management',
      'Material-UI component library',
      'next-intl multi-language (including locale directories and browser language detection)',
      'Serwist PWA (injectManifest, custom service-worker)',
      'SCSS + PostCSS (including px-to-rem and custom plugin)'
    ]
  },
  {
    title: 'Rendering and Caching Strategy',
    description: [
      {
        isDel: false,
        text: 'Routes adopt a hybrid strategy of SSR and ISR, with both homepage and multi-language routes enabled with ISR.'
      }
    ],
    listItemList: [
      'Global prerendering for complete PWA caching',
      'Most feature pages (components, directives, css-drawing, route...) set to ISR',
      'Next.js App Router architecture'
    ]
  },
  {
    title: 'API and Integration Items',
    listItemList: [
      'WebAuthn (registration/verification flow)',
      'FIDO2-lib implementation',
      'Firebase Admin push notifications (Web / iOS / Android) and Token maintenance',
      'Frontend API cache testing and Scroll Fetch examples',
      'Server-Sent Events and Socket.IO examples'
    ]
  },
  {
    title: 'PWA and App Appearance',
    listItemList: [
      'Integrate service worker with Serwist, automate offline and version updates',
      'Custom Manifest (name, language, colors, icons)',
      'Site icons and Favicon configured, display mode is standalone'
    ]
  },
  {
    title: 'Multi-language and Navigation',
    listItemList: [
      'Support zh / en, with language switching UI',
      'Page head sets lang and multi-language routes',
      'Site name and title integrate i18n copywriting'
    ]
  },
  {
    title: 'Featured Pages and Experiments',
    listItemList: [
      'Components / Directives / CSS Drawing demo pages',
      'WebAuthn, FIDO2, biometric authentication flow',
      'WebCam and face recognition (Face API)',
      'Server-Sent Events and Socket.IO interaction testing',
      'Frontend API cache testing (Frontend API Cache Test)',
      'Firebase (including Cloud Messaging)'
    ]
  },
  {
    title: 'Design and Copyright',
    listItemList: [
      'Site images and icons are generated and designed with assistance from Google Gemini',
      "© Parker Chen's Next.js Laboratory"
    ]
  }
];
