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
  amplitude = 30, // 振幅
  period = 2, // 周期数
  frequency = 1, // 频率
  fps = 70, // 每秒帧数
  wavePadding = null, // 波动区域
  stop = false,
  direction = DIRECTION_HORIZONTAL,
  onLoad
}: WavingImageProps): ReactNode {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [showImg, setShowImg] = useState<boolean>(true);
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);

  const safeWavePadding = useMemo(() => {
    return wavePadding ?? amplitude * 2;
  }, [wavePadding, amplitude]);

  const cssVariables = useMemo<WavingImageCSSProperties>(() => {
    const _cssVariables: WavingImageCSSProperties = {
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
    };

    return _cssVariables;
  }, [direction, safeWavePadding, showImg, canvasWidth, canvasHeight]);

  const initWavingImageDOM = useEffectEvent(() => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const img = imgRef.current;
    if (img instanceof HTMLImageElement === false) return;

    const canvas = canvasRef.current;
    if (canvas instanceof HTMLCanvasElement === false) return;

    const ctx = canvas.getContext('2d');
    if (ctx instanceof CanvasRenderingContext2D === false) return;

    if (typeof onLoad === 'function') onLoad(img, canvas, ctx);

    const imgWidth = Math.floor(img.width);
    const imgHeight = Math.floor(img.height);

    const scaledImageCanvas = document.createElement('canvas');
    scaledImageCanvas.width = imgWidth;
    scaledImageCanvas.height = imgHeight;
    const scaledImageCtx = scaledImageCanvas.getContext('2d');
    if (scaledImageCtx instanceof CanvasRenderingContext2D) {
      scaledImageCtx.drawImage(img, 0, 0, imgWidth, imgHeight);
    }

    const canvasWidth =
      direction === DIRECTION_HORIZONTAL
        ? imgWidth
        : imgWidth + safeWavePadding;
    const canvasHeight =
      direction === DIRECTION_HORIZONTAL
        ? imgHeight + safeWavePadding
        : imgHeight;

    setCanvasWidth(canvasWidth);
    setCanvasHeight(canvasHeight);

    const wavelength = imgWidth / period; // 波长
    const waveSpeed = wavelength * frequency; // 波速
    const spatialFrequency = (2 * Math.PI) / wavelength; // x系数
    const amplitudeRatio = amplitude / imgWidth; // 振幅系数

    const interval = 1000 / fps; // 连续帧之间间隔（理论）
    let timeNow = Date.now(); // 当前时间
    let timeLast = timeNow; // 上一帧时间
    let delta = 0; // 连续帧之间间隔（实际）
    let distance = 0;

    console.log({ imgWidth, imgHeight });

    function animateFrame() {
      if (stop) return;
      if (
        img instanceof HTMLImageElement === false ||
        canvas instanceof HTMLCanvasElement === false ||
        ctx instanceof CanvasRenderingContext2D === false
      ) {
        console.error('animateFrame error', {
          img,
          canvas,
          ctx
        });
        return;
      }

      timeNow = Date.now();
      delta = timeNow - timeLast;
      if (delta > interval) {
        timeLast = timeNow;
        distance += (delta / 1000) * waveSpeed;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (direction === DIRECTION_HORIZONTAL) {
          for (let x = 0; x < imgWidth; x++) {
            const y =
              amplitudeRatio * x * Math.sin(spatialFrequency * (x - distance)) +
              safeWavePadding / 2;
            ctx.drawImage(
              scaledImageCanvas,
              x,
              0,
              1,
              imgHeight,
              x,
              y,
              1,
              imgHeight
            );
          }
        } else if (direction === DIRECTION_VERTICAL) {
          for (let y = 0; y < imgHeight; y++) {
            const x =
              amplitudeRatio * y * Math.sin(spatialFrequency * (y - distance)) +
              safeWavePadding / 2;
            ctx.drawImage(
              scaledImageCanvas,
              0,
              y,
              imgWidth,
              1,
              x,
              y,
              imgWidth,
              1
            );
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(animateFrame);
    }

    animationFrameIdRef.current = requestAnimationFrame(animateFrame);
    requestAnimationFrame(function () {
      setShowImg(false);
    });

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  });

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowImg(true);
    setImgLoading(true);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete) {
      return initWavingImageDOM();
    }
  }, [imgLoading]);
  useLayoutEffect(() => {
    if (imgRef.current?.complete) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowImg(true);
    }
  }, [windowWidth, windowHeight]);
  useEffect(() => {
    let cancelAnimationFrame: (() => void) | null | undefined = null;
    if (imgRef.current?.complete) {
      requestAnimationFrame(
        () => (cancelAnimationFrame = initWavingImageDOM())
      );
    }
    return () => {
      if (cancelAnimationFrame) cancelAnimationFrame();
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
