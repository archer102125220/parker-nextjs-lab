'use client';

// 還有 BUG

import {
  type ReactNode,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  useEffectEvent,
  useState
} from 'react';

import {
  Ripples as RipplesAnimation,
  type RipplesElement
} from '@/utils/animation/ripples';

import styles from './ripples_background.module.scss';

export interface RipplesBackgroundProps {
  /** 背景圖片 URL */
  imageUrl: string;
  /** 水波紋解析度 (建議: 256, 512, 1024) */
  resolution?: number;
  /** 水滴半徑 */
  dropRadius?: number;
  /** 擾動強度 (建議: 0.01 ~ 0.1) */
  perturbance?: number;
  /** 是否啟用滑鼠/觸控互動 */
  interactive?: boolean;
  /** 圖片 CORS 設定 */
  crossOrigin?: string;
  /** 是否啟用自動水滴 */
  autoDrops?: boolean;
  /** 自動水滴間隔 (毫秒) */
  autoDropsInterval?: number;
  /** 自動水滴強度 */
  autoDropsStrength?: number;
  /** 自動水滴強度變化範圍 */
  autoDropsStrengthVariance?: number;

  children?: ReactNode;
  className?: string;
  ref?: React.Ref<RipplesBackgroundRef>;
}

export interface RipplesBackgroundRef {
  drop: (x: number, y: number, radius?: number, strength?: number) => void;
  pause: () => void;
  play: () => void;
  startAutoDrops: () => void;
  stopAutoDrops: () => void;
}

export default function RipplesBackground({
  imageUrl,
  resolution = 256,
  dropRadius = 20,
  perturbance = 0.03,
  interactive = true,
  crossOrigin = '',
  autoDrops = false,
  autoDropsInterval = 400,
  autoDropsStrength = 0.04,
  autoDropsStrengthVariance = 0.04,
  children,
  className = '',
  ref
}: RipplesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoDropsIntervalIdRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const visibilityObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Store the latest props to avoid stale closures in timeouts/events without recreating them
  const paramsRef = useRef({
    dropRadius,
    autoDropsStrength,
    autoDropsStrengthVariance
  });

  const [ripplesAnimationing, setRipplesAnimationing] =
    useState<boolean>(false);

  useLayoutEffect(() => {
    paramsRef.current = {
      dropRadius,
      autoDropsStrength,
      autoDropsStrengthVariance
    };
  }, [dropRadius, autoDropsStrength, autoDropsStrengthVariance]);

  const dropsAnimation = useEffectEvent(() => {
    if (!isVisibleRef.current) return;
    const el = containerRef.current as RipplesElement | null;
    if (!el || !el.ripples) return;

    const rect = el.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    const pRef = paramsRef.current;
    const strength =
      pRef.autoDropsStrength + Math.random() * pRef.autoDropsStrengthVariance;

    RipplesAnimation.ripples(el, 'drop', x, y, pRef.dropRadius, strength);
  });

  const startAutoDrops = useEffectEvent(() => {
    if (autoDropsIntervalIdRef.current !== null) return;

    autoDropsIntervalIdRef.current = setInterval(
      dropsAnimation,
      autoDropsInterval
    );
  });

  const stopAutoDrops = useEffectEvent(() => {
    if (autoDropsIntervalIdRef.current !== null) {
      clearInterval(autoDropsIntervalIdRef.current);
      autoDropsIntervalIdRef.current = null;
    }
  });

  const drop = useCallback(
    (x: number, y: number, radius?: number, strength?: number) => {
      if (containerRef.current) {
        const pRef = paramsRef.current;
        const r = typeof radius === 'number' ? radius : pRef.dropRadius;
        const s =
          typeof strength === 'number' ? strength : pRef.autoDropsStrength;
        RipplesAnimation.ripples(
          containerRef.current as RipplesElement,
          'drop',
          x,
          y,
          r,
          s
        );
      }
    },
    []
  );

  const pause = useCallback(() => {
    const el = containerRef.current as RipplesElement | null;
    if (el?.ripples) {
      RipplesAnimation.ripples(el, 'pause');
    }
  }, []);

  const play = useCallback(() => {
    const el = containerRef.current as RipplesElement | null;
    if (el?.ripples) {
      RipplesAnimation.ripples(el, 'play');
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      drop,
      pause,
      play,
      startAutoDrops: () => {
        setRipplesAnimationing(true);
      },
      stopAutoDrops: () => {
        setRipplesAnimationing(false);
      }
    }),
    [drop, pause, play]
  );

  useEffect(() => {
    const el = containerRef.current as RipplesElement | null;
    if (!el) return;

    RipplesAnimation.ripples(el, {
      imageUrl,
      resolution,
      dropRadius,
      perturbance,
      interactive,
      crossOrigin
    });

    visibilityObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisibleRef.current = true;
            play();
          } else {
            isVisibleRef.current = false;
            pause();
          }
        });
      },
      { threshold: 0 }
    );

    visibilityObserverRef.current.observe(el);

    return () => {
      if (visibilityObserverRef.current) {
        visibilityObserverRef.current.disconnect();
        visibilityObserverRef.current = null;
      }
      stopAutoDrops();
      if (el?.ripples) {
        RipplesAnimation.ripples(el, 'destroy');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoDrops) {
      requestAnimationFrame(startAutoDrops);
    } else {
      stopAutoDrops();
    }
    return () => stopAutoDrops();
  }, [autoDrops]);

  useEffect(() => {
    console.log({ ripplesAnimationing });
    if (ripplesAnimationing) {
      requestAnimationFrame(dropsAnimation);
    } else {
      stopAutoDrops();
    }
    return () => stopAutoDrops();
  }, [ripplesAnimationing]);

  return (
    <div
      ref={containerRef}
      className={[styles.ripples_background, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
