'use client';

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  type ReactNode
} from 'react';
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
  useLayoutEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleEscape = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose?.();
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      handleEscape(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleBackdropClick = () => {
    if (!open) {
      return;
    }

    if (closeOnBackdrop) {
      onClose?.();
    }
  };

  const maxWidthClass = `dialog-modal-content--${maxWidth}`;
  const fullWidthClass = fullWidth ? 'dialog-modal-content--full_width' : '';

  return (
    <div
      className="dialog-modal"
      css-is-open={open ? 'true' : 'false'}
      aria-hidden={open ? 'false' : 'true'}
      onClick={handleBackdropClick}
    >
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
