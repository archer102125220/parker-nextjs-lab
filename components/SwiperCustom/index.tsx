'use client';

import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent
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
  // Type assertions needed because 'in' operator doesn't narrow union types properly
  if ('pageX' in e && typeof (e as MouseEvent).pageX === 'number') {
    return (e as MouseEvent).pageX;
  }
  if ('clientX' in e && typeof (e as MouseEvent).clientX === 'number') {
    return (e as MouseEvent).clientX;
  }
  if ('targetTouches' in e) {
    const touch = (e as TouchEvent).targetTouches[0];
    if (touch) return touch.pageX || touch.clientX;
  }
  if ('changedTouches' in e) {
    const touch = (e as TouchEvent).changedTouches[0];
    if (touch) return touch.pageX || touch.clientX;
  }
  return 0;
}

function getEventY(
  e: MouseEvent | TouchEvent | ReactMouseEvent | ReactTouchEvent
): number {
  // Type assertions needed because 'in' operator doesn't narrow union types properly
  if ('pageY' in e && typeof (e as MouseEvent).pageY === 'number') {
    return (e as MouseEvent).pageY;
  }
  if ('clientY' in e && typeof (e as MouseEvent).clientY === 'number') {
    return (e as MouseEvent).clientY;
  }
  if ('targetTouches' in e) {
    const touch = (e as TouchEvent).targetTouches[0];
    if (touch) return touch.pageY || touch.clientY;
  }
  if ('changedTouches' in e) {
    const touch = (e as TouchEvent).changedTouches[0];
    if (touch) return touch.pageY || touch.clientY;
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
  // DOM Refs
  const swiperRef = useRef<HTMLDivElement>(null);
  const sliderContentRef = useRef<HTMLDivElement>(null);

  // State for rendering
  const [sliderActiveIndex, setSliderActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const [currentDeltaX, setCurrentDeltaX] = useState(0);
  const [contentWidth, setContentWidth] = useState(1);

  // Refs for event handler values (to avoid stale closures)
  const isDraggingRef = useRef(false);
  const canCancelRef = useRef(false);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const moveXRef = useRef<number | null>(null);
  const sliderActiveIndexRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => {
    sliderActiveIndexRef.current = sliderActiveIndex;
  }, [sliderActiveIndex]);

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
  useLayoutEffect(() => {
    const swiperIndex = getCurrentSwiperIndex(value, slideList);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSliderActiveIndex(swiperIndex);
    sliderActiveIndexRef.current = swiperIndex;
  }, [value, slideList, getCurrentSwiperIndex]);

  // Update content width from ref (only in effects, not during render)
  useEffect(() => {
    const updateWidth = () => {
      const width = sliderContentRef.current?.clientWidth || 1;
      setContentWidth(width);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Get content width for calculations (returns state value, not ref)
  const getContentWidth = useCallback(() => {
    return contentWidth;
  }, [contentWidth]);

  // Calculate slide X positions
  const getSlideXList = useCallback(() => {
    if (!Array.isArray(slideList)) return [];
    return slideList.map((_, index) => index * contentWidth * -1);
  }, [slideList, contentWidth]);

  // Calculate current deltaX based on dragging state
  const calculateDeltaX = useCallback(() => {
    const slideXList = getSlideXList();
    const sliderActive = slideXList[sliderActiveIndexRef.current] ?? 0;
    const startX = startXRef.current;
    const moveX = moveXRef.current;

    if (typeof startX !== 'number' || typeof moveX !== 'number') {
      return sliderActive;
    }
    const delta = sliderActive + moveX - startX;
    return isNaN(delta) ? sliderActive : delta;
  }, [getSlideXList]);

  // ============================================================================
  // CSS Variables
  // ============================================================================

  const cssVariables = useMemo((): CSSProperties => {
    const slideXList = getSlideXList();
    const sliderActive = slideXList[sliderActiveIndex] ?? 0;
    const transformX = isDragging ? currentDeltaX : sliderActive;

    const vars: Record<string, string> = {
      '--wrapper_transform': `translate3d(${transformX}px, 0, 0)`
    };

    if (shouldFillHeight) {
      vars['--content_wrapper_slide_height'] = '100%';
    }

    if (overflow) {
      vars['--content_wrapper_slide_height'] = '100%';
      vars['--slide_overflow_y'] = 'auto';
      vars['--slide_overflow_x'] = 'hidden';
    }

    const contentWidth = getContentWidth();
    if (contentWidth > 1) {
      vars['--slide_width'] = `${contentWidth}px`;
    }

    if (!isDragging) {
      vars['--wrapper_transition_duration'] = '300ms';
    } else {
      vars['--wrapper_transition_duration'] = '0ms';
    }

    return vars as CSSProperties;
  }, [
    sliderActiveIndex,
    isDragging,
    currentDeltaX,
    shouldFillHeight,
    overflow,
    getSlideXList,
    getContentWidth
  ]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleChangeStart = useCallback(
    (e: ReactMouseEvent | ReactTouchEvent) => {
      isDraggingRef.current = true;
      canCancelRef.current = true;
      startXRef.current = getEventX(e);
      startYRef.current = getEventY(e);
      moveXRef.current = getEventX(e);

      setIsDragging(true);
      setCurrentDeltaX(calculateDeltaX());
    },
    [calculateDeltaX]
  );

  // Handle slide movement during drag
  useEffect(() => {
    const handleSliderMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;

      const eventX = getEventX(e);
      const eventY = getEventY(e);

      const result = classifySwipeDirection(
        { clientX: startXRef.current ?? 0, clientY: startYRef.current ?? 0 },
        { clientX: eventX, clientY: eventY }
      );

      const isHorizontal = result?.isHorizontal ?? false;

      // Determine if we should cancel
      if (
        !isHorizontal ||
        (moveXRef.current !== null &&
          moveXRef.current > 0 &&
          Math.abs(moveXRef.current - (startXRef.current ?? 0)) > 20)
      ) {
        canCancelRef.current = false;
      }

      if (!isHorizontal && canCancelRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        return;
      }

      moveXRef.current = eventX;
      setIsSliderMoving(true);

      // Calculate and update deltaX for rendering
      const newDeltaX = calculateDeltaX();
      setCurrentDeltaX(newDeltaX);

      if (onSliderMove) {
        const currentSlide = slideList[sliderActiveIndexRef.current];
        const currentValue = valueKey
          ? currentSlide?.[valueKey]
          : (currentSlide?.value ?? currentSlide);
        onSliderMove(
          e,
          currentValue as string | number | SwiperCustomSlide,
          sliderActiveIndexRef.current
        );
      }
    };

    const handleChanging = () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      setIsDragging(false);

      const slideXList = getSlideXList();
      const contentWidth = getContentWidth();
      const currentDelta = calculateDeltaX();
      const ratio = typeof longSwipesRatio !== 'number' ? 0.5 : longSwipesRatio;
      const adjustedRatio = ratio >= 1 ? ratio : Math.abs(1 - ratio);

      const handleSlideXFindLast = (slideX: number): boolean => {
        const slideXAbs = Math.abs(slideX);
        const deltaXAbs = Math.abs(currentDelta);
        const difference = Math.abs(slideXAbs - deltaXAbs);

        return (
          (currentDelta >= 0 && slideX === 0) ||
          (difference >= 0 && difference <= contentWidth * adjustedRatio)
        );
      };

      let newSliderActiveIndex = -1;
      const moveX = moveXRef.current;
      const startX = startXRef.current;

      if (moveX !== null && startX !== null) {
        if (moveX > startX) {
          // prev (dragging right)
          newSliderActiveIndex = slideXList.findIndex((slideX) =>
            handleSlideXFindLast(slideX)
          );
        } else if (moveX < startX) {
          // next (dragging left)
          newSliderActiveIndex = slideXList.findLastIndex((slideX) =>
            handleSlideXFindLast(slideX)
          );
        }
      }

      if (newSliderActiveIndex >= 0) {
        const newSlide = slideList[newSliderActiveIndex] ?? {};
        const newValue = valueKey
          ? newSlide[valueKey]
          : (newSlide.value ?? newSlide);
        if (onChange) {
          onChange(newValue as string | number | SwiperCustomSlide);
        }
        setSliderActiveIndex(newSliderActiveIndex);
        sliderActiveIndexRef.current = newSliderActiveIndex;
      }

      startXRef.current = null;
      moveXRef.current = null;
    };

    document.addEventListener('mousemove', handleSliderMove);
    document.addEventListener('mouseup', handleChanging);
    document.addEventListener('touchmove', handleSliderMove);
    document.addEventListener('touchend', handleChanging);

    return () => {
      document.removeEventListener('mousemove', handleSliderMove);
      document.removeEventListener('mouseup', handleChanging);
      document.removeEventListener('touchmove', handleSliderMove);
      document.removeEventListener('touchend', handleChanging);
    };
  }, [
    slideList,
    valueKey,
    longSwipesRatio,
    onChange,
    onSliderMove,
    calculateDeltaX,
    getSlideXList,
    getContentWidth
  ]);

  const resetMovingStatus = useCallback(() => {
    setIsSliderMoving(false);
  }, []);

  const handleSliderMoveEnd = useCallback(() => {
    if (onSliderMoveEnd) {
      const currentSlide = slideList[sliderActiveIndex];
      const currentValue = valueKey
        ? currentSlide?.[valueKey]
        : (currentSlide?.value ?? currentSlide);
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
        : (newSlide.value ?? newSlide);
      if (onChange) {
        onChange(newValue as string | number | SwiperCustomSlide);
      }
      setSliderActiveIndex(newSliderActiveIndex);
      sliderActiveIndexRef.current = newSliderActiveIndex;
    }
  }, [sliderActiveIndex, slideList, valueKey, onChange]);

  const handleNext = useCallback(() => {
    if (sliderActiveIndex < slideList.length - 1) {
      const newSliderActiveIndex = sliderActiveIndex + 1;
      const newSlide = slideList[newSliderActiveIndex] ?? {};
      const newValue = valueKey
        ? newSlide[valueKey]
        : (newSlide.value ?? newSlide);
      if (onChange) {
        onChange(newValue as string | number | SwiperCustomSlide);
      }
      setSliderActiveIndex(newSliderActiveIndex);
      sliderActiveIndexRef.current = newSliderActiveIndex;
    }
  }, [sliderActiveIndex, slideList, valueKey, onChange]);

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
          {slideList.map((slide, index) => {
            const slotKey = slotNameKey ? slide[slotNameKey] : undefined;
            const keyValue =
              typeof slotKey === 'string' || typeof slotKey === 'number'
                ? slotKey
                : typeof slide.slotName === 'string' ||
                    typeof slide.slotName === 'number'
                  ? slide.slotName
                  : index;
            return (
              <div
                key={keyValue}
                className="swiper_custom-content-wrapper-slide"
              >
                <div className="swiper_custom-content-wrapper-slide-center">
                  <div className="swiper_custom-content-wrapper-slide-center-middle">
                    {renderSlideContent(slide, index)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SwiperCustom;
