'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import './index.scss';

export interface Tab {
  label: string;
  value: string | number;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  value?: string | number;
  onChange?: (value: string | number, index: number) => void;
  tabs: Tab[];
  className?: string;
  variant?: 'standard' | 'fullWidth';
  hasNavigation?: boolean;
  indicatorColor?: string;
  selectedColor?: string;
}

const SCROLL_STEP = 150;

export function Tabs({
  value,
  onChange,
  tabs = [],
  className = '',
  variant = 'standard',
  hasNavigation = true,
  indicatorColor,
  selectedColor
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(value ?? tabs[0]?.value ?? 0);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  // Refs for DOM elements
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleTabClick = (tabValue: string | number, index: number) => {
    if (tabs[index]?.disabled) return;
    
    setActiveTab(tabValue);
    onChange?.(tabValue, index);
    
    // Scroll active tab into view
    scrollToTab(index);
  };

  // Update indicator position based on active tab
  const updateIndicator = useCallback(() => {
    const activeIndex = tabs.findIndex(tab => tab.value === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];
    const containerElement = tabsListRef.current;
    
    if (activeTabElement && containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      
      if (variant === 'fullWidth') {
        setIndicatorStyle({
          left: (activeIndex / tabs.length) * 100,
          width: 100 / tabs.length
        });
      } else {
        setIndicatorStyle({
          left: tabRect.left - containerRect.left + containerElement.scrollLeft,
          width: tabRect.width
        });
      }
    }
  }, [activeTab, tabs, variant]);

  // Check if navigation buttons should be shown
  const updateNavigationVisibility = useCallback(() => {
    if (!hasNavigation || !tabsListRef.current) return;
    
    const container = tabsListRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setShowPrev(scrollLeft > 0);
    setShowNext(scrollLeft < scrollWidth - clientWidth - 1);
  }, [hasNavigation]);

  // Scroll to specific tab
  const scrollToTab = (index: number) => {
    const tabElement = tabRefs.current[index];
    if (tabElement && tabsListRef.current) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  // Scroll prev/next
  const handlePrevScroll = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({
        left: -SCROLL_STEP,
        behavior: 'smooth'
      });
    }
  };

  const handleNextScroll = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({
        left: SCROLL_STEP,
        behavior: 'smooth'
      });
    }
  };

  // Update indicator when active tab or tabs change
  useEffect(() => {
    updateIndicator();
    updateNavigationVisibility();
  }, [activeTab, tabs, variant, updateIndicator, updateNavigationVisibility]);

  // Update on scroll
  useEffect(() => {
    const container = tabsListRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateNavigationVisibility();
      updateIndicator();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateIndicator, updateNavigationVisibility]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
      updateNavigationVisibility();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator, updateNavigationVisibility]);

  // Sync controlled value (this is intentional for controlled components)
  useEffect(() => {
    if (value !== undefined && value !== activeTab) {
      setActiveTab(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const cssVariables = {
    '--indicator-color': indicatorColor || '#1976d2',
    '--selected-color': selectedColor || '#1976d2',
    ...(variant === 'fullWidth' 
      ? { 
          '--indicator-left': `${indicatorStyle.left}%`,
          '--indicator-width': `${indicatorStyle.width}%`
        }
      : {
          '--indicator-left': `${indicatorStyle.left}px`,
          '--indicator-width': `${indicatorStyle.width}px`
        }
    )
  } as React.CSSProperties;

  return (
    <div className={`tabs ${className}`} ref={tabsContainerRef} style={cssVariables}>
      <div className="tabs-header">
        {/* Prev Navigation Button */}
        {hasNavigation && showPrev && (
          <button
            className="tabs-nav tabs-nav_prev"
            onClick={handlePrevScroll}
            aria-label="Previous tabs"
          >
            ‹
          </button>
        )}

        {/* Tabs List */}
        <div
          ref={tabsListRef}
          className={`tabs-header-list tabs-header-list_${variant}`}
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.value}
              ref={(el) => { tabRefs.current[index] = el; }}
              className={`tabs-header-item ${
                tab.value === activeTab ? 'tabs-header-item_active' : ''
              } ${tab.disabled ? 'tabs-header-item_disabled' : ''}`}
              onClick={() => handleTabClick(tab.value, index)}
            >
              {tab.label}
            </div>
          ))}
          
          {/* Indicator */}
          <div className="tabs-header-indicator" />
        </div>

        {/* Next Navigation Button */}
        {hasNavigation && showNext && (
          <button
            className="tabs-nav tabs-nav_next"
            onClick={handleNextScroll}
            aria-label="Next tabs"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default Tabs;
