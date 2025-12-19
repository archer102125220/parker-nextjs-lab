'use client';

import { useState, useEffect, useRef, useCallback, ElementType, CSSProperties } from 'react';
import './index.scss';

export interface EnterLabelProps {
  tagName?: ElementType;
  randomLen?: 'en' | 'zh' | 'en-zh';
  autoStart?: boolean;
  label: string;
  speed?: number;
  value?: boolean;
  animationEnd?: boolean;
  onValueChange?: (value: boolean) => void;
  onAnimationEndChange?: (animationEnd: boolean) => void;
  className?: string;
}

interface EnterLabelCSSProperties extends CSSProperties {
  '--animation_enter_label_anime'?: string;
}

export function EnterLabel({
  tagName: TagName = 'p',
  randomLen = 'en',
  autoStart = true,
  label,
  speed = 50,
  value = false,
  animationEnd = false,
  onValueChange,
  onAnimationEndChange,
  className = ''
}: EnterLabelProps) {
  const [enterLabel, setEnterLabel] = useState('');
  const [isAnimating, setIsAnimating] = useState(value);
  const [isAnimationEnd, setIsAnimationEnd] = useState(animationEnd);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Generate random uppercase letter (A-Z)
  const getRandomUppercaseLetter = (): string => {
    const randomAscii = Math.floor(Math.random() * 26) + 65;
    return String.fromCharCode(randomAscii);
  };

  // Generate random Chinese character
  const generateRandomChineseCharacter = (): string => {
    const randomCodePoint =
      Math.floor(Math.random() * (0x9fff - 0x4e00 + 1)) + 0x4e00;
    return String.fromCodePoint(randomCodePoint);
  };

  const revealedCharsRef = useRef(0); // Track how many characters have been revealed
  const iterationCountRef = useRef(0); // Track iterations for current character
  const maxIterationsPerChar = 5; // Number of random chars to show before revealing real char
  const handleEnterLabelRef = useRef<(() => void) | undefined>(undefined);

  const handleEnterLabel = useCallback(() => {
    setEnterLabel((currentLabel) => {
      const targetLength = label.length;
      const currentRevealed = revealedCharsRef.current;

      // All characters revealed
      if (currentRevealed >= targetLength) {
        if (currentLabel !== label) {
          setIsAnimationEnd(true);
          onAnimationEndChange?.(true);
          return label;
        }
        return currentLabel;
      }

      // Build the display string
      let displayString = '';
      const randomLenLower = randomLen.toLowerCase();

      // Add already revealed characters (from label)
      for (let i = 0; i < currentRevealed; i++) {
        displayString += label[i];
      }

      // Add one random character for the position being revealed
      if (currentRevealed < targetLength) {
        if (randomLenLower.includes('zh')) {
          displayString += generateRandomChineseCharacter();
        } else {
          displayString += getRandomUppercaseLetter();
        }
      }

      // Increment iteration count
      iterationCountRef.current++;

      // After enough iterations, reveal the real character
      if (iterationCountRef.current >= maxIterationsPerChar) {
        revealedCharsRef.current++;
        iterationCountRef.current = 0;
      }

      // Schedule next frame
      timeoutRef.current = setTimeout(() => {
        animationFrameRef.current = window.requestAnimationFrame(() => {
          handleEnterLabelRef.current?.();
        });
      }, speed);

      return displayString;
    });
  }, [label, randomLen, speed, onAnimationEndChange]);

  // Update ref when callback changes
  useEffect(() => {
    handleEnterLabelRef.current = handleEnterLabel;
  }, [handleEnterLabel]);

  // Watch value changes
  useEffect(() => {
    if (isAnimating) {
      setEnterLabel('');
      setIsAnimationEnd(false);
      onAnimationEndChange?.(false);
      revealedCharsRef.current = 0;
      iterationCountRef.current = 0;
      handleEnterLabel();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAnimating, label, handleEnterLabel, onAnimationEndChange]);

  // Watch animationEnd changes
  useEffect(() => {
    if (isAnimationEnd) {
      setIsAnimating(true);
      onValueChange?.(true);
      setEnterLabel(label);
    }
  }, [isAnimationEnd, label, onValueChange]);

  // Handle controlled value prop
  useEffect(() => {
    setIsAnimating(value);
  }, [value]);

  // Auto start on mount
  useEffect(() => {
    if (animationEnd) {
      setEnterLabel(label);
    } else if (autoStart || value) {
      if (value) {
        handleEnterLabel();
      } else {
        setIsAnimating(true);
        onValueChange?.(true);
      }
    }
  }, [animationEnd, autoStart, value, label, handleEnterLabel, onValueChange]);

  const cssVariables: EnterLabelCSSProperties = {
    '--animation_enter_label_anime':
      isAnimating && !isAnimationEnd ? 'var(--enter_label_anime)' : undefined
  };

  return (
    <TagName className={`animation_enter_label ${className}`} style={cssVariables}>
      {enterLabel}
    </TagName>
  );
}

export default EnterLabel;
