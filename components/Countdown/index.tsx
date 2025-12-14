'use client';

import { useState, useEffect } from 'react';
import './index.scss';

export interface CountdownProps {
  initialSeconds: number;
  endSeconds?: number;
  type?: 'countdown' | 'countup';
  onStart?: () => void;
  onStep?: (current: number) => void;
  onEnd?: () => void;
  className?: string;
}

export function Countdown({
  initialSeconds,
  endSeconds = 0,
  type = 'countdown',
  onStart,
  onStep,
  onEnd,
  className = ''
}: CountdownProps) {
  const [current, setCurrent] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrent((prev) => {
        const next = type === 'countdown' ? prev - 1 : prev + 1;
        
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

    return () => clearInterval(interval);
  }, [isRunning, type, endSeconds, onStep, onEnd]);

  const start = () => {
    setIsRunning(true);
    onStart?.();
  };

  const reset = () => {
    setIsRunning(false);
    setCurrent(initialSeconds);
  };

  return (
    <div className={`countdown ${className}`}>
      <div className="countdown-display">
        <div className="countdown-number">{current}</div>
      </div>
      <div className="countdown-controls">
        <button onClick={start} disabled={isRunning}>開始</button>
        <button onClick={reset}>重置</button>
      </div>
    </div>
  );
}

export default Countdown;
