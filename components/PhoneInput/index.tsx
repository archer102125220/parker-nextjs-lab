'use client';

import { useReducer, useEffect, useMemo, useCallback } from 'react';
import Selector from '../Selector';
import PHONE_AREA_CODE, { type CountryCode } from '@/assets/phoneCountryCode';
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

// ---- Reducer ----
type PhoneInputState = {
  selectedCountry: CountryCode | null;
  phoneNumber: string;
  isFocused: boolean;
  validationError: string;
  showError: boolean;
};

type PhoneInputAction =
  | { type: 'SET_COUNTRY'; payload: CountryCode }
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_FOCUSED'; payload: boolean }
  | { type: 'SET_VALIDATION_ERROR'; payload: string }
  | { type: 'SET_SHOW_ERROR'; payload: boolean }
  | {
      type: 'PARSE_VALUE';
      payload: {
        country?: CountryCode;
        phoneNumber: string;
      };
    };

function phoneInputReducer(
  state: PhoneInputState,
  action: PhoneInputAction
): PhoneInputState {
  switch (action.type) {
    case 'SET_COUNTRY':
      return { ...state, selectedCountry: action.payload };
    case 'SET_PHONE_NUMBER':
      return { ...state, phoneNumber: action.payload };
    case 'SET_FOCUSED':
      return { ...state, isFocused: action.payload };
    case 'SET_VALIDATION_ERROR':
      return { ...state, validationError: action.payload };
    case 'SET_SHOW_ERROR':
      return { ...state, showError: action.payload };
    case 'PARSE_VALUE':
      return {
        ...state,
        ...(action.payload.country !== undefined
          ? { selectedCountry: action.payload.country }
          : {}),
        phoneNumber: action.payload.phoneNumber
      };
    default:
      return state;
  }
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
  const [state, dispatch] = useReducer(phoneInputReducer, {
    selectedCountry: null,
    phoneNumber: '',
    isFocused: false,
    validationError: '',
    showError: false
  });
  const { selectedCountry, phoneNumber, isFocused, validationError, showError } = state;

  // Merge countries with same phone code
  const countryList = useMemo(() => {
    const phoneCodeMap = new Map<string, CountryCode & { countryNames: string[]; [key: string]: unknown }>();

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
    dispatch({ type: 'SET_COUNTRY', payload: defaultCountry || countryList[0] });
  }, [defaultCountryCode, countryList]);

  // Parse value
  useEffect(() => {
    if (!value) {
      dispatch({ type: 'SET_PHONE_NUMBER', payload: '' });
      return;
    }

    if (typeof value === 'object') {
      if (value.countryCode !== '') {
        const country = countryList.find((c) => c.countryCode === value.countryCode);
        dispatch({
          type: 'PARSE_VALUE',
          payload: {
            country: country || undefined,
            phoneNumber: value.phoneNumber || ''
          }
        });
      } else {
        dispatch({ type: 'SET_PHONE_NUMBER', payload: value.phoneNumber || '' });
      }
    } else if (typeof value === 'string' && value.startsWith('+')) {
      // Parse +886912345678 format
      const numberPart = value.substring(1);
      const sortedCountries = [...countryList].sort(
        (a, b) => b.phoneCode.length - a.phoneCode.length
      );

      for (const country of sortedCountries) {
        if (numberPart.startsWith(country.phoneCode)) {
          dispatch({
            type: 'PARSE_VALUE',
            payload: {
              country,
              phoneNumber: numberPart.substring(country.phoneCode.length)
            }
          });
          break;
        }
      }
    } else {
      dispatch({ type: 'SET_PHONE_NUMBER', payload: String(value) });
    }
  }, [value, countryList]);

  const validatePhoneNumber = useCallback(() => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: '' });
      onValidate?.({ isValid: true, error: '' });
      return true;
    }

    // Use libphonenumber-js for validation
    try {
      const cleaned = phoneNumber.replace(/[\s\-()]/g, '');

      import('@/utils/third-party/check-phone').then(({ checkPhone }) => {
        const result = checkPhone(cleaned, selectedCountry?.phoneCode || '886');

        if (result.isValid) {
          dispatch({ type: 'SET_VALIDATION_ERROR', payload: '' });
          onValidate?.({ isValid: true, error: '' });
        } else {
          dispatch({ type: 'SET_VALIDATION_ERROR', payload: result.errorMessage });
          onValidate?.({ isValid: false, error: result.errorMessage });
        }
      });

      return true;
    } catch {
      const errorMsg = '請輸入有效的電話號碼';
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: errorMsg });
      onValidate?.({ isValid: false, error: errorMsg });
      return false;
    }
  }, [phoneNumber, selectedCountry, onValidate]);

  const emitValue = useCallback((currentPhoneNumber?: string) => {
    const phoneNumberValue = currentPhoneNumber !== undefined ? currentPhoneNumber : phoneNumber;
    const fullNumber = `+${selectedCountry?.phoneCode || ''}${phoneNumberValue}`;

    if (returnObject) {
      const valueObj: PhoneInputValue = {
        countryCode: selectedCountry?.countryCode || '',
        countryName: selectedCountry?.countryName || '',
        phoneCode: selectedCountry?.phoneCode || '',
        phoneNumber: phoneNumberValue,
        fullNumber
      };
      onChange?.(valueObj);
    } else {
      onChange?.(fullNumber);
    }
  }, [phoneNumber, selectedCountry, returnObject, onChange]);

  const handleCountryChange = useCallback((newCountryCode: string | number) => {
    const country = countryList.find((c) => c.countryCode === String(newCountryCode));
    if (typeof country === 'object' && country !== null) {
      dispatch({ type: 'SET_COUNTRY', payload: country });
      emitValue();
    }
  }, [countryList, emitValue]);

  const handlePhoneNumberInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^\d\s\-()]/g, '');
    dispatch({ type: 'SET_PHONE_NUMBER', payload: newValue });

    if (validate === true && validateOnInput === true) {
      validatePhoneNumber();
    } else {
      dispatch({ type: 'SET_SHOW_ERROR', payload: false });
    }

    // Pass new value directly to avoid using stale state
    emitValue(newValue);
  }, [validate, validateOnInput, validatePhoneNumber, emitValue]);

  const handleFocus = useCallback(() => {
    dispatch({ type: 'SET_FOCUSED', payload: true });
  }, []);

  const handleBlur = useCallback(() => {
    dispatch({ type: 'SET_FOCUSED', payload: false });
    if (validate === true) {
      validatePhoneNumber();
      dispatch({ type: 'SET_SHOW_ERROR', payload: true });
    }
  }, [validate, validatePhoneNumber]);

  const hasError = useMemo(
    () => validationError !== '' && showError === true,
    [validationError, showError]
  );
  const borderColor = useMemo(
    () => (hasError ? '#dc3545' : isFocused ? '#2c64e3' : '#d5d5d5'),
    [hasError, isFocused]
  );
  const boxShadow = useMemo(
    () =>
      hasError
        ? '0 0 0 2px rgba(220, 53, 69, 0.1)'
        : isFocused
        ? '0 0 0 2px rgba(44, 100, 227, 0.1)'
        : 'none',
    [hasError, isFocused]
  );

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
              <span className={`fi fi-${(option as CountryCode & { [key: string]: unknown }).countryCode?.toString().toLowerCase()} phone_input-country_selector-option-flag`} />
              <span className="phone_input-country_selector-option-name">{(option as CountryCode & { [key: string]: unknown }).countryName}</span>
              <span
                className="phone_input-country_selector-option-code"
                css-is-selected={selected ? 'true' : 'false'}
              >
                +{(option as CountryCode & { [key: string]: unknown }).phoneCode}
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

      {hasError === true && (
        <div className="phone_input-error">
          {validationError}
        </div>
      )}
    </div>
  );
}

export default PhoneInput;
