import type { ReactNode, CSSProperties } from 'react';
import { useMemo } from 'react';

import '@/components/Hexagon/container.scss';

interface HexagonContainerProps {
  children?: ReactNode;
  className?: string;
  height?: string | number;
  width?: string | number;
  maskColor?: string;
}

interface HexagonContainerCssVariableType extends CSSProperties {
  '--hexagon_width'?: string | number;
  '--hexagon_height'?: string | number;
  '--hexagon_mask_bg_color'?: string;
}

export function HexagonContainer(props: HexagonContainerProps): ReactNode {
  const {
    children,
    height = '120px',
    width = '100px',
    maskColor = '#007bff'
  } = props;

  const cssVariable = useMemo<HexagonContainerCssVariableType>(() => {
    const _cssVariable: HexagonContainerCssVariableType = {};
    let safeHeight = null;
    let safeWidth = null;
    let safeMaskColor = null;

    if (typeof height === 'string' && height !== '') {
      safeHeight = height;
    } else if (typeof height === 'number') {
      safeHeight = `${height}px`;
    }

    if (typeof width === 'string' && width !== '') {
      safeWidth = width;
    } else if (typeof width === 'number') {
      safeWidth = `${width}px`;
    }

    if (typeof maskColor === 'string' && maskColor !== '') {
      safeMaskColor = maskColor;
    }

    if (safeHeight !== null) {
      _cssVariable['--hexagon_height'] = safeHeight;
    }
    if (safeWidth !== null) {
      _cssVariable['--hexagon_width'] = safeWidth;
    }
    if (safeMaskColor !== null) {
      _cssVariable['--hexagon_mask_bg_color'] = safeMaskColor;
    }

    return _cssVariable;
  }, [height, width, maskColor]);

  return (
    <div
      className={['hexagon_container', props.className].join(' ')}
      style={cssVariable}
    >
      <div className="hexagon_container-top" />
      {children}
      <div className="hexagon_container-bottom" />
    </div>
  );
}

export default HexagonContainer;
