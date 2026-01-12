'use client';

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type CSSProperties
} from 'react';
import './index.scss';

const COUNTDOWN_TYPE_DOWN_VALUE = 'down';
const COUNTDOWN_TYPE_UP_VALUE = 'up';
const COUNTDOWN_TYPE_LIST = [
  COUNTDOWN_TYPE_DOWN_VALUE,
  COUNTDOWN_TYPE_UP_VALUE
];

export interface CountdownProps {
  modelValue?: number;
  countdownType?: 'down' | 'up';
  initialSeconds?: number;
  endSecond?: number;
  isCountdownStart?: boolean;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  bgColor?: string;
  color?: string;
  onUpdateModelValue?: (value: number) => void;
  onUpdateIsCountdownStart?: (value: boolean) => void;
  onCountdownStart?: () => void;
  onCountdownStep?: (value: number) => void;
  onCountdownEnd?: () => void;
}

export function Countdown({
  modelValue,
  countdownType = COUNTDOWN_TYPE_DOWN_VALUE,
  initialSeconds = 20,
  endSecond = 0,
  isCountdownStart = true,
  width = 100,
  height = 100,
  padding = 0,
  bgColor = '#fff',
  color = '#000',
  onUpdateModelValue,
  onUpdateIsCountdownStart,
  onCountdownStart,
  onCountdownStep,
  onCountdownEnd
}: CountdownProps) {
  // Initialize with initialSeconds, fallback to modelValue for compatibility
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const isInProgressRef = useRef(false);
  const hasStartedRef = useRef(false);
  const isAnimatingRef = useRef(false); // Track if countdown is in progress

  // CSS Variables
  const cssVariable = useMemo(() => {
    const safeCssVariable: Record<string, string> = {};

    if (typeof width === 'string' && width !== '') {
      safeCssVariable['--countdown_width'] = width;
    } else if (typeof width === 'number' || !isNaN(Number(width))) {
      safeCssVariable['--countdown_width'] = `${width}px`;
    }

    if (typeof height === 'string' && height !== '') {
      safeCssVariable['--countdown_height'] = height;
    } else if (typeof height === 'number' || !isNaN(Number(height))) {
      safeCssVariable['--countdown_height'] = `${height}px`;
    }

    if (typeof padding === 'string' && padding !== '') {
      safeCssVariable['--countdown_padding'] = padding;
    } else if (typeof padding === 'number' || !isNaN(Number(padding))) {
      safeCssVariable['--countdown_padding'] = `${padding}px`;
    }

    if (typeof bgColor === 'string' && bgColor !== '') {
      safeCssVariable['--countdown_bg_color'] = bgColor;
    }

    if (typeof color === 'string' && color !== '') {
      safeCssVariable['--countdown_color'] = color;
    }

    return safeCssVariable;
  }, [width, height, padding, bgColor, color]);

  // Safe countdown type
  const safeCountDownType = useMemo(() => {
    if (
      typeof countdownType !== 'string' ||
      !COUNTDOWN_TYPE_LIST.includes(countdownType)
    ) {
      return COUNTDOWN_TYPE_LIST[0];
    }
    return countdownType;
  }, [countdownType]);

  // Countdown card array
  const contdownCard = useMemo(() => {
    const safeInitialSeconds =
      typeof initialSeconds !== 'number' ? 0 : initialSeconds;
    const safeEndSecond = typeof endSecond !== 'number' ? 0 : endSecond;

    const contdownCardList: number[] = [];

    // Generate cards from 0 to initialSeconds (Nuxt logic)
    // Both modes count down from initialSeconds to endSecond
    if (safeInitialSeconds > safeEndSecond) {
      for (let start = 0; start <= safeInitialSeconds; start++) {
        contdownCardList.push(start);
      }
    }

    return contdownCardList;
  }, [initialSeconds, endSecond]);

  // Watch for prop changes (Nuxt logic)
  useEffect(() => {
    if (
      isCountdownStart === true &&
      typeof initialSeconds === 'number' &&
      Math.abs(initialSeconds - endSecond) > 0
    ) {
      setCurrentNumber(initialSeconds);
      isInProgressRef.current = true;

      // Wait for next frame to ensure DOM is ready before starting animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onUpdateIsCountdownStart?.(true);
          onCountdownStart?.();
        });
      });
    } else if (isCountdownStart === false) {
      // Reset the in-progress flag when countdown is stopped
      isInProgressRef.current = false;
    }
  }, [
    isCountdownStart,
    initialSeconds,
    endSecond,
    countdownType,
    onUpdateIsCountdownStart,
    onCountdownStart
  ]);

  // Initial mount - set ready state after component is mounted
  useEffect(() => {
    if (hasStartedRef.current) return;

    if (
      isCountdownStart === true &&
      typeof initialSeconds === 'number' &&
      Math.abs(initialSeconds - endSecond) > 0
    ) {
      setCurrentNumber(initialSeconds);
      hasStartedRef.current = true;
      isInProgressRef.current = true;

      // Wait for next frame to ensure DOM is ready before starting animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onUpdateIsCountdownStart?.(true);
          onCountdownStart?.();
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify parent of currentNumber changes
  useEffect(() => {
    if (currentNumber !== null) {
      onUpdateModelValue?.(currentNumber);
    }
  }, [currentNumber, onUpdateModelValue]);

  const handleNumberAnimationEnd = () => {
    // Prevent multiple simultaneous animation end calls
    if (isAnimatingRef.current) {
      return;
    }
    isAnimatingRef.current = true;

    requestAnimationFrame(() => {
      // Check if we've already reached the end (Nuxt logic)
      if (currentNumber === endSecond) {
        onCountdownEnd?.();
        onUpdateIsCountdownStart?.(false);
        isAnimatingRef.current = false;
        isInProgressRef.current = false;
        return;
      }

      // Calculate the next number
      let newCurrentNumber: number;

      // Both modes count down (large to small)
      // The difference is only the animation direction (countdownType)
      if (initialSeconds > endSecond || initialSeconds < endSecond) {
        newCurrentNumber = (currentNumber ?? initialSeconds) - 1;
      } else {
        // No counting needed if initialSeconds === endSecond
        isAnimatingRef.current = false;
        return;
      }

      // Update the number - this will cause React to re-render
      // and the new cardNumber will match the animation condition
      setCurrentNumber(newCurrentNumber);
      onCountdownStep?.(newCurrentNumber);

      // Release the animation lock
      isAnimatingRef.current = false;
    });
  };

  return (
    <div className="countdown" style={cssVariable as CSSProperties}>
      {safeCountDownType === COUNTDOWN_TYPE_DOWN_VALUE && (
        <div className="countdown-down_enter">
          {contdownCard.map((cardNumber) => {
            // Only render cards within ±3 range of current number (Nuxt logic)
            const shouldRender =
              currentNumber !== null &&
              cardNumber <= currentNumber + 3 &&
              cardNumber >= currentNumber - 3;

            if (!shouldRender) return null;

            return (
              <div key={cardNumber}>
                <p
                  className="countdown-down_enter-down_enter_up"
                  data-css-is-anime-start={
                    isCountdownStart === true && cardNumber >= currentNumber
                      ? 'true'
                      : 'false'
                  }
                  data-css-is-end-second={
                    cardNumber === endSecond ? 'true' : 'false'
                  }
                  style={{
                    // Down mode: up part uses cardNumber (Nuxt line 19)
                    ['--down_enter_up_z_index' as string]: cardNumber
                  }}
                  onAnimationEnd={handleNumberAnimationEnd}
                >
                  {cardNumber}
                </p>
                <p
                  className="countdown-down_enter-down_enter_down"
                  data-css-is-initial-seconds={
                    cardNumber === initialSeconds ? 'true' : 'false'
                  }
                  data-css-is-anime-start={
                    isCountdownStart === true && cardNumber >= currentNumber - 1
                      ? 'true'
                      : 'false'
                  }
                  style={{
                    // Fix: both parts use same base to prevent hybrid display
                    ['--down_enter_down_z_index' as string]:
                      contdownCard.length - cardNumber
                  }}
                >
                  {cardNumber}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {safeCountDownType === COUNTDOWN_TYPE_UP_VALUE && (
        <div className="countdown-up_leave">
          {contdownCard.map((cardNumber) => {
            // Only render cards within ±3 range of current number (Nuxt logic)
            const shouldRender =
              currentNumber !== null &&
              cardNumber <= currentNumber + 3 &&
              cardNumber >= currentNumber - 3;

            if (!shouldRender) return null;

            return (
              <div key={cardNumber}>
                <p
                  className="countdown-up_leave-up_leave_up"
                  data-css-is-initial-seconds={
                    cardNumber === initialSeconds ? 'true' : 'false'
                  }
                  data-css-is-anime-start={
                    isCountdownStart === true && cardNumber >= currentNumber - 1
                      ? 'true'
                      : 'false'
                  }
                  data-css-is-end-second={
                    cardNumber === endSecond ? 'true' : 'false'
                  }
                  data-css-card-up_leave_up={cardNumber.toString()}
                  style={{
                    // Up mode: exact Nuxt formula (line 60)
                    ['--up_leave_up_z_index' as string]:
                      contdownCard.length - cardNumber
                  }}
                >
                  {cardNumber}
                </p>
                <p
                  className="countdown-up_leave-up_leave_down"
                  data-css-is-initial-seconds={
                    cardNumber === initialSeconds ? 'true' : 'false'
                  }
                  data-css-is-anime-start={
                    isCountdownStart === true && cardNumber >= currentNumber
                      ? 'true'
                      : 'false'
                  }
                  data-css-is-end-second={
                    cardNumber === endSecond ? 'true' : 'false'
                  }
                  data-css-card-up_leave_down={cardNumber.toString()}
                  style={{
                    // Up mode: exact Nuxt formula (line 77)
                    ['--up_leave_down_z_index' as string]: cardNumber
                  }}
                  onAnimationEnd={handleNumberAnimationEnd}
                >
                  {cardNumber}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Countdown;
