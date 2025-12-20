'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import './Bar.scss';

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
  onScroll?: (event: { scrollLeft: number; scrollTop: number }) => void;
  onScrollEnd?: (event: { scrollLeft: number; scrollTop: number }) => void;
  scrollDisable?: boolean;
  limitShadow?: boolean;
  ripple?: boolean;
  rippleColor?: string;
  hover?: boolean;
  gap?: number | string;
  justifyContent?: string;
  alignItems?: string;
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
  vertical = false,
  onScroll,
  onScrollEnd,
  scrollDisable = false,
  limitShadow = true,
  ripple = true,
  rippleColor = 'rgba(158, 158, 158, 0.4)',
  hover = false,
  gap,
  justifyContent,
  alignItems
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(value ?? tabs[0]?.value ?? 0);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [prevOpacity, setPrevOpacity] = useState(0);
  const [nextOpacity, setNextOpacity] = useState(0);
  const [showFirstShadow, setShowFirstShadow] = useState(false);
  const [showLastShadow, setShowLastShadow] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverIndicatorStyle, setHoverIndicatorStyle] = useState({ 
    left: 0, 
    top: 0,
    width: 0,
    height: 0,
    opacity: 0
  });
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

  // Ripple effect handler
  const handleRipple = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ripple) return;
    
    const button = e.currentTarget;
    const rippleElement = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    rippleElement.style.width = rippleElement.style.height = `${size}px`;
    rippleElement.style.left = `${x}px`;
    rippleElement.style.top = `${y}px`;
    rippleElement.style.backgroundColor = rippleColor;
    rippleElement.classList.add('tabs-ripple');
    
    button.appendChild(rippleElement);
    
    setTimeout(() => {
      rippleElement.remove();
    }, 600);
  }, [ripple, rippleColor]);

  // Hover indicator handlers
  const handleMouseEnter = useCallback((index: number) => {
    if (!hover || tabs[index]?.disabled) return;
    
    setHoverIndex(index);
    const tabElement = tabRefs.current[index];
    const containerElement = tabsListRef.current;
    
    if (tabElement && containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
      
      if (vertical) {
        setHoverIndicatorStyle({
          left: 0,
          top: tabRect.top - containerRect.top + containerElement.scrollTop,
          width: 0,
          height: tabRect.height,
          opacity: 0.3
        });
      } else {
        setHoverIndicatorStyle({
          left: tabRect.left - containerRect.left + containerElement.scrollLeft,
          top: 0,
          width: tabRect.width,
          height: 0,
          opacity: 0.3
        });
      }
    }
  }, [hover, tabs, vertical]);

  const handleMouseLeave = useCallback(() => {
    if (!hover) return;
    setHoverIndex(null);
    setHoverIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
  }, [hover]);

  // Mouse wheel scroll handler
  const handleWheel = useCallback((e: WheelEvent) => {
    if (scrollDisable || !tabsListRef.current) return;
    
    // In horizontal mode, convert vertical wheel to horizontal scroll
    if (!vertical) {
      e.preventDefault();
      const delta = e.deltaY || e.deltaX;
      tabsListRef.current.scrollBy({
        left: delta,
        behavior: 'auto'
      });
    }
    // In vertical mode, allow natural scrolling (don't prevent default)
  }, [vertical, scrollDisable]);

  // Drag scroll state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Drag scroll handlers
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (scrollDisable || !tabsListRef.current) return;
    
    setIsDragging(true);
    const container = tabsListRef.current;
    
    if ('touches' in e) {
      // Touch event
      dragStartRef.current = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop
      };
    } else {
      // Mouse event
      dragStartRef.current = {
        x: e.pageX,
        y: e.pageY,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop
      };
    }
    
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  }, [scrollDisable]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !tabsListRef.current) return;
    
    e.preventDefault();
    const container = tabsListRef.current;
    
    let currentX: number, currentY: number;
    if ('touches' in e) {
      currentX = e.touches[0].pageX;
      currentY = e.touches[0].pageY;
    } else {
      currentX = e.pageX;
      currentY = e.pageY;
    }
    
    const deltaX = currentX - dragStartRef.current.x;
    const deltaY = currentY - dragStartRef.current.y;
    
    if (vertical) {
      container.scrollTop = dragStartRef.current.scrollTop - deltaY;
    } else {
      container.scrollLeft = dragStartRef.current.scrollLeft - deltaX;
    }
  }, [isDragging, vertical]);

  const handleDragEnd = useCallback(() => {
    if (!tabsListRef.current) return;
    
    setIsDragging(false);
    const container = tabsListRef.current;
    container.style.cursor = '';
    container.style.userSelect = '';
  }, []);

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
      
      // Update shadow visibility
      if (limitShadow) {
        setShowFirstShadow(canScrollUp);
        setShowLastShadow(canScrollDown);
      }
    } else {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
      
      // Only update opacity here, showPrev/showNext will be updated by useEffect with delay
      setPrevOpacity(canScrollLeft ? 1 : 0);
      setNextOpacity(canScrollRight ? 1 : 0);
      
      // Update shadow visibility
      if (limitShadow) {
        setShowFirstShadow(canScrollLeft);
        setShowLastShadow(canScrollRight);
      }
    }
  }, [hasNavigation, vertical, limitShadow]);

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

    let scrollEndTimer: NodeJS.Timeout;

    const handleScroll = () => {
      updateNavigationVisibility();
      updateIndicator();
      
      // Emit scroll event
      if (onScroll) {
        onScroll({
          scrollLeft: container.scrollLeft,
          scrollTop: container.scrollTop
        });
      }

      // Debounced scroll end detection
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        if (onScrollEnd) {
          onScrollEnd({
            scrollLeft: container.scrollLeft,
            scrollTop: container.scrollTop
          });
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollEndTimer);
    };
  }, [updateIndicator, updateNavigationVisibility, onScroll, onScrollEnd]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
      updateNavigationVisibility();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator, updateNavigationVisibility]);

  // Initial check on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateIndicator();
      updateNavigationVisibility();
    }, 100);
    return () => clearTimeout(timer);
  }, [updateIndicator, updateNavigationVisibility]);

  // Add wheel event listener
  useEffect(() => {
    const container = tabsListRef.current;
    if (!container || scrollDisable) return;

    container.addEventListener('wheel', handleWheel as EventListener, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel as EventListener);
  }, [handleWheel, scrollDisable]);

  // Add drag event listeners
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => handleDragMove(e);
    const handleEnd = () => handleDragEnd();

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

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
      // When not absolute, always show buttons (opacity controls visibility)
      setShowPrev(true);
      setShowNext(true);
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
      // When not absolute, always show buttons (opacity controls visibility)
      setShowNext(true);
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
    '--tab-gap': gap ? (typeof gap === 'number' ? `${gap}px` : gap) : '0',
    '--tab-justify-content': justifyContent || 'flex-start',
    '--tab-align-items': alignItems || 'center',
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
        {/* Prev Navigation Button */}
        {hasNavigation && showPrev && (
          <button
            className={`tabs-nav tabs-nav_prev ${vertical ? 'tabs-nav_vertical' : ''}`}
            onClick={handlePrevScroll}
            aria-label={vertical ? "Previous tabs (scroll up)" : "Previous tabs"}
            style={{ pointerEvents: prevOpacity === 0 ? 'none' : 'auto' }}
          >
            {vertical ? '▲' : '‹'}
          </button>
        )}

        {/* First gradient shadow */}
        {limitShadow && showFirstShadow && (
          <div className={`tabs-shadow tabs-shadow_first ${vertical ? 'tabs-shadow_vertical' : ''}`} />
        )}

        {/* Tabs List */}
        <div
          ref={tabsListRef}
          className={`tabs-header-list tabs-header-list_${variant} ${
            vertical ? 'tabs-header-list_vertical' : ''
          }`}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.value}
              ref={(el) => { tabRefs.current[index] = el; }}
              className={`tabs-header-item ${
                tab.value === activeTab ? 'tabs-header-item_active' : ''
              } ${tab.disabled ? 'tabs-header-item_disabled' : ''}`}
              onClick={(e) => {
                handleTabClick(tab.value, index);
                handleRipple(e);
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              role="tab"
              aria-selected={tab.value === activeTab}
              aria-disabled={tab.disabled}
              tabIndex={tab.disabled ? -1 : 0}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {tab.label}
            </div>
          ))}
          
          {/* Indicator */}
          <div className="tabs-header-indicator" />
          
          {/* Hover Indicator */}
          {hover && hoverIndex !== null && (
            <div 
              className="tabs-hover-indicator"
              style={{
                left: vertical ? 'auto' : `${hoverIndicatorStyle.left}px`,
                right: vertical ? 0 : 'auto',
                top: vertical ? `${hoverIndicatorStyle.top}px` : 'auto',
                bottom: vertical ? 'auto' : 0,
                width: vertical ? '2px' : `${hoverIndicatorStyle.width}px`,
                height: vertical ? `${hoverIndicatorStyle.height}px` : '2px',
                opacity: hoverIndicatorStyle.opacity
              }}
            />
          )}
        </div>

        {/* Last gradient shadow */}
        {limitShadow && showLastShadow && (
          <div className={`tabs-shadow tabs-shadow_last ${vertical ? 'tabs-shadow_vertical' : ''}`} />
        )}

        {/* Next Navigation Button */}
        {hasNavigation && showNext && (
          <button
            className={`tabs-nav tabs-nav_next ${vertical ? 'tabs-nav_vertical' : ''}`}
            onClick={handleNextScroll}
            aria-label={vertical ? "Next tabs (scroll down)" : "Next tabs"}
            style={{ pointerEvents: nextOpacity === 0 ? 'none' : 'auto' }}
          >
            {vertical ? '▼' : '›'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Tabs;
