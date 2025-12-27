'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent
} from 'react';
import { classifySwipeDirection } from '@/utils/helpers/classify-swipe-direction';
import './index.scss';

// ============================================================================
// Types
// ============================================================================

export interface SwiperCustomSlide {
  id?: string | number;
  slotName?: string;
  content?: ReactNode;
  value?: string | number;
  [key: string]: unknown;
}

export interface SwiperCustomProps {
  /** Current active slide value (controlled) */
  value?: number | string | SwiperCustomSlide;
  /** Key to extract value from slide object */
  valueKey?: string;
  /** Ratio of slide width to trigger change (0-1) */
  longSwipesRatio?: number;
  /** Array of slide data */
  slideList?: SwiperCustomSlide[];
  /** Key to extract slot name from slide object */
  slotNameKey?: string;
  /** Enable vertical scroll overflow */
  overflow?: boolean;
  /** Show navigation buttons */
  hasNavigation?: boolean;
  /** Fill parent height */
  shouldFillHeight?: boolean;
  /** Additional class name */
  className?: string;
  /** Callback when slide changes */
  onChange?: (value: string | number | SwiperCustomSlide) => void;
  /** Callback during slider move */
  onSliderMove?: (
    event: MouseEvent | TouchEvent,
    value: string | number | SwiperCustomSlide,
    index: number
  ) => void;
  /** Callback when slider move ends */
  onSliderMoveEnd?: (
    value: string | number | SwiperCustomSlide,
    index: number
  ) => void;
  /** Render function for slide content */
  renderSlide?: (
    slide: SwiperCustomSlide,
    index: number,
    isSliderMoving: boolean
  ) => ReactNode;
  /** Render function for prev button */
  renderPrev?: () => ReactNode;
  /** Render function for next button */
  renderNext?: () => ReactNode;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getEventX(
  e: MouseEvent | TouchEvent | ReactMouseEvent | ReactTouchEvent
): number {
  if ('pageX' in e) return e.pageX;
  if ('clientX' in e) return e.clientX;
  if ('targetTouches' in e && e.targetTouches[0]) {
    return e.targetTouches[0].pageX || e.targetTouches[0].clientX;
  }
  if ('changedTouches' in e && e.changedTouches[0]) {
    return e.changedTouches[0].pageX || e.changedTouches[0].clientX;
  }
  return 0;
}

function getEventY(
  e: MouseEvent | TouchEvent | ReactMouseEvent | ReactTouchEvent
): number {
  if ('pageY' in e) return e.pageY;
  if ('clientY' in e) return e.clientY;
  if ('targetTouches' in e && e.targetTouches[0]) {
    return e.targetTouches[0].pageY || e.targetTouches[0].clientY;
  }
  if ('changedTouches' in e && e.changedTouches[0]) {
    return e.changedTouches[0].pageY || e.changedTouches[0].clientY;
  }
  return 0;
}

// ============================================================================
// Component
// ============================================================================

export function SwiperCustom({
  value = 0,
  valueKey,
  longSwipesRatio = 0.2,
  slideList = [],
  slotNameKey,
  overflow = false,
  hasNavigation = false,
  shouldFillHeight = false,
  className = '',
  onChange,
  onSliderMove,
  onSliderMoveEnd,
  renderSlide,
  renderPrev,
  renderNext
}: SwiperCustomProps) {
  // Refs
  const swiperRef = useRef<HTMLDivElement>(null);
  const sliderContentRef = useRef<HTMLDivElement>(null);

  // State
  const [sliderActiveIndex, setSliderActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [moveX, setMoveX] = useState<number | null>(null);
  const [isSliderMoving, setIsSliderMoving] = useState(false);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const getCurrentSwiperIndex = useCallback(
    (
      slideValue: number | string | SwiperCustomSlide,
      slides: SwiperCustomSlide[] = []
    ): number => {
      const slideIndex = slides.findIndex(
        (slide) =>
          (valueKey && slide[valueKey] === slideValue) ||
          slide.value === slideValue ||
          slide === slideValue
      );
      if (typeof slideIndex === 'number' && slideIndex > -1) {
        return slideIndex;
      }
      return typeof slideValue === 'number' ? slideValue : 0;
    },
    [valueKey]
  );

  // Update active index when value changes
  useEffect(() => {
    const swiperIndex = getCurrentSwiperIndex(value, slideList);
    setSliderActiveIndex(swiperIndex);
  }, [value, slideList, getCurrentSwiperIndex]);

  const slideXList = useMemo(() => {
    if (!Array.isArray(slideList)) return [];
    const contentWidth = sliderContentRef.current?.clientWidth || 1;
    return slideList.map((_, index) => index * contentWidth * -1);
  }, [slideList, sliderContentRef.current?.clientWidth]);

  const deltaX = useMemo(() => {
    const sliderActive = slideXList[sliderActiveIndex] ?? 0;
    if (
      typeof startX !== 'number' ||
      typeof moveX !== 'number' ||
      startX === null ||
      moveX === null
    ) {
      return sliderActive;
    }
    const delta = sliderActive + moveX - startX;
    return isNaN(delta) ? sliderActive : delta;
  }, [slideXList, sliderActiveIndex, startX, moveX]);

  // ============================================================================
  // CSS Variables
  // ============================================================================

  const cssVariables = useMemo((): CSSProperties => {
    const vars: Record<string, string> = {
      '--wrapper_transform': `translate3d(${deltaX}px, 0, 0)`
    };

    if (shouldFillHeight) {
      vars['--content_wrapper_slide_height'] = '100%';
    }

    if (overflow) {
      vars['--content_wrapper_slide_height'] = '100%';
      vars['--slide_overflow_y'] = 'auto';
      vars['--slide_overflow_x'] = 'hidden';
    }

    if (sliderContentRef.current?.clientWidth) {
      vars['--slide_width'] = `${sliderContentRef.current.clientWidth}px`;
    }

    if (!isDragging) {
      vars['--wrapper_transition_duration'] = '300ms';
    }

    return vars as CSSProperties;
  }, [deltaX, shouldFillHeight, overflow, isDragging]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleChangeStart = useCallback(
    (e: ReactMouseEvent | ReactTouchEvent) => {
      setIsDragging(true);
      setCanCancel(true);
      setStartX(getEventX(e));
      setStartY(getEventY(e));
      setMoveX(getEventX(e));
    },
    []
  );

  const handleSliderMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const eventX = getEventX(e);
      const eventY = getEventY(e);

      const result = classifySwipeDirection(
        { clientX: startX ?? 0, clientY: startY ?? 0 },
        { clientX: eventX, clientY: eventY }
      );

      const isHorizontal = result?.isHorizontal ?? false;

      // Determine if we should cancel
      if (
        !isHorizontal ||
        (moveX !== null &&
          moveX > 0 &&
          Math.abs(moveX - (startX ?? 0)) > 20)
      ) {
        setCanCancel(false);
      }

      if (!isHorizontal && canCancel) {
        setIsDragging(false);
        return;
      }

      setMoveX(eventX);
      setIsSliderMoving(true);

      if (onSliderMove) {
        const currentSlide = slideList[sliderActiveIndex];
        const currentValue = valueKey
          ? currentSlide?.[valueKey]
          : currentSlide?.value ?? currentSlide;
        onSliderMove(
          e,
          currentValue as string | number | SwiperCustomSlide,
          sliderActiveIndex
        );
      }
    },
    [
      isDragging,
      startX,
      startY,
      moveX,
      canCancel,
      onSliderMove,
      slideList,
      sliderActiveIndex,
      valueKey
    ]
  );

  const handleSlideXFindLast = useCallback(
    (slideX: number): boolean => {
      const sliderContentWidth = sliderContentRef.current?.clientWidth || 1;
      const ratio =
        typeof longSwipesRatio !== 'number' ? 0.5 : longSwipesRatio;
      const adjustedRatio = ratio >= 1 ? ratio : Math.abs(1 - ratio);

      const slideXAbs = Math.abs(slideX);
      const deltaXAbs = Math.abs(deltaX);
      const difference = Math.abs(slideXAbs - deltaXAbs);

      return (
        (deltaX >= 0 && slideX === 0) ||
        (difference >= 0 && difference <= sliderContentWidth * adjustedRatio)
      );
    },
    [deltaX, longSwipesRatio]
  );

  const handleChanging = useCallback(() => {
    setIsDragging(false);

    let newSliderActiveIndex = -1;

    if (moveX !== null && startX !== null) {
      if (moveX > startX) {
        // prev
        newSliderActiveIndex = slideXList.findIndex((slideX) =>
          handleSlideXFindLast(slideX)
        );
      } else if (moveX < startX) {
        // next
        newSliderActiveIndex = slideXList.findLastIndex((slideX) =>
          handleSlideXFindLast(slideX)
        );
      }
    }

    if (newSliderActiveIndex >= 0) {
      const newSlide = slideList[newSliderActiveIndex] ?? {};
      const newValue = valueKey
        ? newSlide[valueKey]
        : newSlide.value ?? newSlide;
      if (onChange) {
        onChange(newValue as string | number | SwiperCustomSlide);
      }
      setSliderActiveIndex(newSliderActiveIndex);
    }

    setStartX(null);
    setMoveX(null);
  }, [
    moveX,
    startX,
    slideXList,
    slideList,
    valueKey,
    onChange,
    handleSlideXFindLast
  ]);

  const resetMovingStatus = useCallback(() => {
    setIsSliderMoving(false);
  }, []);

  const handleSliderMoveEnd = useCallback(() => {
    if (onSliderMoveEnd) {
      const currentSlide = slideList[sliderActiveIndex];
      const currentValue = valueKey
        ? currentSlide?.[valueKey]
        : currentSlide?.value ?? currentSlide;
      onSliderMoveEnd(
        currentValue as string | number | SwiperCustomSlide,
        sliderActiveIndex
      );
    }
  }, [onSliderMoveEnd, slideList, sliderActiveIndex, valueKey]);

  const handlePrev = useCallback(() => {
    if (sliderActiveIndex > 0) {
      const newSliderActiveIndex = sliderActiveIndex - 1;
      const newSlide = slideList[newSliderActiveIndex] ?? {};
      const newValue = valueKey
        ? newSlide[valueKey]
        : newSlide.value ?? newSlide;
      if (onChange) {
        onChange(newValue as string | number | SwiperCustomSlide);
      }
      setSliderActiveIndex(newSliderActiveIndex);
    }
  }, [sliderActiveIndex, slideList, valueKey, onChange]);

  const handleNext = useCallback(() => {
    if (sliderActiveIndex < slideList.length - 1) {
      const newSliderActiveIndex = sliderActiveIndex + 1;
      const newSlide = slideList[newSliderActiveIndex] ?? {};
      const newValue = valueKey
        ? newSlide[valueKey]
        : newSlide.value ?? newSlide;
      if (onChange) {
        onChange(newValue as string | number | SwiperCustomSlide);
      }
      setSliderActiveIndex(newSliderActiveIndex);
    }
  }, [sliderActiveIndex, slideList, valueKey, onChange]);

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleSliderMove(e);
    const handleMouseUp = () => handleChanging();
    const handleTouchMove = (e: TouchEvent) => handleSliderMove(e);
    const handleTouchEnd = () => handleChanging();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleSliderMove, handleChanging]);

  // ============================================================================
  // Render
  // ============================================================================

  const renderSlideContent = (
    slide: SwiperCustomSlide,
    index: number
  ): ReactNode => {
    if (renderSlide) {
      return renderSlide(slide, index, isSliderMoving);
    }
    return <p>{String(slide.content ?? slide)}</p>;
  };

  return (
    <div
      ref={swiperRef}
      className={`swiper_custom ${className}`.trim()}
      style={cssVariables}
      onMouseUp={resetMovingStatus}
      onTouchEnd={resetMovingStatus}
      onTransitionEnd={handleSliderMoveEnd}
    >
      {hasNavigation && (
        <div className="swiper_custom-prev" onClick={handlePrev}>
          {renderPrev ? (
            renderPrev()
          ) : (
            <p className="swiper_custom-prev-btn">{'<'}</p>
          )}
        </div>
      )}

      {hasNavigation && (
        <div className="swiper_custom-next" onClick={handleNext}>
          {renderNext ? (
            renderNext()
          ) : (
            <p className="swiper_custom-next-btn">{'>'}</p>
          )}
        </div>
      )}

      <div ref={sliderContentRef} className="swiper_custom-content">
        <div
          className="swiper_custom-content-wrapper"
          onMouseDown={handleChangeStart}
          onTouchStart={handleChangeStart}
        >
          {slideList.map((slide, index) => (
            <div
              key={slide[slotNameKey ?? ''] ?? slide.slotName ?? index}
              className="swiper_custom-content-wrapper-slide"
            >
              <div className="swiper_custom-content-wrapper-slide-center">
                <div className="swiper_custom-content-wrapper-slide-center-middle">
                  {renderSlideContent(slide, index)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SwiperCustom;
