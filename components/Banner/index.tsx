'use client';

import {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode
} from 'react';
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
  children?: (
    banner: BannerItem,
    index: number,
    isActive: boolean
  ) => ReactNode;
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
  // ✅ FIXED: Use useReducer for 5 related banner states
  type BannerState = {
    currentIndex: number;
    isDragging: boolean;
    moveX: number;
    isHovered: boolean;
    isFocused: boolean;
  };

  type BannerAction =
    | { type: 'SET_INDEX'; payload: number }
    | { type: 'START_DRAG'; payload: number }
    | { type: 'UPDATE_DRAG'; payload: number }
    | { type: 'END_DRAG' }
    | { type: 'SET_HOVERED'; payload: boolean }
    | { type: 'SET_FOCUSED'; payload: boolean };

  const bannerReducer = (state: BannerState, action: BannerAction): BannerState => {
    switch (action.type) {
      case 'SET_INDEX':
        return { ...state, currentIndex: action.payload };
      case 'START_DRAG':
        return { ...state, isDragging: true, moveX: 0 };
      case 'UPDATE_DRAG':
        return { ...state, moveX: action.payload };
      case 'END_DRAG':
        return { ...state, isDragging: false, moveX: 0 };
      case 'SET_HOVERED':
        return { ...state, isHovered: action.payload };
      case 'SET_FOCUSED':
        return { ...state, isFocused: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(bannerReducer, {
    currentIndex: value,
    isDragging: false,
    moveX: 0,
    isHovered: false,
    isFocused: false
  });

  const startXRef = useRef(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ FIXED: Use useMemo for expensive calculation
  const has3DEffect = useMemo(() => banners.length >= 3, [banners.length]);

  // Calculate indices
  const getPrevIndex = useCallback(() => {
    return state.currentIndex === 0 ? banners.length - 1 : state.currentIndex - 1;
  }, [state.currentIndex, banners.length]);

  const getNextIndex = useCallback(() => {
    return state.currentIndex === banners.length - 1 ? 0 : state.currentIndex + 1;
  }, [state.currentIndex, banners.length]);

  // Navigation
  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= banners.length) return;
      dispatch({ type: 'SET_INDEX', payload: index });
      onChange?.(index);
    },
    [banners.length, onChange]
  );

  const handlePrev = useCallback(() => {
    goToSlide(getPrevIndex());
  }, [goToSlide, getPrevIndex]);

  const handleNext = useCallback(() => {
    goToSlide(getNextIndex());
  }, [goToSlide, getNextIndex]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || banners.length < 2 || state.isHovered || state.isFocused) {
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
  }, [autoplay, banners.length, interval, state.isHovered, state.isFocused, handleNext]);

  // Drag handling
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      dispatch({ type: 'START_DRAG', payload: 0 });
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      startXRef.current = clientX;
    },
    []
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!state.isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      dispatch({ type: 'UPDATE_DRAG', payload: clientX - startXRef.current });
    },
    [state.isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!state.isDragging) return;

    const threshold = 50;
    if (state.moveX > threshold) {
      handlePrev();
    } else if (state.moveX < -threshold) {
      handleNext();
    }

    dispatch({ type: 'END_DRAG' });
  }, [state.isDragging, state.moveX, handlePrev, handleNext]);

  // Event listeners
  useEffect(() => {
    if (state.isDragging) {
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
  }, [state.isDragging, handleDragMove, handleDragEnd]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  // Get slide state
  const getSlideState = (index: number): string => {
    if (index === state.currentIndex) return 'active';
    if (has3DEffect) {
      if (index === getPrevIndex()) return 'prev';
      if (index === getNextIndex()) return 'next';
    }
    return 'hidden';
  };

  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={bannerRef}
      className={`banner ${className}`}
      css-has-3d={has3DEffect ? 'true' : 'false'}
      style={
        {
          '--banner-height': heightValue,
          '--banner-transition-duration': state.isDragging
            ? '0ms'
            : `${transitionDuration}ms`,
          '--banner-drag-offset': `${state.moveX}px`
        } as React.CSSProperties
      }
      tabIndex={0}
      onMouseEnter={() => dispatch({ type: 'SET_HOVERED', payload: true })}
      onMouseLeave={() => dispatch({ type: 'SET_HOVERED', payload: false })}
      onFocus={() => dispatch({ type: 'SET_FOCUSED', payload: true })}
      onBlur={() => dispatch({ type: 'SET_FOCUSED', payload: false })}
      onKeyDown={handleKeyDown}
    >
      {/* Navigation Buttons */}
      {showNavigation && banners.length > 1 && (
        <>
          <div className="banner-nav" css-position="prev" onClick={handlePrev}>
            <div className="banner-nav-btn">‹</div>
          </div>
          <div className="banner-nav" css-position="next" onClick={handleNext}>
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
              className="banner-slide"
              css-state={getSlideState(index)}
            >
              {children ? (
                children(banner, index, index === state.currentIndex)
              ) : (
                <div className="banner-slide-content">
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt={banner.alt || `Banner ${index + 1}`}
                      className="banner-slide-content-image"
                      draggable={false}
                    />
                  )}
                  {(banner.title || banner.description) && (
                    <div className="banner-slide-content-text">
                      {banner.title && (
                        <h3 className="banner-slide-content-text-title">
                          {banner.title}
                        </h3>
                      )}
                      {banner.description && (
                        <p className="banner-slide-content-text-description">
                          {banner.description}
                        </p>
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
              className="banner-indicators-item"
              css-is-active={index === state.currentIndex ? 'true' : 'false'}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Banner;
