'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import style from '@/app/[locale]/components/image-upload-test/page.module.scss';

export default function ImageUploadTest() {
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
    <>
      <div className={style['image_upload_test_page-section']}>
        <h2>單張圖片上傳</h2>
        <ImageUpload
          value={singleImage}
          onChange={handleSingleImageChange}
          maxSize={5 * 1024 * 1024}
        />
        {previewUrl && (
          <div className={style['image_upload_test_page-preview']}>
            <h3>預覽:</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className={style['image_upload_test_page-preview_img']}
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
    </>
  );
}
