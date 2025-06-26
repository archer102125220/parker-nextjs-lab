'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import type { ComponentType, CSSProperties } from 'react';
import _debounce from 'lodash/debounce';

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

type SwiperEvent = ((swiper: Swiper, ...arg: any[]) => void) | undefined;
interface swiperJsPropsType {
  // render相關參數
  className?: string;
  renderPrevBtn?: ComponentType<any>;
  renderNextBtn?: ComponentType<any>;
  slideList: Array<any>;
  valueKey?: string | number;
  renderSlideTop?: ComponentType<any>;
  renderSlideLeft?: ComponentType<any>;
  renderSlideMiddleTop?: ComponentType<any>;
  renderSlide?: ComponentType<any>;
  renderSlideMiddleBottom?: ComponentType<any>;
  renderSlideRight?: ComponentType<any>;
  renderSlideBottom?: ComponentType<any>;

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
  value: number | string | object;
  hasNavigation?: boolean | null;
  hasPagination?: boolean | null;
  hasScrollbar?: boolean | null;

  // 原生Swiper.js相關事件參數
  change: Function | null;
  beforeInit?: SwiperEvent;
  init?: SwiperEvent;
  afterInit?: SwiperEvent;
  beforeDestroy?: SwiperEvent;
  destroy?: SwiperEvent;
  beforeSlideChangeStart?: SwiperEvent;
  slideChange?: SwiperEvent;
  slideChangeTransitionEnd?: SwiperEvent;
  sliderMove?: SwiperEvent;
  reachBeginning?: SwiperEvent;
  reachEnd?: SwiperEvent;
  fromEdge?: SwiperEvent;
  activeIndexChange?: SwiperEvent;
  beforeTransitionStart?: SwiperEvent;
  realIndexChange?: SwiperEvent;
}
interface cssVariableType extends CSSProperties {
  [key: string | number | symbol]: any;
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
    centeredSlides,
    slidesPerView = 1,
    spaceBetween,
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
  const swiperRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  const [swiperObj, setSwiperObj] = useState<Swiper | null>(null);
  const [params, setParams] = useState<SwiperOptions | null>(null);
  const [isSliderMoveing, setIsSliderMoveing] = useState(false);

  const [cssVariable, setCssVariable] = useState<cssVariableType>({});

  const resetMoveingStatus = useCallback(() => {
    setIsSliderMoveing(false);
  }, []);
  const resetSwiperScroll = useCallback(() => {
    // 校正 slide 位置，避免有任何scroll事件影響swiper位置
    if (
      typeof swiperJsRootRef.current?.scrollWidth === 'number' &&
      swiperJsRootRef.current?.scrollWidth > 0
    ) {
      swiperJsRootRef.current.scrollTo(0, 0);
    }
  }, []);

  const syncSlide = useCallback(
    (value: any, swiper: Swiper | null) => {
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
          : value;

      if (Number(slideIndex) !== swiper.realIndex) {
        if (loop === true) {
          swiper.slideToLoop(slideIndex || 0);
        } else {
          swiper.slideTo(slideIndex || 0);
        }
      }
    },
    [slideList, loop, valueKey]
  );
  const syncSlideList = useCallback(
    (newSlideList: any[] = [], swiper: Swiper | null) => {
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
          : value;

      // @ts-ignore
      swiper.slideTo(slideIndex || 0);
    },
    [valueKey, value]
  );

  const handleAfterInit = useCallback(
    (swiper: Swiper) => {
      if (typeof afterInit === 'function') {
        afterInit(swiper);
      }
    },
    [afterInit]
  );
  const changeDebounce = useCallback(
    _debounce((slideValue, activeIndex: number) => {
      if (typeof change === 'function') {
        change(
          isNaN(slideValue) ? slideValue : Number(slideValue),
          activeIndex
        );
      }
    }, 200),
    [change]
  );
  const handleSlideChange = useCallback(
    (swiper: Swiper, ...arg: any[]) => {
      if (loop === true) {
        const slideValueEl = swiper.slides[swiper.activeIndex];
        const slideValue = slideValueEl?.getAttribute('swiper-loop-value');

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
        slideChange(swiper, ...arg);
      }
    },
    [loop, changeDebounce, slideList, valueKey, value, slideChange]
  );
  const handleSliderMove = useCallback(
    (swiper: Swiper, ...arg: any[]) => {
      if (typeof sliderMove === 'function') {
        sliderMove(swiper, ...arg);
      }
      setIsSliderMoveing(true);
    },
    [sliderMove]
  );
  const handleSwiperInit = useCallback(() => {
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
        afterInit: handleAfterInit,
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
      // @ts-ignore TODO
      _params.modules = [..._params.modules, Navigation];
      _params.navigation = {
        nextEl: nextRef.current,
        prevEl: prevRef.current
      };
    }
    if (hasPagination === true) {
      _params.modules = [..._params.modules, Pagination];
      _params.pagination = {
        el: paginationRef.current,
        clickable: paginationClickable,
        dynamicBullets: dynamicBullets
      };
    }
    if (hasScrollbar === true) {
      _params.modules = [..._params.modules, Scrollbar];
      _params.scrollbar = {
        el: scrollbarRef.current
      };
    }

    if (
      autoplayDelay !== null &&
      autoplayDelay !== undefined &&
      isNaN(autoplayDelay) === false
    ) {
      _params.modules = [..._params.modules, Autoplay];
      _params.autoplay = {
        delay: autoplayDelay,
        disableOnInteraction: autoplayDisableOnInteraction
      };
    }
    if (loop === true) {
      _params.loop = loop;
    }

    setSwiperObj(new Swiper(swiperRef.current, _params));
    setParams(_params);
  }, [
    centeredSlides,
    slidesPerView,
    spaceBetween,
    longSwipesRatio,

    beforeInit,
    init,
    handleAfterInit,
    beforeDestroy,
    destroy,
    beforeSlideChangeStart,
    handleSlideChange,
    sliderMove,
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
          // @ts-ignore TODO
          _params.modules = [..._params.modules, Navigation];
          _params.navigation = {
            nextEl: nextRef.current,
            prevEl: prevRef.current
          };
        }
        if (newProps.hasPagination === true) {
          _params.modules = [..._params.modules, Pagination];
          _params.pagination = {
            el: paginationRef.current,
            clickable: newProps.paginationClickable,
            dynamicBullets: newProps.dynamicBullets
          };
        }
        if (newProps.hasScrollbar === true) {
          _params.modules = [..._params.modules, Scrollbar];
          _params.scrollbar = {
            el: scrollbarRef.current
          };
        }

        if (
          newProps.autoplayDelay !== null &&
          newProps.autoplayDelay !== undefined &&
          isNaN(newProps.autoplayDelay) === false
        ) {
          _params.modules = [..._params.modules, Autoplay];
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
        swiperObj.slideTo(props.slideList.length - 1, 0, false);
        setTimeout(() => {
          swiperObj.on('slideChange', handleSlideChange);
          syncSlide(value, swiperObj);
        }, 300);
      }
    },
    [swiperObj, value]
  );

  useIsomorphicLayoutEffect(() => {
    console.log('useIsomorphicLayoutEffect overflow, shouldFillHeight, swiperHeight');
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
    console.log('useEffect props');
    // @ts-ignore
    if (typeof swiperRef.current?.swiper === 'undefined') return;
    console.log('props');
    // handleSwiperUpdata(props);

    setTimeout(
      () =>
        window.requestAnimationFrame(() => {
          handleSwiperUpdata(props);
          syncSlideList(props.slideList, swiperObj);

          const newValue = props.loop === true ? `${props.value}` : props.value;
          syncSlide(newValue, swiperObj);
        }),
      1500
    );
  }, [props]);
  useEffect(() => {
    console.log('useEffect handleSwiperInit');
    // @ts-ignore
    if (typeof swiperRef.current?.swiper !== 'undefined') return;
    console.log('handleSwiperInit');
    // handleSwiperInit();
    setTimeout(() => window.requestAnimationFrame(handleSwiperInit), 1500);
  }, [handleSwiperInit]);
  useEffect(() => {
    console.log('useEffect swiperObj, style, className');
    console.log({ swiperObj, style, className });
  }, [swiperObj, style, className]);

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
          {slideList.map((slide: any, index: number) => (
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

              <div className={style['swiper_js-content-wrapper-slide-center']}>
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
          ))}
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
