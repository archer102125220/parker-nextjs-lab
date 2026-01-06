// Krpano 實例接口
export interface KrpanoInstance {
  call: (action: string) => void;
  get: (path: string) => unknown;
  set: (path: string, value: unknown) => void;
}

// Hotspot 配置接口
export interface HotspotConfig {
  name: string;
  url: string;
  ath: number; // 水平角度 (horizontal angle)
  atv: number; // 垂直角度 (vertical angle)
  scale?: number;
  visible?: boolean;
  
  // Krpano XML action 字串
  /** Krpano onclick action (e.g., 'toggle_visibility(hotspot_B)') */
  krpanoOnClick?: string;
  /** Krpano onover action (滑鼠移入) */
  krpanoOnOver?: string;
  /** Krpano onout action (滑鼠移出) */
  krpanoOnOut?: string;
  /** Krpano ondown action (滑鼠按下) */
  krpanoOnDown?: string;
  /** Krpano onup action (滑鼠放開) */
  krpanoOnUp?: string;
  
  // React callbacks
  /** 點擊熱點時觸發 */
  onClick?: (hotspot: HotspotConfig, krpano: KrpanoInstance) => void;
  /** 滑鼠移入熱點時觸發 */
  onHover?: (hotspot: HotspotConfig, krpano: KrpanoInstance) => void;
  /** 滑鼠移出熱點時觸發 */
  onLeave?: (hotspot: HotspotConfig, krpano: KrpanoInstance) => void;
  /** 滑鼠按下時觸發 */
  onMouseDown?: (hotspot: HotspotConfig, krpano: KrpanoInstance) => void;
  /** 滑鼠放開時觸發 */
  onMouseUp?: (hotspot: HotspotConfig, krpano: KrpanoInstance) => void;
}

// Krpano 組件 Props
export interface KrpanoProps {
  /** XML 配置文件路徑，默認為 '/krpano/tour.xml' */
  xml?: string;
  /** 初始場景名稱 - 僅用於組件掛載時 */
  startScene?: string;
  /** 當前場景名稱 - 用於動態切換 */
  currentScene?: string;
  /** 熱點配置陣列 */
  hotspots?: HotspotConfig[];
  /** 容器背景色 */
  bgcolor?: string;
  /** 自定義 className */
  className?: string;
  /** 載入完成回調 */
  onReady?: (krpano: KrpanoInstance) => void;
  /** 是否開啟 Debug Log 視窗 */
  debug?: boolean;
  /** 動態文字圖層內容 (i18n) */
  textLayerContent?: string;
  /** 場景完全載入完成回調 (在 onReady 之後，場景圖像載入完成時觸發) */
  onLoadComplete?: (krpano: KrpanoInstance) => void;
}

// Krpano Ref 方法 (僅保留作為逃生艙的實例獲取)
export interface KrpanoRef {
  /** 獲取 Krpano 實例（僅限進階用途，盡量透過 props 控制） */
  getInstance: () => KrpanoInstance | null;
}

// Window 擴展類型
declare global {
  interface Window {
    embedpano?: (config: {
      swf?: string;
      id: string;
      xml: string;
      target: string;
      html5: string;
      mobilescale?: number;
      passQueryParameters?: string;
      bgcolor?: string;
      onready?: (krpano: KrpanoInstance) => void;
    }) => void;
    removepano?: (id: string) => void;
    onKrpanoLoadComplete?: () => void;
  }
}
