'use client';

import { useState, useRef, useMemo, useCallback, ReactNode, CSSProperties } from 'react';
import './index.scss';

export interface VirtualScrollerProps<T = unknown> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

interface VirtualScrollerCSSProperties extends CSSProperties {
  '--virtual_scroller-height'?: string;
  '--virtual_scroller-spacer-height'?: string;
}

export function VirtualScroller<T = unknown>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  renderItem,
  className = '',
  onScroll
}: VirtualScrollerProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const { visibleStart, visibleEnd, offsetY } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    const offset = start * itemHeight;

    return {
      visibleStart: start,
      visibleEnd: end,
      offsetY: offset
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleStart, visibleEnd);
  }, [items, visibleStart, visibleEnd]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
    onScroll?.(target.scrollTop);
  }, [onScroll]);

  // CSS variables
  const cssVariables: VirtualScrollerCSSProperties = {
    '--virtual_scroller-height': `${containerHeight}px`,
    '--virtual_scroller-spacer-height': `${items.length * itemHeight}px`
  };

  return (
    <div
      ref={containerRef}
      className={`virtual_scroller ${className}`}
      style={cssVariables}
      onScroll={handleScroll}
    >
      <div className="virtual_scroller-spacer">
        <div
          className="virtual_scroller-spacer-content"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = visibleStart + index;
            return (
              <div
                key={actualIndex}
                className="virtual_scroller-spacer-content-item"
                style={{ height: `${itemHeight}px` }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VirtualScroller;
