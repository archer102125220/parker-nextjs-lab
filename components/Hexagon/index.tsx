import type { ReactNode } from 'react';

import hexagonStyle from '@/components/Hexagon/hexagon.module.scss';

interface HexagonPropsType {
  className?: string;
}

export function Hexagon(props: HexagonPropsType): ReactNode {
  return (
    <div className={[hexagonStyle.hexagon, props.className].join(' ')}>
      <div className={hexagonStyle['hexagon-drawing']} />
    </div>
  );
}

export default Hexagon;
