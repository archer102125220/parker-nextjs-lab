'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import type { ElementType, CSSProperties } from 'react';
import _debounce from 'lodash/debounce';
import type { DebouncedFunc } from 'lodash';

// Import Swiper and modules
import Swiper from 'swiper';
import type { SwiperOptions } from 'swiper/types';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

import style from '@/components/SwiperJs/swiper_js.module.scss';

export type swiperEvent = (swiper: Swiper) => void; // 允許傳遞額外屬性
export type swiperChange = (
  slideValue: number | string | object,
  activeIndex?: number
) => void;
interface swiperJsPropsType {
  // render相關參數
  className?: string;
  renderPrevBtn?: ElementType;
  renderNextBtn?: ElementType; // 允許傳遞額外屬性
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slideList: Array<any>; // 允許傳遞額外屬性
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
}
export type swiperValue = swiperJsPropsType['value'];
interface cssVariableType extends CSSProperties {
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

export function SwiperJs(props: swiperJsPropsType) {
  const {
    // render相關參數
    className = '',
    renderPrevBtn: RenderPrevBtn = null,
    renderNextBtn: RenderNextBtn = null,
    slideList = [],
    valueKey = '',
    renderSlideTop: RenderSlideTop = null,
    renderSlideLeft: RenderSlideLeft = null,
    renderSlideMiddleTop: RenderSlideMiddleTop = null,
    renderSlide: RenderSlide = null,
    renderSlideMiddleBottom: RenderSlideMiddleBottom = null,
    renderSlideRight: RenderSlideRight = null,
    renderSlideBottom: RenderSlideBottom = null,

    // css變數相關參數
    overflow = false,
    shouldFillHeight = false,
    swiperHeight = '',

    // 原生Swiper.js相關參數
    centeredSlides = false,
    slidesPerView = 1,
    spaceBetween = 0,
    longSwipesRatio = 0.2,
    loop = false,
    autoplayDelay = null,
    autoplayDisableOnInteraction = false,
    paginationClickable = true,
    dynamicBullets = false,

    // 與原生Swiper.js磨合相關參數
    value = 0,
    hasNavigation = false,
    hasPagination = false,
    hasScrollbar = false,

    // 原生Swiper.js相關事件參數
    change,
    beforeInit,
    init,
    afterInit,
    beforeDestroy,
    destroy,
    beforeSlideChangeStart,
    slideChange,
    slideChangeTransitionEnd,
    sliderMove,
    reachBeginning,
    reachEnd,
    fromEdge,
    activeIndexChange,
    beforeTransitionStart,
    realIndexChange
  } = props;

  const swiperJsRootRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  const [swiperObj, setSwiperObj] = useState<Swiper | null>(null);
  const [params, setParams] = useState<SwiperOptions | null>(null);
  const [isSliderMoveing, setIsSliderMoveing] = useState(false);

  const [cssVariable, setCssVariable] = useState<cssVariableType>({});

  const resetMoveingStatus = useCallback<() => void>(() => {
    setIsSliderMoveing(false);
  }, []);
  const resetSwiperScroll = useCallback<() => void>(() => {
    // 校正 slide 位置，避免有任何scroll事件影響swiper位置
    if (
      typeof swiperJsRootRef.current?.scrollWidth === 'number' &&
      swiperJsRootRef.current?.scrollWidth > 0
    ) {
      swiperJsRootRef.current.scrollTo(0, 0);
    }
  }, []);

  const syncSlide = useCallback(
    (value: swiperValue, swiper: Swiper | null) => {
      if (
        typeof swiper?.slideTo !== 'function' ||
        Array.isArray(slideList) === false ||
        slideList.length <= 0
      ) {
        return;
      }

      const _slideIndex = slideList.findIndex(
        (slide) =>
          (loop === true &&
            (`${slide?.[valueKey]}` === value ||
              `${slide?.value}` === value)) ||
          (loop === false &&
            (slide?.[valueKey] === value || slide?.value === value))
      );
      const slideIndex =
        typeof _slideIndex === 'number' && _slideIndex > -1
          ? _slideIndex
          : typeof value === 'number' || typeof value === 'string'
            ? value
            : 0;

      if (Number(slideIndex) !== swiper.realIndex) {
        if (loop === true) {
          swiper.slideToLoop(Number(slideIndex));
        } else {
          swiper.slideTo(Number(slideIndex));
        }
      }
    },
    [slideList, loop, valueKey]
  );
  const syncSlideList = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newSlideList: any[] = [], swiper: Swiper | null) => {
      // 允許傳遞額外屬性
      if (
        typeof swiper?.slideTo !== 'function' ||
        Array.isArray(newSlideList) === false ||
        newSlideList.length <= 0
      ) {
        return;
      }

      const _slideIndex = newSlideList.findIndex(
        (slide) => slide?.[valueKey] === value || slide?.value === value
      );
      const slideIndex =
        typeof _slideIndex === 'number' && _slideIndex > -1
          ? _slideIndex
          : typeof value === 'number' || typeof value === 'string'
            ? value
            : 0;

      if (Number(slideIndex) !== swiper.realIndex) {
        if (loop === true) {
          swiper.slideToLoop(Number(slideIndex));
        } else {
          swiper.slideTo(Number(slideIndex));
        }
      }
    },
    [valueKey, value, loop]
  );

  const changeDebounce = useCallback<DebouncedFunc<swiperChange>>(
    _debounce((slideValue: number | string, activeIndex: number) => {
      if (typeof change === 'function') {
        change(
          isNaN(Number(slideValue)) ? slideValue : Number(slideValue),
          activeIndex
        );
      }
    }, 200),
    [change]
  );
  const handleSlideChange = useCallback<swiperEvent>(
    (swiper: Swiper) => {
      // 允許傳遞額外屬性
      if (loop === true) {
        const slideValueEl = swiper.slides[swiper.activeIndex];
        const slideValue =
          slideValueEl?.getAttribute('swiper-loop-value') || '';

        if (`${value}` !== slideValue) {
          changeDebounce(slideValue, swiper.activeIndex);
        }
      } else {
        // const slideData = slideList[swiper.activeIndex];
        // const slideValue =
        //   slideData?.[valueKey] || slideData?.value || swiper.activeIndex;
        const slideData = slideList[swiper.realIndex];
        const slideValue =
          slideData?.[valueKey] || slideData?.value || swiper.realIndex;

        if (value !== slideValue) {
          changeDebounce(slideValue, swiper.activeIndex);
        }
      }

      if (typeof slideChange === 'function') {
        slideChange(swiper);
      }
    },
    [loop, changeDebounce, slideList, valueKey, value, slideChange]
  );
  const handleSliderMove = useCallback<swiperEvent>(
    (swiper: Swiper) => {
      // 允許傳遞額外屬性
      if (typeof sliderMove === 'function') {
        sliderMove(swiper);
      }
      setIsSliderMoveing(true);
    },
    [sliderMove]
  );
  const handleSwiperInit = useCallback<() => void>(() => {
    if (swiperRef.current === null) return;

    const _params: SwiperOptions = {
      modules: [],
      centeredSlides,
      slidesPerView,
      spaceBetween,
      longSwipesRatio,
      on: {
        beforeInit,
        init,
        afterInit,
        beforeDestroy,
        destroy,
        beforeSlideChangeStart,
        slideChange: handleSlideChange,
        sliderMove: handleSliderMove,
        reachBeginning,
        reachEnd,
        fromEdge,
        activeIndexChange,
        beforeTransitionStart,
        realIndexChange,
        slideChangeTransitionEnd
      }
    };
    if (hasNavigation === true) {
      const _modules = _params.modules || [];
      _params.modules = [..._modules, Navigation];
      _params.navigation = {
        nextEl: nextRef.current,
        prevEl: prevRef.current
      };
    }
    if (hasPagination === true) {
      const _modules = _params.modules || [];
      _params.modules = [..._modules, Pagination];
      _params.pagination = {
        el: paginationRef.current,
        clickable: paginationClickable,
        dynamicBullets: dynamicBullets
      };
    }
    if (hasScrollbar === true) {
      const _modules = _params.modules || [];
      _params.modules = [..._modules, Scrollbar];
      _params.scrollbar = {
        el: scrollbarRef.current
      };
    }

    if (
      autoplayDelay !== null &&
      autoplayDelay !== undefined &&
      isNaN(autoplayDelay) === false
    ) {
      const _modules = _params.modules || [];
      _params.modules = [..._modules, Autoplay];
      _params.autoplay = {
        delay: autoplayDelay,
        disableOnInteraction: autoplayDisableOnInteraction
      };
    }
    if (loop === true) {
      _params.loop = loop;
    }

    const _swiperObj = new Swiper(swiperRef.current, _params);
    setSwiperObj(_swiperObj);
    setParams(_params);
  }, [
    centeredSlides,
    slidesPerView,
    spaceBetween,
    longSwipesRatio,

    beforeInit,
    init,
    afterInit,
    beforeDestroy,
    destroy,
    beforeSlideChangeStart,
    handleSlideChange,
    handleSliderMove,
    reachBeginning,
    reachEnd,
    fromEdge,
    activeIndexChange,
    beforeTransitionStart,
    realIndexChange,
    slideChangeTransitionEnd,

    hasNavigation,

    hasPagination,
    paginationClickable,
    dynamicBullets,

    hasScrollbar,
    autoplayDelay,
    autoplayDisableOnInteraction,
    loop
  ]);
  const handleSwiperUpdata = useCallback(
    (newProps: swiperJsPropsType) => {
      if (
        typeof swiperObj?.update === 'function' &&
        Array.isArray(newProps.slideList) &&
        newProps.slideList.length > 0
      ) {
        const _params: SwiperOptions = {
          ...(params || {}),
          modules: [],
          centeredSlides: newProps.centeredSlides,
          slidesPerView: newProps.slidesPerView,
          spaceBetween: newProps.spaceBetween,
          longSwipesRatio: newProps.longSwipesRatio
        };
        if (newProps.hasNavigation === true) {
          const _modules = _params.modules || [];
          _params.modules = [..._modules, Navigation];
          _params.navigation = {
            nextEl: nextRef.current,
            prevEl: prevRef.current
          };
        }
        if (newProps.hasPagination === true) {
          const _modules = _params.modules || [];
          _params.modules = [..._modules, Pagination];
          _params.pagination = {
            el: paginationRef.current,
            clickable: newProps.paginationClickable,
            dynamicBullets: newProps.dynamicBullets
          };
        }
        if (newProps.hasScrollbar === true) {
          const _modules = _params.modules || [];
          _params.modules = [..._modules, Scrollbar];
          _params.scrollbar = {
            el: scrollbarRef.current
          };
        }

        if (
          newProps.autoplayDelay !== null &&
          newProps.autoplayDelay !== undefined &&
          isNaN(newProps.autoplayDelay) === false
        ) {
          const _modules = _params.modules || [];
          _params.modules = [..._modules, Autoplay];
          _params.autoplay = {
            delay: newProps.autoplayDelay,
            disableOnInteraction: newProps.autoplayDisableOnInteraction
          };
        }

        // swiperObj.update(_params);
        swiperObj.update();
        swiperObj.updateSize();
        swiperObj.updateSlides();
        setParams(_params);

        // 校正 slide 位置
        swiperObj.off('slideChange', handleSlideChange);
        swiperObj.slideTo(newProps.slideList.length - 1, 0, false);
        setTimeout(() => {
          swiperObj.on('slideChange', handleSlideChange);
          syncSlide(value, swiperObj);
        }, 300);
      }
    },
    [swiperObj, value, params, handleSlideChange, syncSlide]
  );

  useIsomorphicLayoutEffect(() => {
    const _cssVariable: cssVariableType = {};

    if (typeof overflow === 'boolean' && overflow === true) {
      _cssVariable['--content_wrapper_slide_height'] = '100%';
      _cssVariable['--slide_height'] = '100%';
      _cssVariable['--slide_overflow_y'] = 'auto';
      _cssVariable['--slide_overflow_x'] = 'hidden';
    }

    if (typeof shouldFillHeight === 'boolean' && shouldFillHeight === true) {
      _cssVariable['--content_wrapper_slide_height'] = '100%';
      _cssVariable['--slide_height'] = '100%';
      _cssVariable['--slide_display'] = 'flex';
      _cssVariable['--slide_flex_direction'] = 'column';
      _cssVariable['--center_flex'] = 1;
    }

    if (typeof swiperHeight === 'string' && swiperHeight !== '') {
      _cssVariable['--content_wrapper_slide_height'] = swiperHeight;
      _cssVariable['--slide_height'] = swiperHeight;
    } else if (swiperHeight !== '' && isNaN(Number(swiperHeight)) === false) {
      _cssVariable['--content_wrapper_slide_height'] = `${swiperHeight}px`;
      _cssVariable['--slide_height'] = `${swiperHeight}px`;
    } else {
      // _cssVariable["--content_wrapper_slide_height"] = "";
      _cssVariable['--slide_height'] = '';
    }

    setCssVariable(_cssVariable);
  }, [overflow, shouldFillHeight, swiperHeight]);

  useEffect(() => {
    if (typeof swiperRef.current?.swiper === 'undefined') return;

    window.requestAnimationFrame(() => {
      handleSwiperUpdata(props);
      syncSlideList(props.slideList, swiperObj);

      const newValue = props.loop === true ? `${props.value}` : props.value;
      syncSlide(newValue, swiperObj);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, swiperObj]); // 不依照 lint 規則，否則會導致多餘觸發
  useEffect(() => {
    if (typeof swiperRef.current?.swiper !== 'undefined') return;

    handleSwiperInit();
  }, [handleSwiperInit]);

  return (
    <div
      ref={swiperJsRootRef}
      className={[style['swiper_js'], className].join(' ')}
      style={cssVariable}
      onMouseUp={resetMoveingStatus}
      onTouchEnd={resetMoveingStatus}
      onScroll={resetSwiperScroll}
    >
      {/* If we need navigation buttons */}
      {hasNavigation === true && (
        <div ref={prevRef} className={style['swiper_js-prev']}>
          {/* <slot name="prev">
          <div className={style["swiper_js-prev-btn"]}>
            { '<' }
          </div>
        </slot> */}
          {typeof RenderPrevBtn === 'function' ? (
            <RenderPrevBtn />
          ) : (
            <div className={style['swiper_js-prev-btn']}>{'<'}</div>
          )}
        </div>
      )}
      {hasNavigation === true && (
        <div ref={nextRef} className={style['swiper_js-next']}>
          {/* <slot name="next">
          <div className={style["swiper_js-next-btn"]}>
            { '>' }
          </div>
        </slot> */}
          {typeof RenderNextBtn === 'function' ? (
            <RenderNextBtn />
          ) : (
            <div className={style['swiper_js-next-btn']}>{'<'}</div>
          )}
        </div>
      )}

      {/* Additional required wrapper */}
      <div ref={swiperRef} className={style['swiper_js-content']}>
        <div
          className={[
            style['swiper_js-content-wrapper'],
            'swiper-wrapper'
          ].join(' ')}
        >
          {/* Slides */}
          {slideList.map(
            (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              slide: { [key: string | number | symbol]: any },
              index: number
            ) => (
              // 允許傳遞額外屬性
              <div
                key={slide[valueKey] || slide.value || index}
                swiper-loop-value={slide[valueKey] || slide.value || index}
                className={[
                  style['swiper_js-content-wrapper-slide'],
                  'swiper-slide'
                ].join(' ')}
              >
                {/* <slot
                v-if="slotNameIsDefault === false"
                name="`${slide[slotNameKey] || slide.slotName || index}-top`"
                item="slide"
                index="index"
                is-slider-moveing="isSliderMoveing"
              />
              <slot
                v-else
                name="default-top"
                item="slide"
                index="index"
                is-slider-moveing="isSliderMoveing"
              /> */}
                {typeof RenderSlideTop === 'function' ? (
                  <RenderSlideTop
                    item={slide}
                    index={index}
                    isSliderMoveing={isSliderMoveing}
                  />
                ) : (
                  ''
                )}

                <div
                  className={style['swiper_js-content-wrapper-slide-center']}
                >
                  {/* <slot
                  v-if="slotNameIsDefault === false"
                  name="`${slide[slotNameKey] || slide.slotName || index}-left`"
                  item="slide"
                  index="index"
                  is-slider-moveing="isSliderMoveing"
                />
                <slot
                  v-else
                  name="default-left"
                  item="slide"
                  index="index"
                  is-slider-moveing="isSliderMoveing"
                /> */}
                  {typeof RenderSlideLeft === 'function' ? (
                    <RenderSlideLeft
                      item={slide}
                      index={index}
                      isSliderMoveing={isSliderMoveing}
                    />
                  ) : (
                    ''
                  )}

                  <div
                    className={
                      style['swiper_js-content-wrapper-slide-center-middle']
                    }
                  >
                    {/* <slot
                    v-if="slotNameIsDefault === false"
                    name="`${
                    slide[slotNameKey] || slide.slotName || index
                  }-middle_top`"
                    item="slide"
                    index="index"
                    is-slider-moveing="isSliderMoveing"
                  />
                  <slot
                    v-else
                    name="default-middle_top"
                    item="slide"
                    index="index"
                    is-slider-moveing="isSliderMoveing"
                  /> */}
                    {typeof RenderSlideMiddleTop === 'function' ? (
                      <RenderSlideMiddleTop
                        item={slide}
                        index={index}
                        isSliderMoveing={isSliderMoveing}
                      />
                    ) : (
                      ''
                    )}

                    {/* <slot
                    v-if="slotNameIsDefault === false"
                    name="slide[slotNameKey] || slide.slotName || index"
                    item="slide"
                    index="index"
                    is-slider-moveing="isSliderMoveing"
                  >
                    <p>{slide.content || slide}</p>
                  </slot>
                  <slot
                    v-else
                    item="slide"
                    index="index"
                    is-slider-moveing="isSliderMoveing"
                  >
                    <p> {slide.content || slide}</p>
                  </slot> */}
                    {typeof RenderSlide === 'function' ? (
                      <RenderSlide
                        item={slide}
                        index={index}
                        isSliderMoveing={isSliderMoveing}
                      />
                    ) : (
                      <p>{slide.content || slide}</p>
                    )}

                    {/* <slot
                    v-if="slotNameIsDefault === false"
                    name="`${
                    slide[slotNameKey] || slide.slotName || index
                  }-middle_bottom`"
                    item="slide"
                    index="index"
                    is-slider-moveing="isSliderMoveing"
                  />
                  <slot
                    v-else
                    name="default-middle_bottom"
                    item="slide"
                    index="index"
                    is-slider-moveing="isSliderMoveing"
                  /> */}
                    {typeof RenderSlideMiddleBottom === 'function' ? (
                      <RenderSlideMiddleBottom
                        item={slide}
                        index={index}
                        isSliderMoveing={isSliderMoveing}
                      />
                    ) : (
                      ''
                    )}
                  </div>

                  {/* <slot
                  v-if="slotNameIsDefault === false"
                  name="`${slide[slotNameKey] || slide.slotName || index}-right`"
                  item="slide"
                  index="index"
                  is-slider-moveing="isSliderMoveing"
                />
                <slot
                  v-else
                  name="default-right"
                  item="slide"
                  index="index"
                  is-slider-moveing="isSliderMoveing"
                /> */}
                  {typeof RenderSlideRight === 'function' ? (
                    <RenderSlideRight
                      item={slide}
                      index={index}
                      isSliderMoveing={isSliderMoveing}
                    />
                  ) : (
                    ''
                  )}
                </div>

                {/* <slot
                v-if="slotNameIsDefault === false"
                name="`${slide[slotNameKey] || slide.slotName || index}-bottom`"
                item="slide"
                index="index"
                is-slider-moveing="isSliderMoveing"
              />
              <slot
                v-else
                name="default-bottom"
                item="slide"
                index="index"
                is-slider-moveing="isSliderMoveing"
              /> */}
                {typeof RenderSlideBottom === 'function' ? (
                  <RenderSlideBottom
                    item={slide}
                    index={index}
                    isSliderMoveing={isSliderMoveing}
                  />
                ) : (
                  ''
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* If we need pagination */}
      {hasPagination === true && (
        <div ref={paginationRef} className="swiper-pagination" />
      )}

      {/* If we need scrollbar */}
      {hasScrollbar === true && (
        <div ref={scrollbarRef} className="swiper-scrollbar" />
      )}
    </div>
  );
}

export default SwiperJs;
