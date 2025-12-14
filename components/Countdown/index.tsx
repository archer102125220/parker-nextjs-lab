'use client';

import { useState, useEffect, useRef } from 'react';
import './index.scss';

export interface CountdownProps {
  initialSeconds: number;
  endSeconds?: number;
  type?: 'countdown' | 'countup';
  width?: number | string;
  height?: number | string;
  fontSize?: number | string;
  color?: string;
  bgColor?: string;
  onStart?: () => void;
  onStep?: (current: number) => void;
  onEnd?: () => void;
  className?: string;
}

export function Countdown({
  initialSeconds,
  endSeconds = 0,
  type = 'countdown',
  width = 120,
  height = 160,
  fontSize = 72,
  color = '#fff',
  bgColor = '#667eea',
  onStart,
  onStep,
  onEnd,
  className = ''
}: CountdownProps) {
  const [current, setCurrent] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [prevNumber, setPrevNumber] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = type === 'countdown' ? prev - 1 : prev + 1;
        
        setPrevNumber(prev);
        setIsFlipping(true);
        
        setTimeout(() => setIsFlipping(false), 600);
        
        onStep?.(next);
        
        const isEnd = type === 'countdown' 
          ? next <= endSeconds 
          : next >= endSeconds;
          
        if (isEnd) {
          setIsRunning(false);
          onEnd?.();
          return endSeconds;
        }
        
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, type, endSeconds, onStep, onEnd]);

  const start = () => {
    setIsRunning(true);
    onStart?.();
  };

  const reset = () => {
    setIsRunning(false);
    setCurrent(initialSeconds);
    setPrevNumber(initialSeconds);
    setIsFlipping(false);
  };

  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const fontSizeValue = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;

  return (
    <div className={`countdown ${className}`}>
      <div
        className="countdown-flip-card"
        style={{
          '--countdown-width': widthValue,
          '--countdown-height': heightValue,
          '--countdown-font-size': fontSizeValue,
          '--countdown-color': color,
          '--countdown-bg-color': bgColor
        } as React.CSSProperties}
      >
        {/* Upper half - shows current number */}
        <div className="countdown-flip-card-upper">
          <div className="countdown-flip-card-number">{current}</div>
        </div>

        {/* Lower half - shows current number */}
        <div className="countdown-flip-card-lower">
          <div className="countdown-flip-card-number">{current}</div>
        </div>

        {/* Flip animation - upper part */}
        {isFlipping && (
          <div className={`countdown-flip-card-flip countdown-flip-card-flip-upper ${type === 'countdown' ? 'flip-down' : 'flip-up'}`}>
            <div className="countdown-flip-card-number">{prevNumber}</div>
          </div>
        )}

        {/* Flip animation - lower part */}
        {isFlipping && (
          <div className={`countdown-flip-card-flip countdown-flip-card-flip-lower ${type === 'countdown' ? 'flip-down' : 'flip-up'}`}>
            <div className="countdown-flip-card-number">{current}</div>
          </div>
        )}

        {/* Center line */}
        <div className="countdown-flip-card-line" />
      </div>

      <div className="countdown-controls">
        <button onClick={start} disabled={isRunning}>
          {isRunning ? '進行中' : '開始'}
        </button>
        <button onClick={reset}>重置</button>
      </div>
    </div>
  );
}

export default Countdown;
