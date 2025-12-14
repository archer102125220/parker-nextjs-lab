import { parsePhoneNumber, isValidPhoneNumber, PhoneNumber } from 'libphonenumber-js';

export interface PhoneValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export function checkPhone(phoneNumber: string, countryCode: string = '886'): PhoneValidationResult {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return {
      isValid: false,
      errorMessage: '請輸入電話號碼'
    };
  }

  try {
    // Clean the phone number
    const cleaned = phoneNumber.replace(/[\s\-()]/g, '');
    
    // Add country code if not present
    const fullNumber = cleaned.startsWith('+') ? cleaned : `+${countryCode}${cleaned}`;
    
    // Validate using libphonenumber-js
    const isValid = isValidPhoneNumber(fullNumber);
    
    if (!isValid) {
      return {
        isValid: false,
        errorMessage: '電話號碼格式不正確'
      };
    }

    // Parse for additional validation
    const parsed: PhoneNumber = parsePhoneNumber(fullNumber);
    
    if (!parsed.isValid()) {
      return {
        isValid: false,
        errorMessage: '電話號碼無效'
      };
    }

    return {
      isValid: true,
      errorMessage: ''
    };
  } catch {
    return {
      isValid: false,
      errorMessage: '電話號碼格式錯誤'
    };
  }
}

export default checkPhone;
