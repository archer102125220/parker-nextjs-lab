'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function ImageUploadTestPage() {
  const [singleImage, setSingleImage] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleSingleImageChange = (file: File) => {
    setSingleImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>ImageUpload 圖片上傳測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示圖片上傳組件的各種用法
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>單張圖片上傳</h2>
        <ImageUpload
          value={singleImage}
          onChange={handleSingleImageChange}
          maxSize={5 * 1024 * 1024}
        />
        {previewUrl && (
          <div style={{ marginTop: '20px' }}>
            <h3>預覽:</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ maxWidth: '300px', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>

      <div>
        <h2>限制檔案大小 (1MB)</h2>
        <ImageUpload
          maxSize={1 * 1024 * 1024}
          onChange={(file) => console.log('Uploaded:', file)}
        />
      </div>
    </div>
  );
}
