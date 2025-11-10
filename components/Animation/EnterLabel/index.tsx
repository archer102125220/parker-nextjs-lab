'use client';
import type { ElementType, CSSProperties } from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';

import '@/components/Animation/EnterLabel/enter_label.scss';

interface EnterLabelCssVariableType extends CSSProperties {
  '--animation_enter_label_anime'?: string;
}

export type updateValueType = (newValue: boolean) => void;
export type updateAnimationEndType = (newValue: boolean) => void;

export interface EnterLabelPropsType {
  value: boolean;
  animationEnd: boolean;

  tagName?: ElementType;
  randomLen?: string;
  autoStart?: boolean;
  label?: string;
  speed?: number;

  change?: updateValueType;
  updateValue?: updateValueType;
  updateAnimationEnd?: updateAnimationEndType;
}

export function EnterLabel(props: EnterLabelPropsType) {
  const {
    value = false,
    animationEnd = false,

    tagName: TagName = 'p',
    randomLen = 'en',
    autoStart = true,
    label = '',
    speed = 50,

    change,
    updateValue,
    updateAnimationEnd
  } = props;

  const [enterLabel, setEnterLabel] = useState<string>('');

  const cssVariable = useMemo<EnterLabelCssVariableType>(
    function () {
      const safeCssVariable: EnterLabelCssVariableType = {};

      if (value === true && animationEnd === false) {
        safeCssVariable['--animation_enter_label_anime'] =
          'var(--enter_label_anime)';
      }

      return safeCssVariable;
    },
    [value, animationEnd]
  );

  const getRandomUppercaseLetter = useCallback(function () {
    // 隨機生成一個 65-90 之間的數字（A-Z 的 ASCII 碼範圍）
    const randomAscii = Math.floor(Math.random() * 26) + 65;

    // Math.random() 會產生 0 (包含) 到 1 (不包含) 之間的隨機小數
    // 因此，我們乘以 94 (126 - 33 + 1) 再加上 33，就能得到 33 到 126 之間的隨機整數
    // const randomAscii = Math.floor(Math.random() * 94) + 33;

    return String.fromCharCode(randomAscii);
  }, []);

  const generateRandomChineseCharacter = useCallback(function () {
    // 中文常用字的 Unicode 範圍
    // const chineseCharRange = '\u4E00-\u9FFF';

    // 隨機生成一個 Unicode 碼點
    const randomCodePoint =
      Math.floor(Math.random() * (0x9fff - 0x4e00 + 1)) + 0x4e00;

    // 將 Unicode 碼點轉換為字符
    return String.fromCodePoint(randomCodePoint);
  }, []);

  const handleEnterLabel = useCallback(
    function () {
      if (enterLabel.length <= label.length) {
        const safeRandomLen = randomLen || '';
        const randomLenLowerCase = safeRandomLen.toLowerCase();
        let randomString = '';

        for (let i = 0; i <= enterLabel.length + 1; i++) {
          if (randomLenLowerCase.includes('zh')) {
            randomString += generateRandomChineseCharacter();
          } else {
            randomString += getRandomUppercaseLetter();
          }
        }

        setEnterLabel(randomString);
      } else {
        setEnterLabel(label);

        if (typeof updateAnimationEnd === 'function') {
          updateAnimationEnd(true);
        }
      }
    },
    [
      enterLabel,
      label,
      randomLen,
      getRandomUppercaseLetter,
      generateRandomChineseCharacter,
      updateAnimationEnd
    ]
  );

  useEffect(
    function () {
      if (value === true) {
        // setEnterLabel('');

        if (typeof updateAnimationEnd === 'function') {
          updateAnimationEnd(false);
        }

        window.requestAnimationFrame(handleEnterLabel);
      }
    },
    [value, label, updateAnimationEnd, handleEnterLabel]
  );

  useEffect(
    function () {
      setTimeout(() => window.requestAnimationFrame(handleEnterLabel), speed);
    },
    [enterLabel, handleEnterLabel, speed]
  );

  useEffect(
    function () {
      if (animationEnd === true) {
        if (typeof updateValue === 'function') {
          updateValue(true);
        }
        if (typeof change === 'function') {
          change(true);
        }
        window.requestAnimationFrame(() => setEnterLabel(label));
      }
    },
    [animationEnd, updateValue, change, label]
  );

  return (
    <TagName class="animation_enter_label" style={cssVariable}>
      {enterLabel}
    </TagName>
  );
}

export default EnterLabel;
