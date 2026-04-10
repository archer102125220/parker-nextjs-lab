'use client';

import {
  type ReactNode,
  type CSSProperties,
  useState,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect
} from 'react';

import styles from './waving_image.module.scss';

export interface WavingImageProps {
  src: string;
  alt?: string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  amplitude?: number;
  period?: number;
  frequency?: number;
  fps?: number;
  stop?: boolean;
}

interface WavingImageCSSProperties extends CSSProperties {
  '--waving_image_img_display'?: string;
  '--waving_image_canvas_display'?: string;
  '--waving_image_wrapper_width'?: string;
  '--waving_image_wrapper_height'?: string;
}

export default function WavingImage({
  src,
  alt = '',
  amplitude = 30, // 振幅
  period = 2, // 周期数
  frequency = 1, // 频率
  fps = 70, // 每秒帧数
  stop = false
}: {
  src: string;
  alt?: string;
  amplitude?: number;
  period?: number;
  frequency?: number;
  fps?: number;
  stop?: boolean;
}): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const [showImg, setShowImg] = useState<boolean>(true);
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);

  const cssVariables = useMemo<WavingImageCSSProperties>(() => {
    const _cssVariables: WavingImageCSSProperties = {
      '--waving_image_img_display': showImg ? 'block' : 'none',
      '--waving_image_canvas_display': showImg ? 'none' : 'block',
      '--waving_image_wrapper_width': canvasWidth ? `${canvasWidth}px` : 'auto',
      '--waving_image_wrapper_height': canvasHeight
        ? `${canvasHeight}px`
        : 'auto'
    };

    return _cssVariables;
  }, [showImg, canvasWidth, canvasHeight]);

  const initWavingImageDOM = useCallback(() => {
    console.log('initWavingImageDOM');

    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const img = imgRef.current;
    if (img instanceof HTMLImageElement === false) return;

    const canvas = canvasRef.current;
    if (canvas instanceof HTMLCanvasElement === false) return;

    const ctx = canvas.getContext('2d');
    if (ctx instanceof CanvasRenderingContext2D === false) return;

    console.dir({ img });

    const imgWidth = Math.floor(img.width);
    const imgHeight = Math.floor(img.height);

    const scaledImageCanvas = document.createElement('canvas');
    scaledImageCanvas.width = imgWidth;
    scaledImageCanvas.height = imgHeight;
    const scaledImageCtx = scaledImageCanvas.getContext('2d');
    if (scaledImageCtx instanceof CanvasRenderingContext2D) {
      scaledImageCtx.drawImage(img, 0, 0, imgWidth, imgHeight);
    }

    const canvasWidth = imgWidth;
    const canvasHeight = imgHeight + amplitude * 2; //

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
        for (let x = 0; x < imgWidth; x++) {
          const y =
            amplitudeRatio * x * Math.sin(spatialFrequency * (x - distance)) +
            amplitude;
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
      }

      animationFrameIdRef.current = requestAnimationFrame(animateFrame);
    }

    animationFrameIdRef.current = requestAnimationFrame(animateFrame);
    requestAnimationFrame(function () {
      setShowImg(false);
    });
  }, [amplitude, frequency, fps, period, stop]);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowImg(true);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete) {
      initWavingImageDOM();
    }
  }, []);

  return (
    <div className={styles.waving_image} style={cssVariables}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className={styles['waving_image-img']}
        src={src}
        alt={alt}
        onLoad={initWavingImageDOM}
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
