'use client';

import { useState, useEffect, useRef, useMemo, CSSProperties } from 'react';
import './index.scss';

export interface SwitchButtonProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  checkedLabel?: string;
  icon?: string | React.ReactNode;
  checkedIcon?: string | React.ReactNode;
  disabled?: boolean;
  color?: string;
  bgColor?: string;
  checkedColor?: string;
  checkedBgColor?: string;
  radius?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SwitchButton({
  value = false,
  onChange,
  label = '',
  checkedLabel = '',
  icon = null,
  checkedIcon = null,
  disabled = false,
  color,
  bgColor,
  checkedColor,
  checkedBgColor,
  radius = '999px',
  className = '',
  children
}: SwitchButtonProps) {
  const [checked, setChecked] = useState(value);
  const [iconWidth, setIconWidth] = useState(0);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChecked(value);
  }, [value]);

  useEffect(() => {
    if (iconRef.current) {
      setIconWidth(iconRef.current.clientWidth);
    }
  }, []);

  const cssVariables = useMemo((): CSSProperties => {
    const vars: CSSProperties & Record<string, string> = {
      '--switch_button_cursor': disabled ? 'not-allowed' : 'pointer',
      '--switch_button_opacity': disabled ? '0.3' : '1',
      '--switch_button_radius': radius
    };

    const currentColor = checked ? (checkedColor || color) : color;
    const currentBgColor = checked ? (checkedBgColor || bgColor) : bgColor;

    if (currentColor) {
      vars['--switch_button_color'] = currentColor;
    }

    if (currentBgColor) {
      vars['--switch_button_bg_color'] = currentBgColor;
    }

    if (!checked) {
      vars['--switch_button_icon_left'] = 'calc(100% - 39px)';
      vars['--switch_button_label_padding_right'] = `${iconWidth}px`;
    } else {
      vars['--switch_button_icon_left'] = '8px';
      vars['--switch_button_label_padding_left'] = `${iconWidth}px`;
    }

    return vars;
  }, [
    checked,
    disabled,
    color,
    bgColor,
    checkedColor,
    checkedBgColor,
    radius,
    iconWidth
  ]);

  const displayLabel = useMemo(() => {
    if (checked && checkedLabel) {
      return checkedLabel;
    }
    return label;
  }, [checked, label, checkedLabel]);

  const displayIcon = useMemo(() => {
    if (checked && checkedIcon) {
      return checkedIcon;
    }
    return icon;
  }, [checked, icon, checkedIcon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  const renderIcon = () => {
    if (!displayIcon) return null;

    if (typeof displayIcon === 'string') {
      return <img src={displayIcon} alt="switch icon" />;
    }

    return displayIcon;
  };

  return (
    <span
      className={`switch_button ${className}`}
      style={cssVariables as CSSProperties}
    >
      <input
        className="switch_button-check"
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />

      <div ref={iconRef} className="switch_button-icon">
        {children || renderIcon()}
      </div>

      <div className="switch_button-label">
        {displayLabel && <p>{displayLabel}</p>}
      </div>
    </span>
  );
}

export default SwitchButton;
