'use client';

import { useSelector } from 'react-redux';
import './index.scss';

export interface PWALoadingProps {
  message?: string;
  className?: string;
}

export function PWALoading({
  message = 'PWA安裝/更新中...',
  className = ''
}: PWALoadingProps) {
  // Assuming you have a Redux store with system.pwaLoading state
  // Adjust this selector based on your actual Redux store structure
  const pwaLoading = useSelector(
    (state: { system?: { pwaLoading?: boolean } }) =>
      state?.system?.pwaLoading || false
  );

  if (!pwaLoading) return null;

  return (
    <div className={`pwa_loading ${className}`}>
      <div className="pwa_loading-snackbar">
        <div className="pwa_loading-alert">
          <div className="pwa_loading-icon">
            <svg className="pwa_loading-spinner" viewBox="0 0 50 50">
              <circle
                className="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
              />
            </svg>
          </div>
          <p className="pwa_loading-message">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default PWALoading;
