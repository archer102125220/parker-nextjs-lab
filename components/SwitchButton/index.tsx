'use client';

import {
  useState,
  useCallback,
  useMemo,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode
} from 'react';
import './index.scss';

export interface SwitchButtonProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  checkedLabel?: string;
  icon?: string | ReactNode;
  checkedIcon?: string | ReactNode;
  disabled?: boolean;
  color?: string;
  bgColor?: string;
  checkedColor?: string;
  checkedBgColor?: string;
  radius?: string;
  className?: string;
  children?: ReactNode;
  /** Accessibility: label for unchecked state (used for aria-label) */
  offLabel?: string;
  /** Accessibility: label for checked state (used for aria-label) */
  onLabel?: string;
  /** Accessibility: explicit aria-label (overrides onLabel/offLabel) */
  ariaLabel?: string;
}

export function SwitchButton({
  value,
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
  children,
  offLabel,
  onLabel,
  ariaLabel
}: SwitchButtonProps) {
  const [internalChecked, setInternalChecked] = useState(value ?? false);
  const [iconWidth, setIconWidth] = useState(0);
  const checked = typeof value === 'boolean' ? value : internalChecked;

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

  const handleIconRef = useCallback((node: HTMLDivElement | null) => {
    const nextIconWidth = node?.clientWidth ?? 0;
    setIconWidth((currentWidth) =>
      currentWidth === nextIconWidth ? currentWidth : nextIconWidth
    );
  }, []);

  const cssVariables = useMemo((): CSSProperties => {
    const vars: CSSProperties & Record<string, string> = {
      '--switch_button_cursor': disabled ? 'not-allowed' : 'pointer',
      '--switch_button_opacity': disabled ? '0.3' : '1',
      '--switch_button_radius': radius
    };

    const currentColor = checked ? checkedColor || color : color;
    const currentBgColor = checked ? checkedBgColor || bgColor : bgColor;

    if (currentColor) {
      vars['--switch_button_color'] = currentColor;
    }

    if (currentBgColor) {
      vars['--switch_button_bg_color'] = currentBgColor;
    }

    if (!checked) {
      vars['--switch_button_icon_left'] =
        iconWidth > 0 ? `calc(100% - ${iconWidth + 8}px)` : 'calc(100% - 39px)';
      vars['--switch_button_icon_right'] = 'auto';
      vars['--switch_button_label_padding_right'] = `${iconWidth}px`;
      vars['--switch_button_label_padding_left'] = '0';
    } else {
      vars['--switch_button_icon_left'] = '8px';
      vars['--switch_button_icon_right'] = 'auto';
      vars['--switch_button_label_padding_left'] = `${iconWidth}px`;
      vars['--switch_button_label_padding_right'] = '0';
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.checked;
    if (typeof value !== 'boolean') {
      setInternalChecked(newValue);
    }
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
        aria-label={
          ariaLabel ||
          (checked
            ? onLabel || checkedLabel || 'On'
            : offLabel || label || 'Off')
        }
      />

      <div ref={handleIconRef} className="switch_button-icon">
        {children || renderIcon()}
      </div>

      <div className="switch_button-label">
        {displayLabel && <p>{displayLabel}</p>}
      </div>
    </span>
  );
}

export default SwitchButton;
