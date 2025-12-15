'use client';

import { useState } from 'react';
import EnterLabel from '@/components/EnterLabel';
import '../page.scss';

export default function EnterLabelTestPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [disabledValue, setDisabledValue] = useState('此欄位已禁用');
  const [errorField, setErrorField] = useState('');

  const validateEmail = (value: string) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : '請輸入有效的電子郵件地址';
  };

  const validatePassword = (value: string) => {
    if (!value) return '';
    return value.length >= 6 ? '' : '密碼至少需要 6 個字元';
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Enter Label 浮動標籤測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Material Design 風格的浮動標籤輸入框
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本示範</h2>
        <div style={{ marginBottom: '20px' }}>
          <EnterLabel
            label="姓名"
            value={name}
            onChange={setName}
            placeholder="請輸入您的姓名"
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <EnterLabel
            label="電子郵件"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="example@email.com"
            error={validateEmail(email)}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <EnterLabel
            label="密碼"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="至少 6 個字元"
            error={validatePassword(password)}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <EnterLabel
            label="電話號碼"
            value={phone}
            onChange={setPhone}
            type="tel"
            placeholder="0912-345-678"
          />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>狀態展示</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>禁用狀態</h3>
          <EnterLabel
            label="禁用欄位"
            value={disabledValue}
            onChange={setDisabledValue}
            disabled
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>錯誤狀態</h3>
          <EnterLabel
            label="錯誤欄位"
            value={errorField}
            onChange={setErrorField}
            error="此欄位有錯誤"
            placeholder="輸入任何內容"
          />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>表單預覽</h2>
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>當前表單值</h3>
          <pre style={{ 
            backgroundColor: '#fff', 
            padding: '12px', 
            borderRadius: '4px',
            fontSize: '14px',
            overflow: 'auto'
          }}>
            {JSON.stringify({
              name,
              email,
              password: password ? '••••••' : '',
              phone
            }, null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>功能說明</h2>
        <ul>
          <li>✅ 浮動標籤動畫效果</li>
          <li>✅ 聚焦時標籤上移並縮小</li>
          <li>✅ 支援錯誤狀態顯示</li>
          <li>✅ 支援禁用狀態</li>
          <li>✅ 支援必填標記 (*)</li>
          <li>✅ 支援多種輸入類型 (text, email, password, tel, number)</li>
          <li>✅ Material Design 風格</li>
        </ul>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>使用範例</h2>
        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
          <pre style={{ margin: 0, fontSize: '13px' }}>
{`<EnterLabel
  label="姓名"
  value={name}
  onChange={setName}
  placeholder="請輸入您的姓名"
  required
/>

<EnterLabel
  label="電子郵件"
  value={email}
  onChange={setEmail}
  type="email"
  error={emailError}
  required
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
