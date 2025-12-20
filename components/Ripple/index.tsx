'use client';

import React, {
  useRef,
  useCallback,
  forwardRef,
  type ReactNode,
  type PointerEvent,
  type CSSProperties
} from 'react';

import '@/components/Ripple/ripple.scss';

export interface RippleProps {
  /** Whether ripple effect is enabled */
  enabled?: boolean;
  /** Custom ripple color (CSS color value) */
  color?: string;
  /** Children elements */
  children: ReactNode;
  /** Additional className */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Ripple - A component that adds Material Design-like ripple effect on click
 *
 * @example
 * ```tsx
 * <Ripple onClick={() => console.log('Clicked!')}>
 *   <button>Click me</button>
 * </Ripple>
 *
 * <Ripple color="rgba(255, 0, 0, 0.3)" enabled={isEnabled}>
 *   <div>Custom colored ripple</div>
 * </Ripple>
 * ```
 */
export const Ripple = forwardRef<HTMLDivElement, RippleProps>(
  function Ripple(props, ref) {
    const {
      enabled = true,
      color,
      children,
      className = '',
      style,
      onClick,
      ...rest
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (!enabled) return;

        const container = containerRef.current;
        if (!container) return;

        // Create ripple elements
        const rippleBlock = document.createElement('span');
        rippleBlock.classList.add('ripple-block');

        const ripple = document.createElement('span');
        ripple.classList.add('ripple-block-content');

        // Apply custom color if provided
        if (color) {
          ripple.style.setProperty('--ripple-color', color);
        }

        rippleBlock.appendChild(ripple);
        container.appendChild(rippleBlock);

        // Calculate ripple position
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Remove ripple after animation ends
        const handleAnimationEnd = () => {
          rippleBlock.remove();
        };

        ripple.addEventListener('animationend', handleAnimationEnd);
      },
      [enabled, color]
    );

    const combinedStyle: CSSProperties = {
      ...style,
      position: 'relative',
      overflow: 'hidden'
    };

    if (color) {
      (combinedStyle as Record<string, string>)['--ripple-color'] = color;
    }

    return (
      <div
        ref={(node) => {
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`ripple-container ${className}`.trim()}
        style={combinedStyle}
        onPointerDown={handlePointerDown}
        onClick={onClick}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default Ripple;
