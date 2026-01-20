'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  Typography,
  Button,
  Alert,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import style from '@/app/[locale]/face-swap/frontend/page.module.scss';

export default function DemoFaceSwapFrontend(): React.ReactNode {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info');
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360 },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      showStatus(
        '無法存取相機。請確保已授予權限且使用 HTTPS/localhost。',
        'error'
      );
    }
  }, []);

  // Load face-api.js dynamically
  const loadFaceApi = useCallback(async () => {
    try {
      const faceapi = await import('face-api.js');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/ai_models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/ai_models');
      return faceapi;
    } catch (err) {
      console.error('Face API load error:', err);
      showStatus(
        '無法載入人臉辨識模型。請確保模型檔案已放置在 /public/ai_models/',
        'error'
      );
      return null;
    }
  }, []);

  // Handle source image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show status message
  const showStatus = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    setStatusMessage(message);
    setStatusType(type);
  };

  // Perform face swap
  const performFaceSwap = async () => {
    if (!sourceImage || !isCameraReady) {
      showStatus('請先上傳來源照片並確認攝影機已啟動', 'warning');
      return;
    }

    setIsSwapping(true);
    showStatus('正在載入人臉辨識模型...', 'info');

    try {
      const faceapi = await loadFaceApi();
      if (!faceapi) return;

      showStatus('正在偵測人臉...', 'info');

      if (!sourceImageRef.current) {
        throw new Error('來源圖片未載入');
      }

      const sourceDetection = await faceapi
        .detectSingleFace(sourceImageRef.current)
        .withFaceLandmarks();

      if (!sourceDetection) {
        throw new Error('無法在來源照片中偵測到人臉');
      }

      if (!videoRef.current) {
        throw new Error('攝影機未初始化');
      }

      const targetDetection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks();

      if (!targetDetection) {
        throw new Error('無法在攝影機畫面中偵測到人臉');
      }

      showStatus('正在執行人臉替換...', 'info');
      await blendFaces(sourceDetection, targetDetection);
      setHasResult(true);
      showStatus('人臉替換完成！', 'success');
    } catch (error) {
      console.error('Face swap error:', error);
      showStatus(
        error instanceof Error ? error.message : '人臉替換失敗',
        'error'
      );
    } finally {
      setIsSwapping(false);
    }
  };

  // Blend faces using canvas
  const blendFaces = async (
    sourceDetection: {
      detection: {
        box: { x: number; y: number; width: number; height: number };
      };
    },
    targetDetection: {
      detection: {
        box: { x: number; y: number; width: number; height: number };
      };
    }
  ) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const sourceImg = sourceImageRef.current;

    if (!canvas || !video || !sourceImg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const sourceBox = sourceDetection.detection.box;
    const targetBox = targetDetection.detection.box;
    const padding = 20;

    const sx = Math.max(0, sourceBox.x - padding);
    const sy = Math.max(0, sourceBox.y - padding);
    const sw = Math.min(sourceImg.width - sx, sourceBox.width + padding * 2);
    const sh = Math.min(sourceImg.height - sy, sourceBox.height + padding * 2);

    const tx = targetBox.x - padding;
    const ty = targetBox.y - padding;
    const tw = targetBox.width + padding * 2;
    const th = targetBox.height + padding * 2;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sw;
    tempCanvas.height = sh;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, sw, sh);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.beginPath();
    tempCtx.ellipse(sw / 2, sh / 2, sw / 2.2, sh / 2.2, 0, 0, Math.PI * 2);
    tempCtx.fill();

    ctx.globalAlpha = 0.85;
    ctx.drawImage(tempCanvas, 0, 0, sw, sh, tx, ty, tw, th);
    ctx.globalAlpha = 1;
  };

  const resetSwap = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasResult(false);
    setStatusMessage('');
  };

  const downloadResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `face-swap-result-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showStatus('圖片已下載', 'success');
  };

  useEffect(() => {
    initCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initCamera]);

  return (
    <>
      <Image
        className={style['face_swap_frontend_page-banner']}
        src="/img/icon/Next.jsLab.v.03.webp"
        alt="Face Swap Banner"
        width={800}
        height={200}
      />

      <Typography
        variant="h5"
        className={style['face_swap_frontend_page-title']}
      >
        純前端人臉替換
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        className={style['face_swap_frontend_page-subtitle']}
      >
        使用瀏覽器端 face-api.js 進行即時人臉替換
      </Typography>

      <Alert severity="info" sx={{ mb: 3, maxWidth: 800 }}>
        <strong>使用提示：</strong>
        為獲得最佳效果，建議來源照片的尺寸與目標畫面相近。
        如需處理不同尺寸的圖片，請使用「後端 AI 人臉替換」功能。
      </Alert>

      <div className={style['face_swap_frontend_page-swap_section']}>
        <Paper
          className={style['face_swap_frontend_page-swap_section-source']}
          sx={{ p: 2 }}
        >
          <Typography variant="h6" gutterBottom align="center">
            來源臉部
          </Typography>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className={style['face_swap_frontend_page-hidden_input']}
          />
          {sourceImage ? (
            <Box sx={{ textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={sourceImageRef}
                src={sourceImage}
                alt="Source face"
                className={style['face_swap_frontend_page-result_image']}
                crossOrigin="anonymous"
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                sx={{ mt: 2 }}
              >
                更換照片
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                height: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: 2,
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Typography color="text.secondary">點擊選取來源照片</Typography>
            </Box>
          )}
        </Paper>

        <Paper
          className={style['face_swap_frontend_page-swap_section-target']}
          sx={{ p: 2 }}
        >
          <Typography variant="h6" gutterBottom align="center">
            目標畫面
          </Typography>
          <div
            className={
              style[
                'face_swap_frontend_page-swap_section-target-video_container'
              ]
            }
          >
            <video
              ref={videoRef}
              className={
                style['face_swap_frontend_page-swap_section-target-video']
              }
              width={480}
              height={360}
              autoPlay
              muted
              playsInline
            />
            <canvas
              ref={overlayCanvasRef}
              className={
                style['face_swap_frontend_page-swap_section-target-overlay']
              }
              width={480}
              height={360}
            />
          </div>
        </Paper>

        <Paper
          className={style['face_swap_frontend_page-swap_section-result']}
          sx={{ p: 2 }}
        >
          <Typography variant="h6" gutterBottom align="center">
            替換結果
          </Typography>
          <canvas
            ref={canvasRef}
            className={
              style['face_swap_frontend_page-swap_section-result-canvas']
            }
            width={480}
            height={360}
          />
        </Paper>
      </div>

      <div className={style['face_swap_frontend_page-controls']}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={
            isSwapping ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <FaceRetouchingNaturalIcon />
            )
          }
          disabled={!sourceImage || !isCameraReady || isSwapping}
          onClick={performFaceSwap}
        >
          {isSwapping ? '處理中...' : '執行替換'}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<RefreshIcon />}
          onClick={resetSwap}
        >
          重置
        </Button>

        <Button
          variant="outlined"
          color="success"
          size="large"
          startIcon={<DownloadIcon />}
          disabled={!hasResult}
          onClick={downloadResult}
        >
          下載結果
        </Button>
      </div>

      {statusMessage && (
        <Alert
          severity={statusType}
          className={style['face_swap_frontend_page-status']}
          onClose={() => setStatusMessage('')}
        >
          {statusMessage}
        </Alert>
      )}
    </>
  );
}
