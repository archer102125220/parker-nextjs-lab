'use client';

import { useState, useEffect, useRef, useMemo, CSSProperties, ReactNode } from 'react';
import './index.scss';

export interface SelectorOption {
  [key: string]: any;
  label?: string;
  value?: any;
}

export interface SelectorProps {
  value?: any;
  onChange?: (value: any, index: number) => void;
  optionList?: SelectorOption[];
  valueKey?: string;
  displayKey?: string;
  loading?: boolean;
  hasTransition?: boolean;
  hasShadow?: boolean;
  optionListTop?: string | number;
  optionListLeft?: string | number;
  optionListRight?: string | number;
  optionListWidth?: string | number;
  className?: string;
  prefixSlot?: (isOpen: boolean) => ReactNode;
  suffixSlot?: (isOpen: boolean) => ReactNode;
  optionSlot?: (option: SelectorOption, index: number, selected: boolean) => ReactNode;
  emptyText?: string;
}

export function Selector({
  value,
  onChange,
  optionList = [],
  valueKey,
  displayKey,
  loading = false,
  hasTransition = true,
  hasShadow = false,
  optionListTop,
  optionListLeft,
  optionListRight,
  optionListWidth,
  className = '',
  prefixSlot,
  suffixSlot,
  optionSlot,
  emptyText = '暫無資料'
}: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [listHeight, setListHeight] = useState<number | null>(null);
  const optionListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (optionListRef.current) {
        setListHeight(optionListRef.current.scrollHeight);
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    window.addEventListener('orientationchange', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
      window.removeEventListener('orientationchange', calculateHeight);
    };
  }, [optionList]);

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (loading) setIsOpen(false);
  }, [loading]);

  const cssVariables = useMemo((): CSSProperties => {
    const vars: CSSProperties & Record<string, string> = {};

    if (typeof listHeight === 'number') {
      if (typeof optionListTop === 'number') {
        vars['--select_option_list_top'] = `calc(100% + ${optionListTop}px)`;
      } else if (typeof optionListTop === 'string' && optionListTop !== '') {
        vars['--select_option_list_top'] = `calc(100% + ${optionListTop})`;
      } else {
        vars['--select_option_list_top'] = '100%';
      }

      vars['--select_option_list_heigth'] = isOpen ? `${listHeight}px` : '0px';
    }

    if (isOpen) {
      vars['--selector_arrow_icon'] = 'rotate(180deg)';
      if (!hasShadow) {
        vars['--select_option_list_border_radius'] = '4px';
        vars['--select_option_list_border'] = '1px solid #d5d5d5';
      }
    } else {
      vars['--selector_arrow_icon'] = 'rotate(0deg)';
    }

    if (hasShadow) {
      vars['--select_option_list_shadow'] = '-1px 3px 6px 0px #00000033';
    }

    if (hasTransition) {
      vars['--select_suffix_arrow_icon_transition'] = 'transform 0.3s ease-in-out';
      vars['--select_option_list_transition'] = 'height 0.3s ease-in-out';
      vars['--select_option_list_item_selsected_transition'] = 'color, background-color 0.4s ease-in-out';
    }

    if (typeof optionListLeft === 'number') {
      vars['--select_option_list_left'] = `${optionListLeft}px`;
    } else if (typeof optionListLeft === 'string') {
      vars['--select_option_list_left'] = optionListLeft;
    }

    if (typeof optionListRight === 'number') {
      vars['--select_option_list_right'] = `${optionListRight}px`;
    } else if (typeof optionListRight === 'string') {
      vars['--select_option_list_right'] = optionListRight;
    }

    if (typeof optionListWidth === 'number') {
      vars['--select_option_list_width'] = `${optionListWidth}px`;
    } else if (typeof optionListWidth === 'string') {
      vars['--select_option_list_width'] = optionListWidth;
    }

    return vars;
  }, [listHeight, isOpen, hasShadow, hasTransition, optionListTop, optionListLeft, optionListRight, optionListWidth]);

  const displayValue = useMemo(() => {
    const currentOption = optionList.find((option) => {
      const optionValue = valueKey ? option[valueKey] : (option.value ?? option);
      const currentValue = valueKey && typeof value === 'object' ? value[valueKey] : value;
      return optionValue === currentValue;
    });

    if (currentOption) {
      return displayKey ? currentOption[displayKey] : (currentOption.label ?? currentOption);
    }

    if (typeof value === 'object' && value !== null) {
      return displayKey ? value[displayKey] : (value.label ?? '');
    }

    return value;
  }, [value, optionList, valueKey, displayKey]);

  const isSelected = (option: SelectorOption) => {
    const optionValue = valueKey ? option[valueKey] : (option.value ?? option);
    const currentValue = valueKey && typeof value === 'object' ? value[valueKey] : value;
    return currentValue === optionValue;
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };

  const handleChange = (option: SelectorOption, index: number) => {
    const newValue = valueKey ? option[valueKey] : (option.value ?? option);
    if (value !== newValue) {
      onChange?.(valueKey ? newValue : option, index);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={`selector ${className}`}
      style={cssVariables as CSSProperties}
      onClick={handleToggle}
    >
      <div className="selector-prefix">
        {prefixSlot?.(isOpen)}
      </div>

      <div className="selector-current_value">
        <p className="selector-current_value-label">{displayValue}</p>
      </div>

      <div ref={optionListRef} className="selector-option_list">
        {optionList.map((option, index) => (
          <div
            key={index}
            className={`selector-option_list-item ${isSelected(option) ? 'selector-option_list-item_selsected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleChange(option, index);
            }}
          >
            {optionSlot ? (
              optionSlot(option, index, isSelected(option))
            ) : (
              <p>{displayKey ? option[displayKey] : (option.label ?? option)}</p>
            )}
          </div>
        ))}
        {optionList.length === 0 && (
          <div className="selector-option_list-item_empty">
            <p>{emptyText}</p>
          </div>
        )}
      </div>

      <div className="selector-suffix">
        {suffixSlot ? (
          suffixSlot(isOpen)
        ) : (
          <img
            className="selector-suffix-arrow_icon"
            src="/img/icon/selector/down-arrow-icon.svg"
            alt="arrow"
          />
        )}
      </div>
    </div>
  );
}

export default Selector;
