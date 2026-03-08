'use client';

import { useState, useRef, useCallback, useEffect, type DragEvent, type ChangeEvent } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import './index.scss';

export interface ImageUploadProps {
  value?: File;
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
  // Internal state for uncontrolled mode
  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string>('');
  const [showMask, setShowMask] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For controlled mode: track value prop changes and generate preview URL
  const [controlledPreviewUrl, setControlledPreviewUrl] = useState<string>('');
  const previousValueRef = useRef<File | undefined>(value);

  // Update controlled preview URL when value prop changes
  useEffect(() => {
    // Only process if value actually changed (reference equality check)
    if (previousValueRef.current === value) return;
    previousValueRef.current = value;

    if (value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setControlledPreviewUrl(result);
      };
      reader.readAsDataURL(value);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setControlledPreviewUrl('');
      // Reason: Syncing props to state for controlled component pattern - FileReader is async
    }
  }, [value]);

  // Use controlled preview if value prop exists, otherwise use internal state
  const isControlled = value !== undefined;
  const previewUrl = isControlled ? controlledPreviewUrl : internalPreviewUrl;

  const handleFileRead = useCallback(
    (file: File) => {
      if (!file || !file.type.startsWith('image/')) {
        onError?.('請選擇圖片檔案');
        return;
      }

      if (maxSize && file.size > maxSize) {
        onError?.(`檔案大小超過限制 (${(maxSize / 1024 / 1024).toFixed(2)}MB)`);
        return;
      }

      // For uncontrolled mode, update internal preview
      if (!isControlled) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setInternalPreviewUrl(result);
        };
        reader.readAsDataURL(file);
      }

      onChange?.(file);
    },
    [maxSize, onChange, onError, isControlled]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileRead(file);
      }
    },
    [handleFileRead]
  );

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setShowMask(true);
      }
    },
    [disabled]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMask(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowMask(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileRead(file);
      }
    },
    [disabled, handleFileRead]
  );

  const cssVariables = {
    '--image_upload-preview-bg': previewBgColor,
    '--image_upload-preview-opacity': previewUrl ? '1' : '0',
    '--image_upload-mask-opacity': showMask ? '0.8' : '0',
    '--image_upload-cursor': disabled ? 'not-allowed' : 'pointer'
  } as React.CSSProperties;

  return (
    <ButtonBase
      component="div"
      className={`image_upload-wrapper ${className}`}
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
          className="image_upload-input"
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

        <div className="image_upload-preview">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="image_upload-preview-img"
            />
          )}
        </div>

        <div className="image_upload-mask">
          <p className="image_upload-mask-text">{maskLabel}</p>
        </div>
      </div>
    </ButtonBase>
  );
}

export default ImageUpload;
