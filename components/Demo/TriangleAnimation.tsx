'use client';
import { useAppSelector } from '@/store';

import AnimationTriangleEnter from '@/components/Animation/TriangleEnter';

export function TriangleAnimation() {
  const isMobile = useAppSelector<boolean>((state) => state.system.isMobile);

  return (
    <AnimationTriangleEnter isMobile={isMobile}>
      <p>test</p>
    </AnimationTriangleEnter>
  );
}

export default TriangleAnimation;
