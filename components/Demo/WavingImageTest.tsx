'use client';

import WavingImage, {
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL
} from '@/components/Animation/WavingImage';
import style from '@/app/[locale]/components/waving-image/page.module.scss';

export default function WavingImageTest() {
  return (
    <>
      <WavingImage
        src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
        direction={DIRECTION_HORIZONTAL}
      />
      <WavingImage
        src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
        direction={DIRECTION_VERTICAL}
      />
    </>
  );
}
