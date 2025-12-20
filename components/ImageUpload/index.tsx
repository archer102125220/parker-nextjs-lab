'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import './index.scss';

export interface ImageUploadProps {
  value?: File | string;
  onChange?: (file: File) => void;
  onError?: (error: string) => void;
  btnLabel?: string;
  label?: string;
  maskLabel?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  previewBgColor?: string;
  className?: string;
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  onError,
  btnLabel = '上傳圖片',
  label = '點擊或拖拉圖片到此區塊上傳',
  maskLabel = '拖拉圖片到此區塊上傳',
  maxSize,
  disabled = false,
  previewBgColor = '#fff',
  className = '',
  accept = 'image/*'
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showMask, setShowMask] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      onError?.('請選擇圖片檔案');
      return;
    }

    if (maxSize && file.size > maxSize) {
      onError?.(`檔案大小超過限制 (${(maxSize / 1024 / 1024).toFixed(2)}MB)`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);

    onChange?.(file);
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setShowMask(true);
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMask(false);
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMask(false);
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const cssVariables = {
    '--preview_bg_color': previewBgColor,
    '--preview_opacity': previewUrl ? '1' : '0',
    '--mask_opacity': showMask ? '0.8' : '0',
    '--image_upload_cursor': disabled ? 'not-allowed' : 'pointer'
  } as React.CSSProperties;

  return (
    <ButtonBase
      component="div"
      className={`image_upload_wrapper ${className}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      disabled={disabled}
      disableRipple={disabled}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '200px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div className="image_upload" style={cssVariables}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {!previewUrl && (
          <>
            <button
              className="image_upload-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              disabled={disabled}
            >
              {btnLabel}
            </button>
            <label className="image_upload-label">{label}</label>
          </>
        )}

        <div className="image_upload_preview">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="image_upload_preview_img"
            />
          )}
        </div>

        <div className="image_upload_mask">
          <p>{maskLabel}</p>
        </div>
      </div>
    </ButtonBase>
  );
}

export default ImageUpload;
