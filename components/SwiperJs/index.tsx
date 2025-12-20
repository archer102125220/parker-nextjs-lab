'use client';
/**
 * @deprecated This component was created as a workaround during a period when 
 * Swiper's official React components were believed to be unmaintained.
 * 
 * **Status**: Swiper React is now actively maintained (v12.0.3, Oct 2025)
 * **Recommendation**: Use official `swiper/react` components instead
 * **Migration**: See TabsContent component for example of official implementation
 * 
 * This wrapper will be kept for backward compatibility but should not be used
 * for new features. It has known issues with React's reconciliation that cause
 * performance problems and rendering bugs.
 * 
 * Created: During Swiper React maintenance uncertainty period
 * Deprecated: 2025-12-20
 */
import type { ReactNode, ElementType, CSSProperties } from 'react';
import React from 'react';

// Import Swiper and modules
import type { SwiperOptions } from 'swiper/types';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import style from '@/components/SwiperJs/swiper_js.module.scss';

// Type definitions
export type swiperEvent = (swiper: Swiper) => void;
export type swiperChange = (
  slideValue: number | string | object,
  activeIndex?: number
) => void;
export type swiperElementEvent = (
  swiper: Swiper,
  event: MouseEvent | TouchEvent | PointerEvent
) => void;
export type SlideProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  index: number;
  isSliderMoveing: boolean;
};

interface swiperJsPropsType {
  nonce?: string;

  // render相關參數
  className?: string;
  renderPrevBtn?: ElementType;
  renderNextBtn?: ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slideList: Array<any>;
  valueKey?: string | number;
  renderSlideTop?: ElementType;
  renderSlideLeft?: ElementType;
  renderSlideMiddleTop?: ElementType;
  renderSlide?: ElementType;
  renderSlideMiddleBottom?: ElementType;
  renderSlideRight?: ElementType;
  renderSlideBottom?: ElementType;

  // css變數相關參數
  overflow?: boolean;
  shouldFillHeight?: boolean;
  swiperHeight?: string;

  // 原生Swiper.js相關參數
  centeredSlides?: boolean | undefined;
  slidesPerView?: number | 'auto' | undefined;
  spaceBetween?: string | number | undefined;
  longSwipesRatio?: number;
  loop?: boolean;
  autoplayDelay?: number | null;
  autoplayDisableOnInteraction?: boolean | undefined;
  paginationClickable?: boolean | undefined;
  dynamicBullets?: boolean | undefined;

  // 與原生Swiper.js磨合相關參數;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: number | string | { [key: string | number | symbol]: any };
  hasNavigation?: boolean | null;
  hasPagination?: boolean | null;
  hasScrollbar?: boolean | null;

  // 原生Swiper.js相關事件參數
  change: swiperChange;
  beforeInit?: swiperEvent;
  init?: swiperEvent;
  afterInit?: swiperEvent;
  beforeDestroy?: swiperEvent;
  destroy?: swiperEvent;
  beforeSlideChangeStart?: swiperEvent;
  slideChange?: swiperEvent;
  slideChangeTransitionEnd?: swiperEvent;
  sliderMove?: swiperEvent;
  reachBeginning?: swiperEvent;
  reachEnd?: swiperEvent;
  fromEdge?: swiperEvent;
  activeIndexChange?: swiperEvent;
  beforeTransitionStart?: swiperEvent;
  realIndexChange?: swiperEvent;
  touchEnd?: swiperElementEvent;
}

export type swiperValue = swiperJsPropsType['value'];

interface SwiperJsCssVariableType extends CSSProperties {
  '--slide_height'?: string;
  '--content_wrapper_slide_height'?: string;
  '--slide_overflow_y'?: string;
  '--slide_overflow_x'?: string;
  '--slide_display'?: string;
  '--slide_flex_direction'?: string;
  '--center_flex'?: number;
}

interface SwiperDivElement extends HTMLDivElement {
  swiper?: Swiper;
}

interface SwiperJsState {
  clientNonce: string;
}

/**
 * SwiperJs Class Component
 * 使用 Class Component 來精確控制更新，避免 Hooks 的無限循環問題
 * 移除 debounce 以實現立即的狀態更新
 */
export class SwiperJs extends React.Component<swiperJsPropsType, SwiperJsState> {
  // Refs
  private swiperJsRootRef = React.createRef<HTMLDivElement>();
  private prevRef = React.createRef<HTMLDivElement>();
  private nextRef = React.createRef<HTMLDivElement>();
  private swiperRef = React.createRef<SwiperDivElement>();
  private paginationRef = React.createRef<HTMLDivElement>();
  private scrollbarRef = React.createRef<HTMLDivElement>();

  // Instance variables
  private swiper: Swiper | null = null;
  private swiperParams: SwiperOptions | null = null;
  private isSliderMoveing = false; // Use instance variable instead of state to avoid re-renders

  constructor(props: swiperJsPropsType) {
    super(props);
    
    this.state = {
      clientNonce: ''
    };
  }

  // ==================== Lifecycle Methods ====================

  componentDidMount() {
    console.log('[SwiperJs Class] componentDidMount');
    
    // Set client nonce
    this.setState({
      clientNonce: this.props.nonce || `swiper-${Date.now()}-${Math.random()}`
    });

    // Initialize Swiper
    this.initSwiper();

    // Setup window event listeners for slider moving state
    window.addEventListener('mouseup', this.resetMoveingStatus, { passive: true });
    window.addEventListener('touchend', this.resetMoveingStatus, { passive: true });
  }

  shouldComponentUpdate(nextProps: swiperJsPropsType, nextState: SwiperJsState): boolean {
    console.log('[SwiperJs shouldComponentUpdate]', {
      valueChanged: nextProps.value !== this.props.value,
      prevValue: this.props.value,
      nextValue: nextProps.value,
      slideListChanged: nextProps.slideList !== this.props.slideList,
      stateChanged: nextState !== this.state
    });

    // Handle value changes - sync slide AND re-render
    if (nextProps.value !== this.props.value) {
      console.log('[SwiperJs] Value changed from', this.props.value, 'to', nextProps.value);
      this.syncSlide(nextProps.value);
      return true; // MUST re-render for child components
    }

    // Re-render if slideList changes
    if (nextProps.slideList !== this.props.slideList) {
      return true;
    }

    // Re-render if configuration changes
    if (
      nextProps.loop !== this.props.loop ||
      nextProps.slidesPerView !== this.props.slidesPerView ||
      nextProps.spaceBetween !== this.props.spaceBetween ||
      nextProps.centeredSlides !== this.props.centeredSlides ||
      nextProps.hasNavigation !== this.props.hasNavigation ||
      nextProps.hasPagination !== this.props.hasPagination ||
      nextProps.hasScrollbar !== this.props.hasScrollbar
    ) {
      return true;
    }

    // Re-render if state changes
    if (nextState !== this.state) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps: swiperJsPropsType) {
    // Update Swiper if slideList changed
    if (this.props.slideList !== prevProps.slideList) {
      this.updateSlideList();
    }

    // Update Swiper configuration if needed
    if (
      this.props.loop !== prevProps.loop ||
      this.props.slidesPerView !== prevProps.slidesPerView ||
      this.props.spaceBetween !== prevProps.spaceBetween
    ) {
      this.updateSwiperConfig();
    }
  }

  componentWillUnmount() {
    console.log('[SwiperJs Class] componentWillUnmount');
    
    // Cleanup
    this.destroySwiper();
    
    // Remove event listeners
    window.removeEventListener('mouseup', this.resetMoveingStatus);
    window.removeEventListener('touchend', this.resetMoveingStatus);
  }

  // ==================== Swiper Management Methods ====================

  private initSwiper() {
    console.log('[SwiperJs Class] Initializing Swiper');
    
    if (!this.swiperRef.current) {
      return;
    }

    const { 
      loop, centeredSlides, slidesPerView, spaceBetween, longSwipesRatio,
      autoplayDelay, autoplayDisableOnInteraction,
      hasNavigation, hasPagination, hasScrollbar,
      paginationClickable, dynamicBullets,
      beforeInit, init, afterInit
    } = this.props;

    const params: SwiperOptions = {
      modules: [],
      loop,
      centeredSlides,
      slidesPerView,
      spaceBetween,
      longSwipesRatio,
      on: {
        slideChange: this.handleSlideChange,
        sliderMove: this.handleSliderMove,
        slideChangeTransitionEnd: this.handleSlideChangeTransitionEnd
      }
    };

    // Add navigation
    if (hasNavigation) {
      params.modules = [...(params.modules || []), Navigation];
      params.navigation = {
        nextEl: this.nextRef.current,
        prevEl: this.prevRef.current
      };
    }

    // Add pagination
    if (hasPagination) {
      params.modules = [...(params.modules || []), Pagination];
      params.pagination = {
        el: this.paginationRef.current,
        clickable: paginationClickable,
        dynamicBullets
      };
    }

    // Add scrollbar
    if (hasScrollbar) {
      params.modules = [...(params.modules || []), Scrollbar];
      params.scrollbar = {
        el: this.scrollbarRef.current,
        draggable: true
      };
    }

    // Add autoplay
    if (autoplayDelay !== null && autoplayDelay !== undefined && autoplayDelay > 0) {
      params.modules = [...(params.modules || []), Autoplay];
      params.autoplay = {
        delay: autoplayDelay,
        disableOnInteraction: autoplayDisableOnInteraction
      };
    }

    // Call beforeInit
    if (typeof beforeInit === 'function') {
      beforeInit(this.swiperRef.current.swiper!);
    }

    // Initialize Swiper
    this.swiper = new Swiper(this.swiperRef.current, params);
    this.swiperParams = params;

    // Call init
    if (typeof init === 'function') {
      init(this.swiper);
    }

    // Sync to initial value
    this.syncSlide(this.props.value);

    // Call afterInit
    if (typeof afterInit === 'function') {
      afterInit(this.swiper);
    }

    console.log('[SwiperJs Class] Swiper initialized');
  }

  private syncSlide(value: number | string | object) {
    if (!this.swiper) return;

    const { slideList, valueKey, loop } = this.props;

    if (!Array.isArray(slideList) || slideList.length === 0) return;
    if (this.swiper.animating) return;

    // Find target index
    const targetIndex = slideList.findIndex((slide) => {
      const slideValue = slide?.[valueKey as string] ?? slide?.value;
      if (loop) {
        return `${slideValue}` === `${value}`;
      }
      return slideValue === value;
    });

    const finalIndex = targetIndex >= 0 ? targetIndex : (typeof value === 'number' ? value : 0);

    // Only slide if we're not already at the correct index
    if (finalIndex !== this.swiper.realIndex) {
      if (loop) {
        this.swiper.slideToLoop(finalIndex, 300);
      } else {
        this.swiper.slideTo(finalIndex, 300);
      }
    }
  }

  private updateSlideList() {
    if (!this.swiper) return;
    
    this.swiper.update();
    this.swiper.updateSize();
    this.swiper.updateSlides();
    this.syncSlide(this.props.value);
  }

  private updateSwiperConfig() {
    if (!this.swiper || !this.swiperParams) return;

    const { loop, centeredSlides, slidesPerView, spaceBetween, longSwipesRatio } = this.props;

    const newParams: SwiperOptions = {
      ...this.swiperParams,
      loop,
      centeredSlides,
      slidesPerView,
      spaceBetween,
      longSwipesRatio
    };

    this.swiperParams = newParams;
    this.swiper.update();
  }

  private destroySwiper() {
    if (!this.swiper) return;

    const { beforeDestroy, destroy } = this.props;

    if (typeof beforeDestroy === 'function') {
      beforeDestroy(this.swiper);
    }

    this.swiper.destroy(true, true);

    if (typeof destroy === 'function') {
      destroy(this.swiper);
    }

    this.swiper = null;
  }

  // ==================== Event Handlers ====================

  private handleSlideChange = (swiper: Swiper) => {
    console.log('[SwiperJs handleSlideChange]', {
      realIndex: swiper.realIndex,
      activeIndex: swiper.activeIndex,
      slidesLength: this.props.slideList.length
    });

    const { change, slideList, valueKey, loop, slideChange } = this.props;

    // Get slide value
    let slideValue: number | string | object;
    
    if (loop) {
      const slideValueEl = swiper.slides[swiper.activeIndex];
      slideValue = slideValueEl?.getAttribute('swiper-loop-value') || '';
    } else {
      const slideData = slideList[swiper.realIndex];
      slideValue = slideData?.[valueKey as string] || slideData?.value || swiper.realIndex;
    }

    console.log('[SwiperJs handleSlideChange] Calling onChange with:', slideValue);

    // Call onChange immediately (no debounce)
    if (typeof change === 'function') {
      const finalValue = isNaN(Number(slideValue)) ? slideValue : Number(slideValue);
      change(finalValue, swiper.activeIndex);
      console.log('[SwiperJs handleSlideChange] onChange called with:', finalValue);
    }

    // Call slideChange event
    if (typeof slideChange === 'function') {
      slideChange(swiper);
    }
  };

  private handleSliderMove = (swiper: Swiper) => {
    const { sliderMove } = this.props;
    
    if (typeof sliderMove === 'function') {
      sliderMove(swiper);
    }
    
    this.isSliderMoveing = true; // No setState, no re-render
  };

  private handleSlideChangeTransitionEnd = (swiper: Swiper) => {
    const { slideChangeTransitionEnd } = this.props;
    
    if (typeof slideChangeTransitionEnd === 'function') {
      slideChangeTransitionEnd(swiper);
    }
  };

  private resetMoveingStatus = () => {
    this.isSliderMoveing = false; // No setState, no re-render
  };

  // ==================== Render Methods ====================

  private getCssVariable(): SwiperJsCssVariableType {
    const { overflow, shouldFillHeight, swiperHeight } = this.props;
    
    const cssVariable: SwiperJsCssVariableType = {};

    if (overflow === true) {
      cssVariable['--slide_overflow_y'] = 'auto';
      cssVariable['--slide_overflow_x'] = 'hidden';
    } else {
      cssVariable['--slide_overflow_y'] = 'hidden';
      cssVariable['--slide_overflow_x'] = 'hidden';
    }

    if (shouldFillHeight === true) {
      cssVariable['--slide_display'] = 'flex';
      cssVariable['--slide_flex_direction'] = 'column';
      cssVariable['--center_flex'] = 1;
    }

    if (swiperHeight) {
      cssVariable['--slide_height'] = swiperHeight;
      cssVariable['--content_wrapper_slide_height'] = swiperHeight;
    }

    return cssVariable;
  }

  render(): ReactNode {
    const {
      className,
      slideList,
      valueKey,
      loop,
      renderPrevBtn: RenderPrevBtn,
      renderNextBtn: RenderNextBtn,
      renderSlideTop: RenderSlideTop,
      renderSlideLeft: RenderSlideLeft,
      renderSlideMiddleTop: RenderSlideMiddleTop,
      renderSlide: RenderSlide,
      renderSlideMiddleBottom: RenderSlideMiddleBottom,
      renderSlideRight: RenderSlideRight,
      renderSlideBottom: RenderSlideBottom,
      hasNavigation,
      hasPagination,
      hasScrollbar
    } = this.props;

    const { clientNonce } = this.state;
    const { isSliderMoveing } = this; // Use instance variable
    const cssVariable = this.getCssVariable();

    return (
      <div
        ref={this.swiperJsRootRef}
        className={`${style.swiper_js_root} ${className}`}
        style={cssVariable}
        nonce={clientNonce}
      >
        {/* Navigation Buttons */}
        {hasNavigation && RenderPrevBtn && (
          <div ref={this.prevRef} className={style.swiper_js_prev_btn}>
            <RenderPrevBtn />
          </div>
        )}
        {hasNavigation && RenderNextBtn && (
          <div ref={this.nextRef} className={style.swiper_js_next_btn}>
            <RenderNextBtn />
          </div>
        )}

        {/* Swiper Container */}
        <div ref={this.swiperRef} className="swiper">
          <div className="swiper-wrapper">
            {slideList.map((item, index) => {
              const slideValue = item?.[valueKey as string] || item?.value || index;
              
              return (
                <div
                  key={loop ? `${slideValue}-${index}` : slideValue}
                  className="swiper-slide"
                  swiper-loop-value={loop ? String(slideValue) : undefined}
                >
                  {RenderSlideTop && <RenderSlideTop item={item} index={index} isSliderMoveing={isSliderMoveing} />}
                  
                  <div className={style.slide_content_wrapper}>
                    {RenderSlideLeft && <RenderSlideLeft item={item} index={index} isSliderMoveing={isSliderMoveing} />}
                    
                    <div className={style.slide_content_middle}>
                      {RenderSlideMiddleTop && <RenderSlideMiddleTop item={item} index={index} isSliderMoveing={isSliderMoveing} />}
                      
                      {RenderSlide && (
                        <div className={style.slide_content_center}>
                          <RenderSlide item={item} index={index} isSliderMoveing={isSliderMoveing} />
                        </div>
                      )}
                      
                      {RenderSlideMiddleBottom && <RenderSlideMiddleBottom item={item} index={index} isSliderMoveing={isSliderMoveing} />}
                    </div>
                    
                    {RenderSlideRight && <RenderSlideRight item={item} index={index} isSliderMoveing={isSliderMoveing} />}
                  </div>
                  
                  {RenderSlideBottom && <RenderSlideBottom item={item} index={index} isSliderMoveing={isSliderMoveing} />}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {hasPagination && <div ref={this.paginationRef} className="swiper-pagination" />}
          
          {/* Scrollbar */}
          {hasScrollbar && <div ref={this.scrollbarRef} className="swiper-scrollbar" />}
        </div>
      </div>
    );
  }
}
