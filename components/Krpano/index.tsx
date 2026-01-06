'use client';

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useId
} from 'react';

import type {
  KrpanoInstance,
  HotspotConfig,
  KrpanoProps,
  KrpanoRef
} from './types';
import {
  hotspotCallbacks,
  addHotspot,
  removeHotspot,
  updateHotspot,
  initOrUpdateTextLayer
} from './helpers';

export const Krpano = forwardRef<KrpanoRef, KrpanoProps>(function Krpano(
  {
    xml = '/krpano/tour.xml',
    startScene,
    currentScene,
    hotspots = [],
    bgcolor = '#000000',
    className,
    onReady,
    debug = false,
    textLayerContent,
    onLoadComplete
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const krpanoRef = useRef<KrpanoInstance | null>(null);
  const initializedRef = useRef(false);
  const prevHotspotsRef = useRef<HotspotConfig[]>([]);
  const reactId = useId();
  // 將 React ID 中的冒號替換掉（krpano 不接受冒號）
  const panoId = `krpano${reactId.replace(/:/g, '_')}`;
  const containerId = `${panoId}_container`;

  // 註冊全域熱點點擊處理函數
  useEffect(() => {
    // 定義全域函數供 Krpano jscall 使用
    (window as unknown as Record<string, unknown>).__krpanoHotspotClick = (
      callbackKey: string
    ) => {
      const callback = hotspotCallbacks.get(callbackKey);
      if (callback) {
        callback(krpanoRef.current!);
      }
    };

    return () => {
      // 清理全域函數
      delete (window as unknown as Record<string, unknown>)
        .__krpanoHotspotClick;
    };
  }, []);

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

            // 添加所有熱點
            hotspots.forEach((hotspot) => {
              addHotspot(krpano, hotspot, panoId);
            });
            prevHotspotsRef.current = hotspots;

            // 定義統一的 onloadcomplete 回調，整合內部邏輯與外部 callback
            window.onKrpanoLoadComplete = () => {
              initOrUpdateTextLayer(krpano, textLayerContent);
              onLoadComplete?.(krpano);
            };

            // 使用 events.onloadcomplete 事件，在場景完全載入後觸發
            // 這是 Krpano 官方推薦的方式，比 delayedcall 更可靠
            krpano.set(
              'events.onloadcomplete',
              'jscall(onKrpanoLoadComplete())'
            );

            onReady?.(krpano);
          }
        });
      } catch (error) {
        console.error('Failed to initialize Krpano:', error);
      }
    };

    initPano();

    return () => {
      // 清理所有熱點的 callbacks
      hotspots.forEach((hotspot) => {
        const eventTypes = ['onclick', 'onover', 'onout', 'ondown', 'onup'];
        eventTypes.forEach((eventName) => {
          const callbackKey = `${panoId}_${hotspot.name}_${eventName}`;
          hotspotCallbacks.delete(callbackKey);
        });
      });

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

  // 監聽熱點陣列更新 - 進行 diff 並動態增減/更新熱點
  useEffect(() => {
    const krpano = krpanoRef.current;
    if (!krpano || !initializedRef.current) return;

    const prevHotspots = prevHotspotsRef.current;
    const prevNames = new Set(prevHotspots.map((h) => h.name));
    const currentNames = new Set(hotspots.map((h) => h.name));

    // 移除不再存在的熱點
    prevHotspots.forEach((hotspot) => {
      if (!currentNames.has(hotspot.name)) {
        removeHotspot(krpano, hotspot.name, panoId);
      }
    });

    // 添加新的熱點或更新現有熱點
    hotspots.forEach((hotspot) => {
      if (!prevNames.has(hotspot.name)) {
        // 新熱點
        addHotspot(krpano, hotspot, panoId);
      } else {
        // 更新現有熱點
        updateHotspot(krpano, hotspot, panoId);
      }
    });

    // 更新 ref
    prevHotspotsRef.current = hotspots;
  }, [hotspots, panoId]);

  // 監聽 debug 更新
  useEffect(() => {
    const krpano = krpanoRef.current;
    if (!krpano || !initializedRef.current) return;

    // 動態設定 debugmode
    krpano.set('debugmode', debug);
    // 開啟/關閉 Log 視窗
    krpano.call(`showlog(${debug})`);
  }, [debug]);

  // 監聯 textLayerContent 更新 - 動態文字圖層
  useEffect(() => {
    const krpano = krpanoRef.current;
    if (!krpano || !initializedRef.current) return;

    initOrUpdateTextLayer(krpano, textLayerContent);
  }, [textLayerContent]);

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

// Re-export types for external use
export type {
  KrpanoInstance,
  HotspotConfig,
  KrpanoProps,
  KrpanoRef
} from './types';
