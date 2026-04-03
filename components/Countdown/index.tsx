'use client';

import {
  useState,
  useEffect,
  useLayoutEffect,
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
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const isInProgressRef = useRef(false);
  const isAnimatingRef = useRef(false); // Track if countdown is in progress
  const startConfigRef = useRef('');
  const onUpdateIsCountdownStartRef = useRef(onUpdateIsCountdownStart);
  const onCountdownStartRef = useRef(onCountdownStart);
  const onCountdownStepRef = useRef(onCountdownStep);
  const onCountdownEndRef = useRef(onCountdownEnd);
  const safeModelValue =
    typeof modelValue === 'number' && Number.isFinite(modelValue)
      ? modelValue
      : null;
  const isModelValueControlled = safeModelValue !== null;
  const safeInitialSeconds =
    typeof initialSeconds === 'number' && Number.isFinite(initialSeconds)
      ? initialSeconds
      : 0;
  const safeEndSecond =
    typeof endSecond === 'number' && Number.isFinite(endSecond) ? endSecond : 0;
  const startNumber =
    isModelValueControlled === true ? safeModelValue : safeInitialSeconds;
  const hasCountdownRange = Math.abs(safeInitialSeconds - safeEndSecond) > 0;

  // CSS Variables
  const cssVariable = useMemo(() => {
    const safeCssVariable: Record<string, string> = {};

    if (typeof width === 'string' && width !== '') {
      safeCssVariable['--countdown_width'] = width;
    } else if (typeof width === 'number' && Number.isFinite(width)) {
      safeCssVariable['--countdown_width'] = `${width}px`;
    }

    if (typeof height === 'string' && height !== '') {
      safeCssVariable['--countdown_height'] = height;
    } else if (typeof height === 'number' && Number.isFinite(height)) {
      safeCssVariable['--countdown_height'] = `${height}px`;
    }

    if (typeof padding === 'string' && padding !== '') {
      safeCssVariable['--countdown_padding'] = padding;
    } else if (typeof padding === 'number' && Number.isFinite(padding)) {
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
  const safeCountDownType =
    typeof countdownType === 'string' &&
    COUNTDOWN_TYPE_LIST.includes(countdownType)
      ? countdownType
      : COUNTDOWN_TYPE_LIST[0];

  // Countdown card array
  const contdownCard = useMemo(() => {
    const contdownCardList: number[] = [];
    const safeCardUpperBound = Math.max(startNumber, safeInitialSeconds);

    // Generate cards from 0 to initialSeconds (Nuxt logic)
    // Both modes count down from initialSeconds to endSecond
    if (safeCardUpperBound > safeEndSecond) {
      for (let start = 0; start <= safeCardUpperBound; start++) {
        contdownCardList.push(start);
      }
    }

    return contdownCardList;
  }, [safeEndSecond, safeInitialSeconds, startNumber]);

  useLayoutEffect(() => {
    onUpdateIsCountdownStartRef.current = onUpdateIsCountdownStart;
    onCountdownStartRef.current = onCountdownStart;
    onCountdownStepRef.current = onCountdownStep;
    onCountdownEndRef.current = onCountdownEnd;
  }, [
    onCountdownEnd,
    onCountdownStart,
    onCountdownStep,
    onUpdateIsCountdownStart
  ]);

  useEffect(() => {
    if (isModelValueControlled === false || currentNumber === safeModelValue) {
      return;
    }

    setCurrentNumber(safeModelValue);
  }, [currentNumber, isModelValueControlled, safeModelValue]);

  useEffect(() => {
    if (isCountdownStart !== true || hasCountdownRange === false) {
      isInProgressRef.current = false;
      startConfigRef.current = '';

      return;
    }

    const nextStartConfig = [
      safeCountDownType,
      startNumber,
      safeEndSecond
    ].join(':');

    if (
      startConfigRef.current === nextStartConfig &&
      isInProgressRef.current === true
    ) {
      return;
    }

    startConfigRef.current = nextStartConfig;
    setCurrentNumber(startNumber);
    isInProgressRef.current = true;
    isAnimatingRef.current = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onUpdateIsCountdownStartRef.current?.(true);
        onCountdownStartRef.current?.();
      });
    });
  }, [
    hasCountdownRange,
    isCountdownStart,
    safeCountDownType,
    safeEndSecond,
    startNumber
  ]);

  // Notify parent of currentNumber changes
  useEffect(() => {
    if (currentNumber !== null) {
      onUpdateModelValue?.(currentNumber);
    }
  }, [currentNumber, onUpdateModelValue]);

  const handleNumberAnimationEnd = () => {
    if (isInProgressRef.current === false || currentNumber === null) {
      return;
    }

    // Prevent multiple simultaneous animation end calls
    if (isAnimatingRef.current) {
      return;
    }
    isAnimatingRef.current = true;

    requestAnimationFrame(() => {
      // Check if we've already reached the end (Nuxt logic)
      if (currentNumber === safeEndSecond) {
        onCountdownEndRef.current?.();
        onUpdateIsCountdownStartRef.current?.(false);
        isAnimatingRef.current = false;
        isInProgressRef.current = false;
        startConfigRef.current = '';
        return;
      }

      // Calculate the next number
      // Both modes count down (large to small)
      // The difference is only the animation direction (countdownType)
      if (hasCountdownRange === false) {
        // No counting needed if initialSeconds === endSecond
        isAnimatingRef.current = false;
        return;
      }
      const newCurrentNumber = currentNumber - 1;

      // Update the number - this will cause React to re-render
      // and the new cardNumber will match the animation condition
      setCurrentNumber(newCurrentNumber);
      onCountdownStepRef.current?.(newCurrentNumber);

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
                    cardNumber === safeEndSecond ? 'true' : 'false'
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
                    cardNumber === safeInitialSeconds ? 'true' : 'false'
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
                    cardNumber === safeInitialSeconds ? 'true' : 'false'
                  }
                  data-css-is-anime-start={
                    isCountdownStart === true && cardNumber >= currentNumber - 1
                      ? 'true'
                      : 'false'
                  }
                  data-css-is-end-second={
                    cardNumber === safeEndSecond ? 'true' : 'false'
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
                    cardNumber === safeInitialSeconds ? 'true' : 'false'
                  }
                  data-css-is-anime-start={
                    isCountdownStart === true && cardNumber >= currentNumber
                      ? 'true'
                      : 'false'
                  }
                  data-css-is-end-second={
                    cardNumber === safeEndSecond ? 'true' : 'false'
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
