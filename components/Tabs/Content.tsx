'use client';

import React, { ReactNode } from 'react';
import { SwiperJs } from '@/components/SwiperJs';
import type { SlideProps } from '@/components/SwiperJs';
import './Content.scss';

export interface Tab {
  value: string | number;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsContentProps {
  value?: string | number;
  tabs: Tab[];
  children?:
    | ReactNode
    | ((tab: Tab, index: number, isActive: boolean) => ReactNode);
  height?: string | number;
  swiperHeight?: string | number;
  className?: string;
  onChange?: (value: string | number, index: number) => void;
}

export function TabsContent({
  value,
  tabs = [],
  children,
  height = '100%',
  swiperHeight,
  className = '',
  onChange
}: TabsContentProps) {
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  // Convert to string for SwiperJs compatibility
  const safeSwiperHeight = swiperHeight || height;
  const swiperHeightValue =
    typeof safeSwiperHeight === 'number'
      ? `${safeSwiperHeight}px`
      : safeSwiperHeight;

  const cssVariables = {
    '--tabs-content-height': heightStyle
  } as Record<string, string>;

  // Render slide content
  const renderSlide = ({ item: tab, index, isSliderMoveing }: SlideProps) => {
    const isActive = !isSliderMoveing;

    // If children is a function, call it with tab data
    if (typeof children === 'function') {
      return children(tab, index, isActive);
    }

    // If tab has content, use it
    if (tab.content) {
      return tab.content;
    }

    // Otherwise use children
    return children;
  };

  return (
    <div className={`tabs-content ${className}`} style={cssVariables}>
      <SwiperJs
        slideList={tabs}
        value={value ?? tabs[0]?.value ?? 0}
        valueKey="value"
        renderSlide={renderSlide}
        change={(
          slideValue: string | number | object,
          activeIndex?: number
        ) => {
          if (onChange && activeIndex !== undefined) {
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

            onChange(actualValue, activeIndex);
          }
        }}
        slidesPerView={1}
        spaceBetween={0}
        swiperHeight={swiperHeightValue}
        overflow={true}
        shouldFillHeight={false}
      />
    </div>
  );
}

export default TabsContent;
