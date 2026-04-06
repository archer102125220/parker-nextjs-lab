'use client';

import { useState, useEffect, useEffectEvent } from 'react';
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

  // useEffectEvent 讓 callbacks 不加入 useEffect deps，避免每次 callback 變更就重新生成 QR Code
  const _onBeforeCreate = useEffectEvent(() => onBeforeCreate?.());
  const _onLoading = useEffectEvent((loading: boolean) => onLoading?.(loading));
  const _onSuccess = useEffectEvent((data: { qrCodeValue: string | number; dataUrl: string }) => onSuccess?.(data));
  const _onError = useEffectEvent((error: Error) => onError?.(error));
  const _onCreated = useEffectEvent(() => onCreated?.());

  useEffect(() => {
    if (
      qrCodeValue === undefined ||
      qrCodeValue === null ||
      qrCodeValue === ''
    ) {
      return;
    }

    _onBeforeCreate();
    _onLoading(true);

    QRCode.toDataURL(String(qrCodeValue))
      .then((url) => {
        setQrCodeDataUrl(url);
        _onCreated();
        _onSuccess({ qrCodeValue, dataUrl: url });
      })
      .catch((error: Error) => {
        console.error('QRCode generation error:', error);
        _onError(error);
      })
      .finally(() => {
        _onLoading(false);
      });
  }, [qrCodeValue]);

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
    />
  );
}

export default QRCodeComponent;
