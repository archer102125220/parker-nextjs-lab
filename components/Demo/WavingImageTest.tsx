'use client';

import { useState } from 'react';
import WavingImage, {
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL
} from '@/components/Animation/WavingImage';
import style from '@/app/[locale]/animation/waving-image/page.module.scss';

export default function WavingImageTest() {
  const [isStopped, setIsStopped] = useState(false);

  return (
    <>
      <div className={style['waving_image_test_page-section']}>
        <h2>播放與暫停切換 (Toggle Stop)</h2>
        <div className={style['waving_image_test_page-section-controls']}>
          <button
            className={
              style['waving_image_test_page-section-controls-toggle_btn']
            }
            css-is-stopped={isStopped ? 'true' : 'false'}
            onClick={() => setIsStopped(!isStopped)}
          >
            {isStopped ? '▶ 開始播放 (Resume)' : '⏸ 暫停播放 (Pause)'}
          </button>
        </div>
        <div
          className={style['waving_image_test_page-section-image_container']}
        >
          <WavingImage
            className={
              style['waving_image_test_page-section-image_container-img']
            }
            src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
            stop={isStopped}
          />
        </div>
      </div>

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

      <div className={style['waving_image_test_page-section']}>
        <h2>大振幅 (Amplitude = 80)</h2>
        <div
          className={style['waving_image_test_page-section-image_container']}
        >
          <WavingImage
            className={
              style['waving_image_test_page-section-image_container-img']
            }
            src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
            amplitude={80}
          />
        </div>
      </div>

      <div className={style['waving_image_test_page-section']}>
        <h2>多週期 (Period = 5)</h2>
        <div
          className={style['waving_image_test_page-section-image_container']}
        >
          <WavingImage
            className={
              style['waving_image_test_page-section-image_container-img']
            }
            src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
            period={5}
          />
        </div>
      </div>

      <div className={style['waving_image_test_page-section']}>
        <h2>高頻率/快速 (Frequency = 3)</h2>
        <div
          className={style['waving_image_test_page-section-image_container']}
        >
          <WavingImage
            className={
              style['waving_image_test_page-section-image_container-img']
            }
            src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
            frequency={3}
          />
        </div>
      </div>

      <div className={style['waving_image_test_page-section']}>
        <h2>自訂波浪留白 (WavePadding = 0)</h2>
        <div
          className={style['waving_image_test_page-section-image_container']}
        >
          <WavingImage
            className={
              style['waving_image_test_page-section-image_container-img']
            }
            src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
            wavePadding={0}
          />
        </div>
      </div>
    </>
  );
}
