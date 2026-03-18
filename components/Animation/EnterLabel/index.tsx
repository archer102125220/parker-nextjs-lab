'use client';

import {
  useState,
  useEffect,
  useEffectEvent,
  useRef,
  type ElementType,
  type CSSProperties
} from 'react';
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
  speed = 10,
  value = false,
  animationEnd = false,
  onValueChange,
  onAnimationEndChange,
  className = ''
}: EnterLabelProps) {
  const [enterLabel, setEnterLabel] = useState('');
  const [isAnimating, setIsAnimating] = useState(value);
  const [isAnimationEnd, setIsAnimationEnd] = useState(animationEnd);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

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

  const clearScheduledAnimation = () => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const handleEnterLabel = useEffectEvent(() => {
    const targetLabel = label;
    const targetLength = targetLabel.length;
    const currentRevealed = revealedCharsRef.current;

    // All characters revealed - stop animation
    if (currentRevealed >= targetLength) {
      setEnterLabel(targetLabel);
      setIsAnimationEnd(true);
      onAnimationEndChange?.(true);
      clearScheduledAnimation();
      return;
    }

    // Build the display string
    let displayString = '';
    const randomLenLower = randomLen.toLowerCase();

    // Add already revealed characters (from label)
    for (let i = 0; i < currentRevealed; i++) {
      displayString += targetLabel[i];
    }

    // Add one random character for the position being revealed
    if (currentRevealed < targetLength) {
      if (randomLenLower.includes('zh')) {
        displayString += generateRandomChineseCharacter();
      } else {
        displayString += getRandomUppercaseLetter();
      }
    }

    // Update display
    setEnterLabel(displayString);

    // Increment iteration count
    iterationCountRef.current++;

    // After enough iterations, reveal the real character
    if (iterationCountRef.current >= maxIterationsPerChar) {
      revealedCharsRef.current++;
      iterationCountRef.current = 0;
    }
  });

  // Watch value changes
  useEffect(() => {
    if (isAnimating) {
      clearScheduledAnimation();
      revealedCharsRef.current = 0;
      iterationCountRef.current = 0;
      setEnterLabel('');
      setIsAnimationEnd(false);
      onAnimationEndChange?.(false);
      intervalRef.current = setInterval(() => {
        handleEnterLabel();
      }, Math.max(1, Math.floor(speed / maxIterationsPerChar)));
    }

    return () => {
      clearScheduledAnimation();
    };
  }, [isAnimating, label, randomLen, speed, onAnimationEndChange]);

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
      clearScheduledAnimation();
      setEnterLabel(label);
      setIsAnimationEnd(true);
    } else if (autoStart || value) {
      if (value !== true) {
        setIsAnimating(true);
        onValueChange?.(true);
      }
    }
  }, [animationEnd, autoStart, value, label, onValueChange]);

  const cssVariables: EnterLabelCSSProperties = {
    '--animation_enter_label_anime':
      isAnimating && !isAnimationEnd ? 'var(--enter_label_anime)' : undefined
  };

  return (
    <TagName
      className={`animation_enter_label ${className}`}
      style={cssVariables}
    >
      {enterLabel}
    </TagName>
  );
}

export default EnterLabel;
