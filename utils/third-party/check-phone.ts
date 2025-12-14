import { isValidPhoneNumber, CountryCode as LibCountryCode } from 'libphonenumber-js';
import PHONE_AREA_CODE from '@/assets/phoneCountryCode';
import type { CountryCode } from '@/assets/phoneCountryCode';

export interface CheckPhoneResult {
  countryCodeError: boolean;
  phoneError: boolean;
  isValid: boolean;
  errorMessage: string;
}

export function checkPhone(phone = '000', phoneCode = ''): CheckPhoneResult {
  const result: CheckPhoneResult = {
    countryCodeError: false,
    phoneError: true,
    isValid: false,
    errorMessage: ''
  };

  // 檢查電話號碼是否為空
  if (!phone || phone.trim() === '') {
    result.phoneError = true;
    result.errorMessage = '請輸入電話號碼';
    return result;
  }

  // 檢查電話國碼格式
  if (typeof phoneCode !== 'string' || phoneCode === '') {
    result.countryCodeError = true;
    result.errorMessage = '無效的電話國碼';
    return result;
  }

  // 檢查電話號碼是否包含非數字字符（除了空格、括號、破折號）
  if (isNaN(Number(phone.replace(/[\s\-()]/g, '')))) {
    result.phoneError = true;
    result.errorMessage = '電話號碼格式不正確';
    return result;
  }

  try {
    // 根據電話國碼（phoneCode）查找對應的國家資訊
    const phoneAreaCodeObj: CountryCode | undefined = PHONE_AREA_CODE.find(
      (areaCode) =>
        areaCode.phoneCode.padStart(3, '0') === phoneCode.padStart(3, '0')
    );

    // 檢查是否找到對應的國家代碼
    if (!phoneAreaCodeObj || !phoneAreaCodeObj.countryCode) {
      result.countryCodeError = true;
      result.errorMessage = '無法識別的電話國碼';
      return result;
    }

    // 取得國家代碼（用於 libphonenumber-js）
    const countryCode = phoneAreaCodeObj.countryCode;

    // 構建完整電話號碼
    const fullNumber = `+${phoneCode}${phone.replace(/[\s\-()]/g, '')}`;

    // 使用 libphonenumber-js 驗證，傳入國家代碼以提高準確性
    const isValid = isValidPhoneNumber(fullNumber, countryCode as LibCountryCode);

    result.phoneError = !isValid;
    result.isValid = isValid;

    if (!isValid) {
      result.errorMessage = '電話號碼格式不正確';
    }

    return result;
  } catch (error) {
    result.phoneError = true;
    result.errorMessage = '電話號碼驗證失敗';
    return result;
  }
}

export function checkTelephone(telephone = '00000', areaCode = '02') {
  return /^0\d{1,3}-\d{5,8}$/.test(`${areaCode}-${telephone}`);
}
