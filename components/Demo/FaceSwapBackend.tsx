'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Typography,
  Button,
  Alert,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import DownloadIcon from '@mui/icons-material/Download';
import style from '@/app/[locale]/face-swap/backend/page.module.scss';

export default function DemoFaceSwapBackend(): React.ReactNode {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info');

  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (value: string | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showStatus = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const performFaceSwap = async () => {
    if (!sourceImage || !targetImage) {
      showStatus('請先上傳來源照片和目標照片', 'warning');
      return;
    }

    setIsProcessing(true);
    showStatus('正在上傳圖片並處理...', 'info');

    try {
      const response = await fetch('/api/face-swap/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceImage, targetImage })
      });

      const data = await response.json();

      if (response.ok && data.resultImage) {
        setResultImage(data.resultImage);
        showStatus('人臉替換完成！', 'success');
      } else {
        throw new Error(data.error || '處理失敗');
      }
    } catch (error) {
      console.error('Face swap error:', error);
      showStatus(
        error instanceof Error ? error.message : '人臉替換失敗',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.download = `face-swap-result-${Date.now()}.png`;
    link.href = resultImage;
    link.click();
    showStatus('圖片已下載', 'success');
  };

  return (
    <>
      <Image
        className={style['face_swap_backend_page-banner']}
        src="/img/icon/Next.jsLab.v.03.webp"
        alt="Face Swap Banner"
        width={800}
        height={200}
      />

      <Typography
        variant="h5"
        className={style['face_swap_backend_page-title']}
      >
        後端 AI 人臉替換
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        className={style['face_swap_backend_page-subtitle']}
      >
        使用 Node.js 後端 + TensorFlow.js 進行高精度人臉替換
      </Typography>

      <Alert severity="warning" sx={{ mb: 3, maxWidth: 800 }}>
        <strong>開發中：</strong>此功能需要後端 API 支援。 請確保{' '}
        <code>/api/face-swap/process</code> API 已正確配置。
      </Alert>

      <div className={style['face_swap_backend_page-upload_section']}>
        <Paper
          className={style['face_swap_backend_page-upload_section-source']}
          sx={{ p: 2 }}
        >
          <Typography variant="h6" gutterBottom align="center">
            來源臉部
          </Typography>
          <input
            type="file"
            accept="image/*"
            ref={sourceInputRef}
            onChange={(e) => handleImageSelect(e, setSourceImage)}
            className={style['face_swap_backend_page-hidden_input']}
          />
          {sourceImage ? (
            <Box sx={{ textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sourceImage}
                alt="Source"
                className={
                  style['face_swap_backend_page-upload_section-preview']
                }
              />
              <Button
                variant="outlined"
                onClick={() => sourceInputRef.current?.click()}
                sx={{ mt: 2 }}
              >
                更換照片
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: 2,
                cursor: 'pointer'
              }}
              onClick={() => sourceInputRef.current?.click()}
            >
              <CloudUploadIcon
                sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
              />
              <Typography color="text.secondary">點擊上傳來源照片</Typography>
            </Box>
          )}
        </Paper>

        <Paper
          className={style['face_swap_backend_page-upload_section-target']}
          sx={{ p: 2 }}
        >
          <Typography variant="h6" gutterBottom align="center">
            目標照片
          </Typography>
          <input
            type="file"
            accept="image/*"
            ref={targetInputRef}
            onChange={(e) => handleImageSelect(e, setTargetImage)}
            className={style['face_swap_backend_page-hidden_input']}
          />
          {targetImage ? (
            <Box sx={{ textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={targetImage}
                alt="Target"
                className={
                  style['face_swap_backend_page-upload_section-preview']
                }
              />
              <Button
                variant="outlined"
                onClick={() => targetInputRef.current?.click()}
                sx={{ mt: 2 }}
              >
                更換照片
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: 2,
                cursor: 'pointer'
              }}
              onClick={() => targetInputRef.current?.click()}
            >
              <CloudUploadIcon
                sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
              />
              <Typography color="text.secondary">點擊上傳目標照片</Typography>
            </Box>
          )}
        </Paper>
      </div>

      <div className={style['face_swap_backend_page-controls']}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={
            isProcessing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <FaceRetouchingNaturalIcon />
            )
          }
          disabled={!sourceImage || !targetImage || isProcessing}
          onClick={performFaceSwap}
        >
          {isProcessing ? '處理中...' : '執行替換'}
        </Button>

        {resultImage && (
          <Button
            variant="outlined"
            color="success"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={downloadResult}
          >
            下載結果
          </Button>
        )}
      </div>

      {statusMessage && (
        <Alert
          severity={statusType}
          sx={{ mb: 3, maxWidth: 600 }}
          onClose={() => setStatusMessage('')}
        >
          {statusMessage}
        </Alert>
      )}

      {resultImage && (
        <Paper className={style['face_swap_backend_page-result']} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom align="center">
            替換結果
          </Typography>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultImage}
            alt="Result"
            className={style['face_swap_backend_page-result-image']}
          />
        </Paper>
      )}
    </>
  );
}
