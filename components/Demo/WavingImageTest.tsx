'use client';

import WavingImage, {
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL
} from '@/components/Animation/WavingImage';
import style from '@/app/[locale]/components/waving-image/page.module.scss';

export default function WavingImageTest() {
  return (
    <>
      <div className={style['waving_image_test_page-section']}>
        <h2>水平擺動 (Horizontal)</h2>
        <div
          className={style['waving_image_test_page-section-image_container']}
        >
          <WavingImage
            className={
              style['waving_image_test_page-section-image_container-img']
            }
            src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
            direction={DIRECTION_HORIZONTAL}
          />
        </div>
      </div>

      <div className={style['waving_image_test_page-section']}>
        <h2>垂直擺動 (Vertical)</h2>
        <div
          className={style['waving_image_test_page-section-image_container']}
        >
          <WavingImage
            className={
              style['waving_image_test_page-section-image_container-img']
            }
            src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
            direction={DIRECTION_VERTICAL}
          />
        </div>
      </div>
    </>
  );
}
