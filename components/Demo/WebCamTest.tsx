'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import style from '@/app/[locale]/web-cam/page.module.scss';

export default function WebCamTest(): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const drawFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.drawImage(video, 0, 0, video.width, video.height);
      ctx.restore();

      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    };

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 360 },
          audio: false
        });
        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            drawFrame();
          };
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to access camera'
        );
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop all tracks and cancel animation frame
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <Image
        className={style['web_cam_page-banner']}
        src="/img/icon/Next.jsLab.v.03.webp"
        alt="Web Cam Banner"
        width={1200}
        height={400}
        priority
      />

      {error && (
        <div className={style['web_cam_page-error']}>
          <p>Camera Error: {error}</p>
          <p>Please allow camera access in your browser settings.</p>
        </div>
      )}

      <video
        ref={videoRef}
        className={style['web_cam_page-video']}
        width={480}
        height={360}
        autoPlay
        playsInline
        muted
      />

      <canvas
        ref={canvasRef}
        className={style['web_cam_page-canvas']}
        width={480}
        height={360}
      />
    </>
  );
}
