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
  /** 初始場景名稱 */
  startScene?: string;
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

// Krpano Ref 方法
export interface KrpanoRef {
  /** 切換熱點 A 的顯示/隱藏 */
  toggleHotspotA: () => void;
  /** 切換熱點 B 的顯示/隱藏 */
  toggleHotspotB: () => void;
  /** 設置熱點可見性 */
  setHotspotVisible: (hotspotName: string, visible: boolean) => void;
  /** 載入場景 */
  loadScene: (sceneName: string) => void;
  /** 獲取 Krpano 實例（進階用途） */
  getInstance: () => KrpanoInstance | null;
}

// 默認熱點配置
const DEFAULT_HOTSPOT_A: HotspotConfig = {
  name: 'hotspot_A',
  url: '/vtour/skin/vtourskin_hotspot.png',
  ath: 0,
  atv: 0,
  scale: 0.5,
  visible: true,
  onclick: 'toggle_b_visibility();'
};

const DEFAULT_HOTSPOT_B: HotspotConfig = {
  name: 'hotspot_B',
  url: '/vtour/skin/vtourskin_mapspot.png',
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
    xml = '/vtour/tour.xml',
    startScene,
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
        script.src = '/vtour/tour.js';
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

            // 添加切換 action (使用固定的 hotspot_B 名稱)
            if (enableToggle) {
              const hotspotBName = mergedHotspotB.name;
              krpano.call(
                `addaction(toggle_b_visibility, ` +
                  `if(hotspot[${hotspotBName}].visible, ` +
                  `set(hotspot[${hotspotBName}].visible, false), ` +
                  `set(hotspot[${hotspotBName}].visible, true)))`
              );
            }

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

    const hotspotBName = mergedHotspotB.name;
    // 重新定義 action
    if (enableToggle) {
      krpano.call(
        `addaction(toggle_b_visibility, ` +
          `if(hotspot[${hotspotBName}].visible, ` +
          `set(hotspot[${hotspotBName}].visible, false), ` +
          `set(hotspot[${hotspotBName}].visible, true)))`
      );
    } else {
      // 如果停用，可以在這裡移除 action 或做其他處理
      // 但目前簡單處理，保持 action 存在，由外部邏輯決定是否調用
    }
  }, [enableToggle, mergedHotspotB.name]);

  // 提供給外部的方法
  const toggleHotspotA = useCallback(() => {
    const krpano = krpanoRef.current;
    if (!krpano) {
      console.warn('toggleHotspotA: Krpano 尚未載入完成');
      return;
    }
    const hotspotName = mergedHotspotA.name;
    const currentVisible = krpano.get(`hotspot[${hotspotName}].visible`);
    krpano.set(`hotspot[${hotspotName}].visible`, !currentVisible);
  }, [mergedHotspotA.name]);

  const toggleHotspotB = useCallback(() => {
    const krpano = krpanoRef.current;
    if (!krpano) {
      console.warn('toggleHotspotB: Krpano 尚未載入完成');
      return;
    }
    if (!enableToggle) {
      console.warn('toggleHotspotB: toggle 功能已停用');
      return;
    }
    krpano.call('toggle_b_visibility()');
  }, [enableToggle]);

  const setHotspotVisible = useCallback(
    (hotspotName: string, visible: boolean) => {
      const krpano = krpanoRef.current;
      if (krpano) {
        krpano.set(`hotspot[${hotspotName}].visible`, visible);
      }
    },
    []
  );

  const loadScene = useCallback((sceneName: string) => {
    const krpano = krpanoRef.current;
    if (krpano) {
      krpano.call(`loadscene(${sceneName}, null, MERGE)`);
    }
  }, []);

  const getInstance = useCallback(() => krpanoRef.current, []);

  // 透過 ref 暴露方法
  useImperativeHandle(
    ref,
    () => ({
      toggleHotspotA,
      toggleHotspotB,
      setHotspotVisible,
      loadScene,
      getInstance
    }),
    [toggleHotspotA, toggleHotspotB, setHotspotVisible, loadScene, getInstance]
  );

  return <div id={containerId} ref={containerRef} className={className} />;
});

export default Krpano;
