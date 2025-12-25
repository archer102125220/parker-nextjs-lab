'use client';

import { useState } from 'react';
import PhoneInput from '@/components/PhoneInput';
import type { PhoneInputValue } from '@/components/PhoneInput';
import style from '@/app/[locale]/components/phone-input/page.module.scss';

export default function PhoneInputTest() {
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneObject, setPhoneObject] = useState<PhoneInputValue | null>(null);
  const [validationResult, setValidationResult] = useState({
    isValid: true,
    error: ''
  });

  return (
    <>
      <div className={style['phone_input_test_page-section']}>
        <h2>基本用法 (返回字串)</h2>
        <PhoneInput
          value={phoneValue}
          onChange={(value) => setPhoneValue(value as string)}
          onValidate={setValidationResult}
        />
        <p className={style['phone_input_test_page-section-note']}>
          電話號碼: {phoneValue || '(未輸入)'}
        </p>
        <p
          className={`${style['phone_input_test_page-section-note']} ${validationResult.isValid ? style['phone_input_test_page-section-note--valid'] : style['phone_input_test_page-section-note--invalid']}`}
        >
          驗證狀態:{' '}
          {validationResult.isValid ? '✓ 有效' : `✗ ${validationResult.error}`}
        </p>
      </div>

      <div className={style['phone_input_test_page-section']}>
        <h2>返回物件格式</h2>
        <PhoneInput
          onChange={(value) => setPhoneObject(value as PhoneInputValue)}
          returnObject={true}
          defaultCountryCode="US"
        />
        {phoneObject && (
          <div className={style['phone_input_test_page-info_box']}>
            <p>
              <strong>國家代碼:</strong> {phoneObject.countryCode}
            </p>
            <p>
              <strong>國家名稱:</strong> {phoneObject.countryName}
            </p>
            <p>
              <strong>電話國碼:</strong> +{phoneObject.phoneCode}
            </p>
            <p>
              <strong>電話號碼:</strong> {phoneObject.phoneNumber}
            </p>
            <p>
              <strong>完整號碼:</strong> {phoneObject.fullNumber}
            </p>
          </div>
        )}
      </div>

      <div className={style['phone_input_test_page-section']}>
        <h2>即時驗證</h2>
        <PhoneInput
          validate={true}
          validateOnInput={true}
          placeholder="輸入時即時驗證"
        />
      </div>

      <div>
        <h2>停用狀態</h2>
        <PhoneInput value="+886912345678" disabled={true} />
      </div>
    </>
  );
}
