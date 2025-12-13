'use client';

import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

export interface QRCodeProps {
  qrCodeValue: string | number;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  onBeforeCreate?: () => void;
  onLoading?: (loading: boolean) => void;
  onSuccess?: (data: { qrCodeValue: string | number; dataUrl: string }) => void;
  onError?: (error: Error) => void;
  onCreated?: () => void;
}

export function QRCodeComponent({
  qrCodeValue,
  alt,
  width = 200,
  height = 200,
  className = '',
  onBeforeCreate,
  onLoading,
  onSuccess,
  onError,
  onCreated
}: QRCodeProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const handleQRCode = useCallback(
    async (_qrCodeValue: string | number) => {
      if (
        _qrCodeValue === undefined ||
        _qrCodeValue === null ||
        _qrCodeValue === ''
      ) {
        return;
      }

      onBeforeCreate?.();
      onLoading?.(true);

      try {
        const url = await QRCode.toDataURL(String(_qrCodeValue));
        setQrCodeDataUrl(url);
        onCreated?.();
        onSuccess?.({ qrCodeValue: _qrCodeValue, dataUrl: url });
      } catch (error) {
        console.error('QRCode generation error:', error);
        onError?.(error as Error);
      } finally {
        onLoading?.(false);
      }
    },
    [onBeforeCreate, onLoading, onSuccess, onError, onCreated]
  );

  useEffect(() => {
    handleQRCode(qrCodeValue);
  }, [qrCodeValue, handleQRCode]);

  if (!qrCodeDataUrl) {
    return null;
  }

  return (
    <img
      src={qrCodeDataUrl}
      alt={alt || String(qrCodeValue)}
      width={width}
      height={height}
      className={`qr-code ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
}

export default QRCodeComponent;
