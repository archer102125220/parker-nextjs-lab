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
  isNavigationAbsolute?: boolean;
  indicatorColor?: string;
  selectedColor?: string;
  vertical?: boolean;
}

const SCROLL_STEP = 150;

export function Tabs({
  value,
  onChange,
  tabs = [],
  className = '',
  variant = 'standard',
  hasNavigation = true,
  isNavigationAbsolute = false,
  indicatorColor,
  selectedColor,
  vertical = false
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(value ?? tabs[0]?.value ?? 0);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [prevOpacity, setPrevOpacity] = useState(0);
  const [nextOpacity, setNextOpacity] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ 
    left: 0, 
    top: 0,
    width: 0,
    height: 0
  });
  
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
      
      if (vertical) {
        // Vertical mode
        if (variant === 'fullWidth') {
          setIndicatorStyle({
            left: 0,
            top: (activeIndex / tabs.length) * 100,
            width: 0,
            height: 100 / tabs.length
          });
        } else {
          setIndicatorStyle({
            left: 0,
            top: tabRect.top - containerRect.top + containerElement.scrollTop,
            width: 0,
            height: tabRect.height
          });
        }
      } else {
        // Horizontal mode
        if (variant === 'fullWidth') {
          setIndicatorStyle({
            left: (activeIndex / tabs.length) * 100,
            top: 0,
            width: 100 / tabs.length,
            height: 0
          });
        } else {
          setIndicatorStyle({
            left: tabRect.left - containerRect.left + containerElement.scrollLeft,
            top: 0,
            width: tabRect.width,
            height: 0
          });
        }
      }
    }
  }, [activeTab, tabs, variant, vertical]);

  // Check if navigation buttons should be shown
  const updateNavigationVisibility = useCallback(() => {
    if (!hasNavigation || !tabsListRef.current) return;
    
    const container = tabsListRef.current;
    
    if (vertical) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const canScrollUp = scrollTop > 0;
      const canScrollDown = scrollTop < scrollHeight - clientHeight - 1;
      
      // Only update opacity here, showPrev/showNext will be updated by useEffect with delay
      setPrevOpacity(canScrollUp ? 1 : 0);
      setNextOpacity(canScrollDown ? 1 : 0);
    } else {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
      
      // Only update opacity here, showPrev/showNext will be updated by useEffect with delay
      setPrevOpacity(canScrollLeft ? 1 : 0);
      setNextOpacity(canScrollRight ? 1 : 0);
    }
  }, [hasNavigation, vertical]);

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
      if (vertical) {
        tabsListRef.current.scrollBy({
          top: -SCROLL_STEP,
          behavior: 'smooth'
        });
      } else {
        tabsListRef.current.scrollBy({
          left: -SCROLL_STEP,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNextScroll = () => {
    if (tabsListRef.current) {
      if (vertical) {
        tabsListRef.current.scrollBy({
          top: SCROLL_STEP,
          behavior: 'smooth'
        });
      } else {
        tabsListRef.current.scrollBy({
          left: SCROLL_STEP,
          behavior: 'smooth'
        });
      }
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

  // Delay showPrev/showNext updates to allow opacity transition
  // This matches Nuxt's watch + nextTick + requestAnimationFrame pattern
  // Only applies when isNavigationAbsolute is true
  useEffect(() => {
    if (!isNavigationAbsolute) {
      // When not absolute, show/hide immediately (no delay)
      setShowPrev(prevOpacity === 1);
      return;
    }

    if (prevOpacity === 0 && showPrev) {
      // Delay hiding to allow fade out animation
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          setShowPrev(false);
        });
      }, 300); // Match opacity transition duration
      return () => clearTimeout(timer);
    } else if (prevOpacity === 1 && !showPrev) {
      // Show immediately when needed
      setShowPrev(true);
    }
  }, [prevOpacity, showPrev, isNavigationAbsolute]);

  useEffect(() => {
    if (!isNavigationAbsolute) {
      // When not absolute, show/hide immediately (no delay)
      setShowNext(nextOpacity === 1);
      return;
    }

    if (nextOpacity === 0 && showNext) {
      // Delay hiding to allow fade out animation
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          setShowNext(false);
        });
      }, 300); // Match opacity transition duration
      return () => clearTimeout(timer);
    } else if (nextOpacity === 1 && !showNext) {
      // Show immediately when needed
      setShowNext(true);
    }
  }, [nextOpacity, showNext, isNavigationAbsolute]);

  const cssVariables = {
    '--indicator-color': indicatorColor || '#1976d2',
    '--selected-color': selectedColor || '#1976d2',
    '--prev-opacity': prevOpacity,
    '--next-opacity': nextOpacity,
    '--navigation-position': isNavigationAbsolute ? 'absolute' : 'relative',
    ...(isNavigationAbsolute && vertical
      ? {
          '--prev-top': '0px',
          '--prev-left': '50%',
          '--prev-transform': 'translateX(-50%)',
          '--next-bottom': '0px',
          '--next-left': '50%',
          '--next-transform': 'translateX(-50%)'
        }
      : isNavigationAbsolute
      ? {
          '--prev-left': '0px',
          '--prev-top': '50%',
          '--prev-transform': 'translateY(-50%)',
          '--next-right': '0px',
          '--next-top': '50%',
          '--next-transform': 'translateY(-50%)'
        }
      : {}
    ),
    ...(vertical
      ? {
          '--indicator-top': variant === 'fullWidth' 
            ? `${indicatorStyle.top}%` 
            : `${indicatorStyle.top}px`,
          '--indicator-height': variant === 'fullWidth'
            ? `${indicatorStyle.height}%`
            : `${indicatorStyle.height}px`,
          '--indicator-left': '0',
          '--indicator-width': '2px'
        }
      : {
          '--indicator-left': variant === 'fullWidth' 
            ? `${indicatorStyle.left}%` 
            : `${indicatorStyle.left}px`,
          '--indicator-width': variant === 'fullWidth'
            ? `${indicatorStyle.width}%`
            : `${indicatorStyle.width}px`,
          '--indicator-top': 'auto',
          '--indicator-height': '2px'
        }
    )
  } as Record<string, string | number>;

  return (
    <div 
      className={`tabs ${vertical ? 'tabs_vertical' : ''} ${className}`} 
      ref={tabsContainerRef} 
      style={cssVariables}
    >
      <div className={`tabs-header ${vertical ? 'tabs-header_vertical' : ''}`}>
        {/* Prev Navigation Button - only render when hasNavigation AND showPrev */}
        {hasNavigation && showPrev && (
          <button
            className={`tabs-nav tabs-nav_prev ${vertical ? 'tabs-nav_vertical' : ''}`}
            onClick={handlePrevScroll}
            aria-label={vertical ? "Previous tabs (scroll up)" : "Previous tabs"}
          >
            {vertical ? '▲' : '‹'}
          </button>
        )}

        {/* Tabs List */}
        <div
          ref={tabsListRef}
          className={`tabs-header-list tabs-header-list_${variant} ${
            vertical ? 'tabs-header-list_vertical' : ''
          }`}
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.value}
              ref={(el) => { tabRefs.current[index] = el; }}
              className={`tabs-header-item ${
                tab.value === activeTab ? 'tabs-header-item_active' : ''
              } ${tab.disabled ? 'tabs-header-item_disabled' : ''}`}
              onClick={() => handleTabClick(tab.value, index)}
              role="tab"
              aria-selected={tab.value === activeTab}
              aria-disabled={tab.disabled}
              tabIndex={tab.disabled ? -1 : 0}
            >
              {tab.label}
            </div>
          ))}
          
          {/* Indicator */}
          <div className="tabs-header-indicator" />
        </div>

        {/* Next Navigation Button - only render when hasNavigation AND showNext */}
        {hasNavigation && showNext && (
          <button
            className={`tabs-nav tabs-nav_next ${vertical ? 'tabs-nav_vertical' : ''}`}
            onClick={handleNextScroll}
            aria-label={vertical ? "Next tabs (scroll down)" : "Next tabs"}
          >
            {vertical ? '▼' : '›'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Tabs;
