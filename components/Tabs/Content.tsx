'use client';

import {
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type CSSProperties
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import ScrollFetch from '@/components/ScrollFetch';

// Import Swiper styles
import 'swiper/css';

import './Content.scss';

export interface Tab {
  value: string | number;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
  // ScrollFetch per-tab settings
  isNotScrollFetch?: boolean;
  infinityEnd?: boolean;
  infinityEndLabel?: string;
  refreshDisable?: boolean;
}

export interface TabsContentProps {
  value?: string | number;
  tabs: Tab[];
  children?:
    | ReactNode
    | ((
        tab: Tab,
        index: number,
        isActive: boolean,
        isTabMoving: boolean
      ) => ReactNode);

  // Height props
  height?: string | number;
  swiperHeight?: string | number;
  tabsContentHeight?: string | number;

  // Styling
  className?: string;

  // Events
  onChange?: (value: string | number, index: number) => void;
  onSliderMove?: () => void;

  // Loading
  loading?: boolean;
  renderLoading?: ReactNode;

  // Custom renders
  renderTabTop?: ReactNode;

  // ScrollFetch props
  scrollFetch?: boolean;
  refresh?: () => Promise<void> | void;
  refreshDisable?: boolean;
  refreshIcon?: string;
  refreshingIcon?: string;
  pullingLabel?: string;
  loadingLabel?: string;
  iosStyle?: boolean;

  // Infinite scroll
  infinityFetch?: () => Promise<void> | void;
  infinityDisable?: boolean;
  infinityBuffer?: number;
  infinityLabel?: string;
  infinityEndLabel?: string;

  // Value key configuration
  valueKey?: string;
}

export function TabsContent({
  value,
  tabs = [],
  children,
  height = '100%',
  swiperHeight,
  tabsContentHeight,
  className = '',
  onChange,
  onSliderMove,
  loading = false,
  renderLoading,
  renderTabTop,
  scrollFetch = false,
  refresh,
  refreshDisable = false,
  refreshIcon,
  refreshingIcon,
  pullingLabel,
  loadingLabel,
  iosStyle,
  infinityFetch,
  infinityDisable = false,
  infinityBuffer,
  infinityLabel,
  infinityEndLabel,
  valueKey = 'value'
}: TabsContentProps) {
  const [isTabMoving, setIsTabMoving] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Height calculations
  const contentHeight = tabsContentHeight ?? height;
  const contentHeightStyle =
    typeof contentHeight === 'number' ? `${contentHeight}px` : contentHeight;
  const swiperHeightStyle = swiperHeight
    ? typeof swiperHeight === 'number'
      ? `${swiperHeight}px`
      : swiperHeight
    : contentHeightStyle;

  const cssVariables = {
    '--tabs_content-height': contentHeightStyle,
    '--tabs_content-swiper-height': swiperHeightStyle
  } as CSSProperties;

  // Helper functions
  const isNotScrollFetch = useCallback(
    (tab: Tab) => tab.isNotScrollFetch ?? false,
    []
  );

  const getInfinityEnd = useCallback(
    (tab: Tab) => tab.infinityEnd ?? false,
    []
  );

  const getRefreshDisable = useCallback(
    (tab: Tab) => tab.refreshDisable ?? refreshDisable,
    [refreshDisable]
  );

  const getInfinityEndLabel = useCallback(
    (tab: Tab) => tab.infinityEndLabel ?? infinityEndLabel,
    [infinityEndLabel]
  );

  // Find active index from value
  const activeIndex = tabs.findIndex((tab) => {
    const tabValue = tab[valueKey as keyof Tab] ?? tab.value;
    return tabValue === value;
  });

  const initialSlide = activeIndex >= 0 ? activeIndex : 0;

  // Event handlers
  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const newIndex = swiper.realIndex;
      const newTab = tabs[newIndex];

      if (newTab && onChange) {
        const tabValue = newTab[valueKey as keyof Tab] ?? newTab.value;
        onChange(tabValue as string | number, newIndex);
      }
    },
    [tabs, onChange, valueKey]
  );

  const handleSliderMove = useCallback(() => {
    setIsTabMoving(true);
    onSliderMove?.();
  }, [onSliderMove]);

  const handleSlideChangeTransitionEnd = useCallback(() => {
    setIsTabMoving(false);
  }, []);

  const resetRefreshDisable = useCallback(() => {
    setIsTabMoving(false);
  }, []);

  // Sync Swiper position when value prop changes (for TabsBar clicks)
  useEffect(() => {
    if (!swiperInstance || value === undefined) return;

    const targetIndex = tabs.findIndex((tab) => {
      const tabValue = tab[valueKey as keyof Tab] ?? tab.value;
      return tabValue === value;
    });

    if (targetIndex >= 0 && targetIndex !== swiperInstance.realIndex) {
      swiperInstance.slideTo(targetIndex, 300);
    }
  }, [value, swiperInstance, tabs, valueKey]);

  // Render slide content
  const renderSlideContent = useCallback(
    (tab: Tab, index: number) => {
      const isActive =
        index === (swiperInstance?.realIndex ?? initialSlide) && !isTabMoving;

      const renderContent = () => {
        // If children is a function, call it with tab data
        if (typeof children === 'function') {
          return children(tab, index, isActive, isTabMoving);
        }

        // If tab has content, use it
        if (tab.content) {
          return tab.content;
        }

        // Otherwise use children
        return children || <p>{tab.label}</p>;
      };

      // If scrollFetch is disabled or tab doesn't need it, render directly
      if (scrollFetch === false || isNotScrollFetch(tab)) {
        return <div className="tabs_content-wrapper">{renderContent()}</div>;
      }

      // Wrap with ScrollFetch component
      return (
        <ScrollFetch
          className="tabs_content-scroll_wrapper"
          height={height}
          loading={loading}
          iosStyle={iosStyle}
          refreshIcon={refreshIcon}
          refreshingIcon={refreshingIcon}
          pullingLabel={pullingLabel}
          loadingLabel={loadingLabel}
          infinityBuffer={infinityBuffer}
          infinityDisable={infinityDisable}
          infinityEnd={getInfinityEnd(tab)}
          refreshDisable={getRefreshDisable(tab)}
          infinityLabel={infinityLabel}
          infinityEndLabel={getInfinityEndLabel(tab)}
          onRefresh={refresh}
          onInfinityFetch={infinityFetch}
        >
          {renderContent()}
        </ScrollFetch>
      );
    },
    [
      children,
      isTabMoving,
      scrollFetch,
      isNotScrollFetch,
      height,
      loading,
      iosStyle,
      refreshIcon,
      refreshingIcon,
      pullingLabel,
      loadingLabel,
      infinityBuffer,
      infinityDisable,
      infinityLabel,
      getInfinityEnd,
      getRefreshDisable,
      getInfinityEndLabel,
      refresh,
      infinityFetch,
      swiperInstance,
      initialSlide
    ]
  );

  return (
    <div
      className={`tabs_content ${className}`}
      style={cssVariables}
      onMouseUp={resetRefreshDisable}
      onMouseOver={resetRefreshDisable}
      onTouchEnd={resetRefreshDisable}
    >
      {/* Tab Top Slot */}
      {renderTabTop}

      {/* Loading Slot */}
      {renderLoading ||
        (loading && <div className="tabs_content-loading">Loading...</div>)}

      <Swiper
        className="tabs_content-swiper"
        initialSlide={initialSlide}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        onSliderMove={handleSliderMove}
        onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
        speed={300}
        touchRatio={1}
        threshold={10}
      >
        {tabs.map((tab, index) => (
          <SwiperSlide
            key={String(tab[valueKey as keyof Tab] ?? tab.value ?? index)}
          >
            {renderSlideContent(tab, index)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
