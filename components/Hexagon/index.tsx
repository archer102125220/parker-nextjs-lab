import type { ReactNode } from 'react';

import hexagonStyle from '@/components/Hexagon/hexagon.module.scss';

export function Hexagon(): ReactNode {
  return (
    <div className={hexagonStyle.hexagon}>
      <div className={hexagonStyle['hexagon-drawing']} />
    </div>
  );
}

export default Hexagon;
