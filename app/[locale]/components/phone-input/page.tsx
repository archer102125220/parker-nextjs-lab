'use client';

import { useState } from 'react';
import PhoneInput from '@/components/PhoneInput';
import type { PhoneInputValue } from '@/components/PhoneInput';

export default function PhoneInputPage() {
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneObject, setPhoneObject] = useState<PhoneInputValue | null>(null);
  const [validationResult, setValidationResult] = useState({ isValid: true, error: '' });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>PhoneInput 電話輸入組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示電話號碼輸入、國碼選擇和驗證功能
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本用法 (返回字串)</h2>
        <PhoneInput
          value={phoneValue}
          onChange={(value) => setPhoneValue(value as string)}
          onValidate={setValidationResult}
        />
        <p style={{ marginTop: '10px', color: '#666' }}>
          電話號碼: {phoneValue || '(未輸入)'}
        </p>
        <p style={{ marginTop: '5px', color: validationResult.isValid ? '#4caf50' : '#f44336' }}>
          驗證狀態: {validationResult.isValid ? '✓ 有效' : `✗ ${validationResult.error}`}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>返回物件格式</h2>
        <PhoneInput
          onChange={(value) => setPhoneObject(value as PhoneInputValue)}
          returnObject={true}
          defaultCountryCode="US"
        />
        {phoneObject && (
          <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <p><strong>國家代碼:</strong> {phoneObject.countryCode}</p>
            <p><strong>國家名稱:</strong> {phoneObject.countryName}</p>
            <p><strong>電話國碼:</strong> +{phoneObject.phoneCode}</p>
            <p><strong>電話號碼:</strong> {phoneObject.phoneNumber}</p>
            <p><strong>完整號碼:</strong> {phoneObject.fullNumber}</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>即時驗證</h2>
        <PhoneInput
          validate={true}
          validateOnInput={true}
          placeholder="輸入時即時驗證"
        />
      </div>

      <div>
        <h2>停用狀態</h2>
        <PhoneInput
          value="+886912345678"
          disabled={true}
        />
      </div>
    </div>
  );
}
