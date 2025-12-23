'use client';

import { useEffect, ReactNode } from 'react';
import './index.scss';

export interface DialogModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
}

export function DialogModal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = false,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}: DialogModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose?.();
    }
  };

  const maxWidthClass = `dialog-modal-content--${maxWidth}`;
  const fullWidthClass = fullWidth ? 'dialog-modal-content--full_width' : '';

  return (
    <div className="dialog-modal" onClick={handleBackdropClick}>
      <div className="dialog-modal-backdrop" />
      <div
        className={`dialog-modal-content ${maxWidthClass} ${fullWidthClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="dialog-modal-header">
            {title && <h2 className="dialog-modal-title">{title}</h2>}
            {showCloseButton && (
              <button
                className="dialog-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="dialog-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default DialogModal;
