'use client';

import { useState, useEffect, useMemo } from 'react';
import Selector from '../Selector';
import PHONE_AREA_CODE, { CountryCode } from '@/assets/phoneCountryCode';
import './index.scss';

export interface PhoneInputValue {
  countryCode: string;
  countryName: string;
  phoneCode: string;
  phoneNumber: string;
  fullNumber: string;
}

export interface PhoneInputProps {
  value?: string | PhoneInputValue;
  onChange?: (value: PhoneInputValue | string) => void;
  onValidate?: (result: { isValid: boolean; error: string }) => void;
  defaultCountryCode?: string;
  placeholder?: string;
  returnObject?: boolean;
  validate?: boolean;
  validateOnInput?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  onValidate,
  defaultCountryCode = 'TW',
  placeholder = '請輸入電話號碼',
  returnObject = false,
  validate = true,
  validateOnInput = false,
  disabled = false,
  className = ''
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showError, setShowError] = useState(false);

  // Merge countries with same phone code
  const countryList = useMemo(() => {
    const phoneCodeMap = new Map<string, CountryCode & { countryNames: string[] }>();

    PHONE_AREA_CODE.forEach((country) => {
      if (!phoneCodeMap.has(country.phoneCode)) {
        phoneCodeMap.set(country.phoneCode, {
          ...country,
          countryNames: [country.countryName]
        });
      } else {
        const existing = phoneCodeMap.get(country.phoneCode)!;
        existing.countryNames.push(country.countryName);
        existing.countryName = existing.countryNames.join(' / ');
      }
    });

    return Array.from(phoneCodeMap.values());
  }, []);

  // Initialize country
  useEffect(() => {
    const defaultCountry = countryList.find(
      (c) => c.countryCode === defaultCountryCode
    );
    setSelectedCountry(defaultCountry || countryList[0]);
  }, [defaultCountryCode, countryList]);

  // Parse value
  useEffect(() => {
    if (!value) {
      setPhoneNumber('');
      return;
    }

    if (typeof value === 'object') {
      if (value.countryCode) {
        const country = countryList.find((c) => c.countryCode === value.countryCode);
        if (country) setSelectedCountry(country);
      }
      setPhoneNumber(value.phoneNumber || '');
    } else if (typeof value === 'string' && value.startsWith('+')) {
      // Parse +886912345678 format
      const numberPart = value.substring(1);
      const sortedCountries = [...countryList].sort(
        (a, b) => b.phoneCode.length - a.phoneCode.length
      );

      for (const country of sortedCountries) {
        if (numberPart.startsWith(country.phoneCode)) {
          setSelectedCountry(country);
          setPhoneNumber(numberPart.substring(country.phoneCode.length));
          break;
        }
      }
    } else {
      setPhoneNumber(String(value));
    }
  }, [value, countryList]);

  const validatePhoneNumber = () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      setValidationError('');
      onValidate?.({ isValid: true, error: '' });
      return true;
    }

    // Basic validation: check if it's a valid phone number format
    const cleaned = phoneNumber.replace(/[\s\-()]/g, '');
    if (!/^\d{7,15}$/.test(cleaned)) {
      const error = '請輸入有效的電話號碼';
      setValidationError(error);
      onValidate?.({ isValid: false, error });
      return false;
    }

    setValidationError('');
    onValidate?.({ isValid: true, error: '' });
    return true;
  };

  const emitValue = () => {
    const fullNumber = `+${selectedCountry?.phoneCode || ''}${phoneNumber}`;

    if (returnObject) {
      const valueObj: PhoneInputValue = {
        countryCode: selectedCountry?.countryCode || '',
        countryName: selectedCountry?.countryName || '',
        phoneCode: selectedCountry?.phoneCode || '',
        phoneNumber,
        fullNumber
      };
      onChange?.(valueObj);
    } else {
      onChange?.(fullNumber);
    }
  };

  const handleCountryChange = (newCountryCode: string) => {
    const country = countryList.find((c) => c.countryCode === newCountryCode);
    if (country) {
      setSelectedCountry(country);
      emitValue();
    }
  };

  const handlePhoneNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^\d\s\-()]/g, '');
    setPhoneNumber(newValue);

    if (validate && validateOnInput) {
      validatePhoneNumber();
    } else {
      setShowError(false);
    }

    emitValue();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (validate) {
      validatePhoneNumber();
      setShowError(true);
    }
  };

  const hasError = validationError && showError;
  const borderColor = hasError ? '#dc3545' : isFocused ? '#2c64e3' : '#d5d5d5';
  const boxShadow = hasError
    ? '0 0 0 2px rgba(220, 53, 69, 0.1)'
    : isFocused
    ? '0 0 0 2px rgba(44, 100, 227, 0.1)'
    : 'none';

  return (
    <div className={`phone_input ${className}`}>
      <div
        className="phone_input-container"
        style={{
          '--phone-input-border-color': borderColor,
          '--phone-input-box-shadow': boxShadow
        } as React.CSSProperties}
      >
        <Selector
          value={selectedCountry?.countryCode}
          onChange={handleCountryChange}
          optionList={countryList}
          valueKey="countryCode"
          displayKey="phoneCode"
          hasShadow={true}
          hasTransition={true}
          optionListWidth="280px"
          className="phone_input-country_selector"
          prefixSlot={() => (
            <div className="phone_input-country_selector-flag">
              <span className={`fi fi-${selectedCountry?.countryCode?.toLowerCase() || 'tw'}`} />
            </div>
          )}
          suffixSlot={() => <span className="phone_input-country_selector-code">+{selectedCountry?.phoneCode || '886'}</span>}
          optionSlot={(option, index, selected) => (
            <div className="phone_input-country_selector-option">
              <span className={`fi fi-${option.countryCode?.toLowerCase()} phone_input-country_selector-option-flag`} />
              <span className="phone_input-country_selector-option-name">{option.countryName}</span>
              <span className={`phone_input-country_selector-option-code ${selected ? 'selected' : ''}`}>
                +{option.phoneCode}
              </span>
            </div>
          )}
        />

        <div className="phone_input-divider" />

        <div className="phone_input-number">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className="phone_input-number-field"
          />
        </div>
      </div>

      {hasError && (
        <div className="phone_input-error">
          {validationError}
        </div>
      )}
    </div>
  );
}

export default PhoneInput;
