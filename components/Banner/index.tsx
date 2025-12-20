'use client';

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import './index.scss';

export interface BannerItem {
  id: string | number;
  image?: string;
  title?: string;
  description?: string;
  alt?: string;
  [key: string]: unknown;
}

export interface BannerProps {
  banners: BannerItem[];
  value?: number;
  onChange?: (index: number) => void;
  autoplay?: boolean;
  interval?: number;
  height?: string | number;
  showIndicators?: boolean;
  showNavigation?: boolean;
  transitionDuration?: number;
  className?: string;
  children?: (banner: BannerItem, index: number, isActive: boolean) => ReactNode;
}

export function Banner({
  banners = [],
  value = 0,
  onChange,
  autoplay = true,
  interval = 3000,
  height = '300px',
  showIndicators = true,
  showNavigation = true,
  transitionDuration = 300,
  className = '',
  children
}: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [moveX, setMoveX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const bannerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const has3DEffect = banners.length >= 3;

  // Calculate indices
  const getPrevIndex = useCallback(() => {
    return currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
  }, [currentIndex, banners.length]);

  const getNextIndex = useCallback(() => {
    return currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
  }, [currentIndex, banners.length]);

  // Navigation
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= banners.length) return;
    setCurrentIndex(index);
    onChange?.(index);
  }, [banners.length, onChange]);

  const handlePrev = useCallback(() => {
    goToSlide(getPrevIndex());
  }, [goToSlide, getPrevIndex]);

  const handleNext = useCallback(() => {
    goToSlide(getNextIndex());
  }, [goToSlide, getNextIndex]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || banners.length < 2 || isHovered || isFocused) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      handleNext();
    }, interval);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, banners.length, interval, isHovered, isFocused, handleNext]);

  // Drag handling
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setMoveX(0);
  }, []);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setMoveX(clientX - startX);
  }, [isDragging, startX]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 50;
    if (moveX > threshold) {
      handlePrev();
    } else if (moveX < -threshold) {
      handleNext();
    }
    
    setMoveX(0);
  }, [isDragging, moveX, handlePrev, handleNext]);

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  }, [handlePrev, handleNext]);

  // Get slide class
  const getSlideClass = (index: number) => {
    const classes = ['banner-slide'];
    
    if (index === currentIndex) {
      classes.push('banner-slide-active');
    } else if (has3DEffect) {
      if (index === getPrevIndex()) {
        classes.push('banner-slide-prev');
      } else if (index === getNextIndex()) {
        classes.push('banner-slide-next');
      } else {
        classes.push('banner-slide-hidden');
      }
    } else {
      classes.push('banner-slide-hidden');
    }
    
    return classes.join(' ');
  };

  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={bannerRef}
      className={`banner ${has3DEffect ? 'banner-3d' : ''} ${className}`}
      style={{
        '--banner-height': heightValue,
        '--banner-transition-duration': isDragging ? '0ms' : `${transitionDuration}ms`,
        '--banner-drag-offset': `${moveX}px`
      } as React.CSSProperties}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
    >
      {/* Navigation Buttons */}
      {showNavigation && banners.length > 1 && (
        <>
          <div className="banner-nav banner-nav-prev" onClick={handlePrev}>
            <div className="banner-nav-btn">‹</div>
          </div>
          <div className="banner-nav banner-nav-next" onClick={handleNext}>
            <div className="banner-nav-btn">›</div>
          </div>
        </>
      )}

      {/* Banner Track */}
      <div className="banner-wrapper">
        <div
          className="banner-track"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id || index}
              className={getSlideClass(index)}
            >
              {children ? (
                children(banner, index, index === currentIndex)
              ) : (
                <div className="banner-slide-content">
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt={banner.alt || `Banner ${index + 1}`}
                      className="banner-slide-image"
                      draggable={false}
                    />
                  )}
                  {(banner.title || banner.description) && (
                    <div className="banner-slide-text">
                      {banner.title && <h3 className="banner-slide-title">{banner.title}</h3>}
                      {banner.description && (
                        <p className="banner-slide-description">{banner.description}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      {showIndicators && banners.length > 1 && (
        <div className="banner-indicators">
          {banners.map((banner, index) => (
            <div
              key={`indicator-${banner.id || index}`}
              className={`banner-indicator ${index === currentIndex ? 'banner-indicator-active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Banner;
