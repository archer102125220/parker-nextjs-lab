'use client';

import { useState, useCallback, ChangeEvent, FocusEvent, CSSProperties } from 'react';
import './index.scss';

export interface EnterLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel';
  placeholder?: string;
  className?: string;
  required?: boolean;
  autoComplete?: string;
}

interface EnterLabelCSSProperties extends CSSProperties {
  '--enter_label_error_color'?: string;
}

export function EnterLabel({
  label,
  value,
  onChange,
  error,
  disabled = false,
  type = 'text',
  placeholder = '',
  className = '',
  required = false,
  autoComplete
}: EnterLabelProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value && value.length > 0;
  const isActive = isFocused || hasValue;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
  }, []);

  const cssVariables: EnterLabelCSSProperties = {
    '--enter_label_error_color': error ? '#f44336' : undefined
  };

  return (
    <div
      className={`enter_label ${className}`}
      css-focused={isFocused ? 'true' : 'false'}
      css-has-value={hasValue ? 'true' : 'false'}
      css-has-error={error ? 'true' : 'false'}
      css-disabled={disabled ? 'true' : 'false'}
      style={cssVariables}
    >
      <label className="enter_label-label">
        {label}
        {required && <span className="enter_label-required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={isActive ? placeholder : ''}
        className="enter_label-input"
        autoComplete={autoComplete}
      />
      {error && <span className="enter_label-error">{error}</span>}
    </div>
  );
}

export default EnterLabel;
