'use client';

import {
  type ReactNode,
  type CSSProperties,
  useState,
  useMemo,
  useEffectEvent,
  useRef,
  useLayoutEffect,
  useEffect
} from 'react';

import { useWindowSize } from '@/hooks/useWindowSize';

import styles from './waving_image.module.scss';

export type WavingImageOnLoad = (
  img?: HTMLImageElement,
  canvas?: HTMLCanvasElement,
  ctx?: CanvasRenderingContext2D
) => void;

export const DIRECTION_HORIZONTAL = 'horizontal';
export const DIRECTION_VERTICAL = 'vertical';

export interface WavingImageProps {
  src: string;
  alt?: string;
  className?: string;
  amplitude?: number;
  period?: number;
  frequency?: number;
  fps?: number;
  wavePadding?: number | null;
  stop?: boolean;
  direction?: 'horizontal' | 'vertical';
  onLoad?: WavingImageOnLoad;
}

interface WavingImageCSSProperties extends CSSProperties {
  '--waving_image_wave_padding'?: string;
  '--waving_image_img_display'?: string;
  '--waving_image_canvas_display'?: string;
  '--waving_image_wrapper_width'?: string;
  '--waving_image_wrapper_height'?: string;
}

export default function WavingImage({
  src,
  alt = '',
  className = '',
  amplitude = 30, // 震幅
  period = 2, // 週期數
  frequency = 1, // 頻率
  fps = 70, // 每秒幀數
  wavePadding = null, // 波動區域
  stop = false,
  direction = DIRECTION_VERTICAL,
  onLoad
}: WavingImageProps): ReactNode {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const imgWidthRef = useRef<number | null>(null);
  const imgHeightRef = useRef<number | null>(null);
  const scaledImageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaledImageCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const wavelengthRef = useRef<number | null>(null);
  const waveSpeedRef = useRef<number | null>(null);
  const spatialFrequencyRef = useRef<number | null>(null);
  const amplitudeRatioRef = useRef<number | null>(null);

  const timeNowRef = useRef<number>(0);
  const timeLastRef = useRef<number>(0);
  const deltaRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);

  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [showImg, setShowImg] = useState<boolean>(true);
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);

  const safeWavePadding = useMemo(() => {
    return wavePadding ?? amplitude * 2;
  }, [wavePadding, amplitude]);
  const interval = useMemo(() => {
    return 1000 / fps;
  }, [fps]);

  const cssVariables = useMemo<WavingImageCSSProperties>(() => ({
    '--waving_image_wave_padding':
      direction === DIRECTION_HORIZONTAL
        ? `${safeWavePadding / 2}px 0 ${safeWavePadding / 2}px 0`
        : `0 ${safeWavePadding / 2}px 0 ${safeWavePadding / 2}px`,
    '--waving_image_img_display': showImg ? 'block' : 'none',
    '--waving_image_canvas_display': showImg ? 'none' : 'block',
    '--waving_image_wrapper_width': canvasWidth ? `${canvasWidth}px` : 'auto',
    '--waving_image_wrapper_height': canvasHeight
      ? `${canvasHeight}px`
      : 'auto'
  }), [direction, safeWavePadding, showImg, canvasWidth, canvasHeight]);

  const animateFrame = useEffectEvent(() => {
    if (stop) {
      // eslint-disable-next-line react-hooks/immutability
      animationFrameIdRef.current = requestAnimationFrame(animateFrame);
      return;
    }

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (
      img instanceof HTMLImageElement === false ||
      canvas instanceof HTMLCanvasElement === false ||
      ctx instanceof CanvasRenderingContext2D === false ||
      scaledImageCanvasRef.current instanceof HTMLCanvasElement === false ||
      wavelengthRef.current === null ||
      waveSpeedRef.current === null ||
      spatialFrequencyRef.current === null ||
      amplitudeRatioRef.current === null ||
      canvasWidth === null ||
      canvasHeight === null ||
      imgWidthRef.current === null ||
      imgHeightRef.current === null
    ) {
      console.error('animateFrame error', {
        img,
        canvas,
        ctx,
        scaledImageCanvasRef: scaledImageCanvasRef.current,
        wavelengthRef: wavelengthRef.current,
        waveSpeedRef: waveSpeedRef.current,
        spatialFrequencyRef: spatialFrequencyRef.current,
        amplitudeRatioRef: amplitudeRatioRef.current,
        canvasWidth,
        canvasHeight
      });
      return;
    }

    timeNowRef.current = Date.now();
    deltaRef.current = timeNowRef.current - timeLastRef.current;
    if (deltaRef.current > interval) {
      timeLastRef.current = timeNowRef.current;
      distanceRef.current += (deltaRef.current / 1000) * waveSpeedRef.current;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (direction === DIRECTION_HORIZONTAL) {
        for (let x = 0; x < imgWidthRef.current; x++) {
          const y =
            amplitudeRatioRef.current * x * Math.sin(spatialFrequencyRef.current * (x - distanceRef.current)) +
            safeWavePadding / 2;
          ctx.drawImage(
            scaledImageCanvasRef.current,
            x,
            0,
            1,
            imgHeightRef.current,
            x,
            y,
            1,
            imgHeightRef.current
          );
        }
      } else if (direction === DIRECTION_VERTICAL) {
        for (let y = 0; y < imgHeightRef.current; y++) {
          const x =
            amplitudeRatioRef.current * y * Math.sin(spatialFrequencyRef.current * (y - distanceRef.current)) +
            safeWavePadding / 2;
          ctx.drawImage(
            scaledImageCanvasRef.current,
            0,
            y,
            imgWidthRef.current,
            1,
            x,
            y,
            imgWidthRef.current,
            1
          );
        }
      }
    }

    // eslint-disable-next-line react-hooks/immutability
    animationFrameIdRef.current = requestAnimationFrame(animateFrame);
  })
  const initWavingImageDOM = useEffectEvent(() => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animationFrameIdRef.current = null;

    const img = imgRef.current;
    if (img instanceof HTMLImageElement === false) return;

    const canvas = canvasRef.current;
    if (canvas instanceof HTMLCanvasElement === false) return;

    const ctx = canvas.getContext('2d');
    if (ctx instanceof CanvasRenderingContext2D === false) return;

    if (typeof onLoad === 'function') onLoad(img, canvas, ctx);

    imgWidthRef.current = Math.floor(img.width);
    imgHeightRef.current = Math.floor(img.height);

    scaledImageCanvasRef.current = document.createElement('canvas');
    scaledImageCanvasRef.current.width = imgWidthRef.current;
    scaledImageCanvasRef.current.height = imgHeightRef.current;
    scaledImageCtxRef.current = scaledImageCanvasRef.current?.getContext('2d');
    if (scaledImageCtxRef.current instanceof CanvasRenderingContext2D) {
      scaledImageCtxRef.current.drawImage(img, 0, 0, imgWidthRef.current, imgHeightRef.current);
    }

    const canvasWidth =
      direction === DIRECTION_HORIZONTAL
        ? imgWidthRef.current
        : imgWidthRef.current + safeWavePadding;
    const canvasHeight =
      direction === DIRECTION_HORIZONTAL
        ? imgHeightRef.current + safeWavePadding
        : imgHeightRef.current;

    setCanvasWidth(canvasWidth);
    setCanvasHeight(canvasHeight);

    wavelengthRef.current = imgWidthRef.current / period; // 波長
    waveSpeedRef.current = wavelengthRef.current * frequency; // 波速
    spatialFrequencyRef.current = (2 * Math.PI) / wavelengthRef.current; // x係數
    amplitudeRatioRef.current = amplitude / imgWidthRef.current; // 振幅係數

    timeNowRef.current = Date.now(); // 當前時間
    timeLastRef.current = timeNowRef.current; // 上一幀時間
    deltaRef.current = 0; // 連續幀之間間隔（實際）
    distanceRef.current = 0;


    animationFrameIdRef.current = requestAnimationFrame(animateFrame);
    requestAnimationFrame(function () {
      setShowImg(false);
    });

  });

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowImg(true);
    setImgLoading(true);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete) {
      initWavingImageDOM();
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [imgLoading]);
  useLayoutEffect(() => {
    if (imgRef.current?.complete) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowImg(true);
    }
  }, [windowWidth, windowHeight]);
  useEffect(() => {
    if (imgRef.current?.complete) {
      requestAnimationFrame(initWavingImageDOM);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [windowWidth, windowHeight]);

  return (
    <div
      className={[styles.waving_image, className].join(' ')}
      style={cssVariables}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className={styles['waving_image-img']}
        src={src}
        alt={alt}
        onLoad={() => setImgLoading(false)}
      />
      <div className={styles['waving_image-wrapper']}>
        <canvas
          ref={canvasRef}
          className={styles['waving_image-wrapper-canvas']}
          width={canvasWidth ?? `${canvasWidth}`}
          height={canvasHeight ?? `${canvasHeight}`}
        />
      </div>
    </div>
  );
}
