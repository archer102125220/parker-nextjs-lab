'use client';

import React, { ReactNode, useState, useCallback } from 'react';
import { SwiperJs } from '@/components/SwiperJs';
import type { SlideProps } from '@/components/SwiperJs';
import ScrollFetch from '@/components/ScrollFetch';
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
    | ((tab: Tab, index: number, isActive: boolean, isTabMoving: boolean) => ReactNode);
  
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

  // Height calculations
  const contentHeight = tabsContentHeight ?? height;
  const contentHeightStyle =
    typeof contentHeight === 'number' ? `${contentHeight}px` : contentHeight;

  const safeSwiperHeight = swiperHeight || height;
  const swiperHeightValue =
    typeof safeSwiperHeight === 'number'
      ? `${safeSwiperHeight}px`
      : safeSwiperHeight;

  const cssVariables = {
    '--tabs-content-height': contentHeightStyle,
    '--tabs-content-swiper-height': swiperHeightValue
  } as Record<string, string>;

  // Helper functions
  const isNotScrollFetch = useCallback((tab: Tab) => {
    if (typeof tab?.isNotScrollFetch === 'boolean') {
      return tab.isNotScrollFetch;
    }
    return typeof tab !== 'object';
  }, []);

  const getInfinityEnd = useCallback((tab: Tab) => {
    if (typeof tab?.infinityEnd === 'boolean') {
      return tab.infinityEnd;
    }
    return true;
  }, []);

  const getInfinityEndLabel = useCallback(
    (tab: Tab) => {
      if (typeof tab?.infinityEndLabel === 'string') {
        return tab.infinityEndLabel;
      }
      return infinityEndLabel;
    },
    [infinityEndLabel]
  );

  const getRefreshDisable = useCallback(
    (tab: Tab) => {
      if (typeof tab?.refreshDisable === 'boolean') {
        return tab.refreshDisable || refreshDisable || isTabMoving;
      }
      return refreshDisable || isTabMoving;
    },
    [refreshDisable, isTabMoving]
  );

  // Event handlers
  const handleSliderMove = useCallback(() => {
    setIsTabMoving(true);
    onSliderMove?.();
  }, [onSliderMove]);

  const resetRefreshDisable = useCallback(() => {
    setIsTabMoving(false);
  }, []);

  // Render slide content
  const renderSlide = useCallback(
    ({ item: tab, index, isSliderMoveing }: SlideProps) => {
      const isActive = !isSliderMoveing;

      // Render content based on scrollFetch setting
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
        return <div style={{ height: '100%' }}>{renderContent()}</div>;
      }

      // Wrap with ScrollFetch component
      return (
        <ScrollFetch
          className="tabs-content-scroll-wrapper"
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
      infinityFetch
    ]
  );

  return (
    <div
      className={`tabs-content ${className}`}
      style={cssVariables}
      onMouseUp={resetRefreshDisable}
      onMouseOver={resetRefreshDisable}
      onTouchEnd={resetRefreshDisable}
    >
      {/* Tab Top Slot */}
      {renderTabTop}

      {/* Loading Slot */}
      {renderLoading || (loading && <div className="tabs-content-loading">Loading...</div>)}

      <SwiperJs
        className="tabs-content-swiper"
        slideList={tabs}
        value={value ?? tabs[0]?.value ?? 0}
        valueKey={valueKey}
        renderSlide={renderSlide}
        change={(
          slideValue: string | number | object,
          activeIndex?: number
        ) => {
          if (!onChange || activeIndex === undefined) {
            return;
          }

          // Extract value from object or use directly
          let actualValue: string | number;

          if (typeof slideValue === 'object' && slideValue !== null) {
            // Type guard to check if object has value property
            if ('value' in slideValue) {
              const val = (slideValue as Record<string, unknown>).value;
              if (typeof val === 'string' || typeof val === 'number') {
                actualValue = val;
              } else {
                actualValue = 0;
              }
            } else {
              actualValue = 0;
            }
          } else if (
            typeof slideValue === 'string' ||
            typeof slideValue === 'number'
          ) {
            actualValue = slideValue;
          } else {
            actualValue = 0;
          }

          // Always trigger onChange, let parent decide
          onChange(actualValue, activeIndex);
        }}
        sliderMove={handleSliderMove}
        slidesPerView={1}
        spaceBetween={0}
        swiperHeight={swiperHeightValue}
        overflow={scrollFetch === false}
        shouldFillHeight={scrollFetch === true}
      />
    </div>
  );
}

export default TabsContent;
