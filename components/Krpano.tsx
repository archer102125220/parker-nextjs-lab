'use client';

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useId
} from 'react';

// Krpano 實例接口
interface KrpanoInstance {
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
  onclick?: string;
}

// Krpano 組件 Props
export interface KrpanoProps {
  /** XML 配置文件路徑，默認為 '/vtour/tour.xml' */
  xml?: string;
  /** 初始場景名稱 - 僅用於組件掛載時 */
  startScene?: string;
  /** 當前場景名稱 - 用於動態切換 */
  currentScene?: string;
  /** 熱點 A 配置 */
  hotspotA?: Partial<HotspotConfig>;
  /** 熱點 B 配置 */
  hotspotB?: Partial<HotspotConfig>;
  /** 是否自動添加切換功能，默認 true */
  enableToggle?: boolean;
  /** 容器背景色 */
  bgcolor?: string;
  /** 自定義 className */
  className?: string;
  /** 載入完成回調 */
  onReady?: (krpano: KrpanoInstance) => void;
}

// Krpano Ref 方法 (僅保留作為逃生艙的實例獲取)
export interface KrpanoRef {
  /** 獲取 Krpano 實例（僅限進階用途，盡量透過 props 控制） */
  getInstance: () => KrpanoInstance | null;
}

// 默認熱點配置
const DEFAULT_HOTSPOT_A: HotspotConfig = {
  name: 'hotspot_A',
  url: '/krpano/skin/vtourskin_hotspot.png',
  ath: 0,
  atv: 0,
  scale: 0.5,
  visible: true,
  onclick: 'toggle_visibility(hotspot_B);'
};

const DEFAULT_HOTSPOT_B: HotspotConfig = {
  name: 'hotspot_B',
  url: '/krpano/skin/vtourskin_mapspot.png',
  ath: 30,
  atv: 0,
  scale: 0.5,
  visible: true
};

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
  }
}

// 添加單個熱點的輔助函數
function addHotspot(krpano: KrpanoInstance, config: HotspotConfig) {
  krpano.call(`addhotspot(${config.name})`);
  krpano.set(`hotspot[${config.name}].keep`, true);
  updateHotspot(krpano, config);
}

// 更新熱點屬性的輔助函數
function updateHotspot(krpano: KrpanoInstance, config: HotspotConfig) {
  krpano.set(`hotspot[${config.name}].url`, config.url);
  krpano.set(`hotspot[${config.name}].ath`, config.ath);
  krpano.set(`hotspot[${config.name}].atv`, config.atv);
  krpano.set(`hotspot[${config.name}].scale`, config.scale ?? 0.5);
  krpano.set(`hotspot[${config.name}].visible`, config.visible ?? true);
  if (config.onclick) {
    krpano.set(`hotspot[${config.name}].onclick`, config.onclick);
  }
}

const Krpano = forwardRef<KrpanoRef, KrpanoProps>(function Krpano(
  {
    xml = '/krpano/tour.xml',
    startScene,
    currentScene,
    hotspotA,
    hotspotB,
    enableToggle = true,
    bgcolor = '#000000',
    className,
    onReady
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const krpanoRef = useRef<KrpanoInstance | null>(null);
  const initializedRef = useRef(false);
  const reactId = useId();
  // 將 React ID 中的冒號替換掉（krpano 不接受冒號）
  const panoId = `krpano${reactId.replace(/:/g, '_')}`;
  const containerId = `${panoId}_container`;

  // 使用 useMemo 穩定化熱點配置
  const mergedHotspotA = useMemo<HotspotConfig>(
    () => ({ ...DEFAULT_HOTSPOT_A, ...hotspotA }),
    [hotspotA]
  );

  const mergedHotspotB = useMemo<HotspotConfig>(
    () => ({ ...DEFAULT_HOTSPOT_B, ...hotspotB }),
    [hotspotB]
  );

  // 初始化 Krpano
  useEffect(() => {
    if (initializedRef.current) return;

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        // 檢查是否已經載入
        if (window.embedpano) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = '/krpano/tour.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Failed to load Krpano tour.js'));
        document.head.appendChild(script);
      });
    };

    const initPano = async () => {
      if (!containerRef.current) return;

      try {
        await loadScript();

        if (!window.embedpano || !containerRef.current) return;

        window.embedpano({
          id: panoId,
          xml: xml,
          target: containerId,
          html5: 'only',
          mobilescale: 1.0,
          passQueryParameters: startScene ? `startscene=${startScene}` : '',
          bgcolor: bgcolor,
          onready: (krpano: KrpanoInstance) => {
            krpanoRef.current = krpano;
            initializedRef.current = true;

            // 添加熱點
            addHotspot(krpano, mergedHotspotA);
            addHotspot(krpano, mergedHotspotB);

            onReady?.(krpano);
          }
        });
      } catch (error) {
        console.error('Failed to initialize Krpano:', error);
      }
    };

    initPano();

    return () => {
      if (window.removepano) {
        window.removepano(panoId);
      }
      krpanoRef.current = null;
      initializedRef.current = false;
    };
    // 依賴項只包含初始化需要的參數，避免重複初始化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xml, startScene, bgcolor, onReady, containerId, panoId]);

  // 監聽當前場景更新
  useEffect(() => {
    const krpano = krpanoRef.current;
    if (!krpano || !initializedRef.current || !currentScene) return;

    // 如果當前場景與目標場景不同（Krpano API 查詢當前場景有點複雜，這裡直接呼叫 loadscene）
    // 或者可以信任 React 的 diff
    krpano.call(`loadscene(${currentScene}, null, MERGE, BLEND(0.5))`);
  }, [currentScene]);

  // 監聽熱點 A 更新
  useEffect(() => {
    const krpano = krpanoRef.current;
    if (!krpano || !initializedRef.current) return;
    updateHotspot(krpano, mergedHotspotA);
  }, [mergedHotspotA]);

  // 監聽熱點 B 更新
  useEffect(() => {
    const krpano = krpanoRef.current;
    if (!krpano || !initializedRef.current) return;
    updateHotspot(krpano, mergedHotspotB);
  }, [mergedHotspotB]);

  // 監聽 enableToggle 更新
  useEffect(() => {
    const krpano = krpanoRef.current;
    if (!krpano || !initializedRef.current) return;

    const hotspotAName = mergedHotspotA.name;
    const hotspotBName = mergedHotspotB.name;

    if (enableToggle) {
      krpano.set(
        `hotspot[${hotspotAName}].onclick`,
        `toggle_visibility(${hotspotBName})`
      );
    } else {
      krpano.set(`hotspot[${hotspotAName}].onclick`, '');
    }
  }, [enableToggle, mergedHotspotA.name, mergedHotspotB.name]);

  const getInstance = useCallback(() => krpanoRef.current, []);

  // 透過 ref 暴露方法
  useImperativeHandle(
    ref,
    () => ({
      getInstance
    }),
    [getInstance]
  );

  return <div id={containerId} ref={containerRef} className={className} />;
});

export default Krpano;
