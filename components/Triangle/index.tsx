import type { ReactNode, ElementType, CSSProperties, Ref } from 'react';
import { useMemo } from 'react';

// 在這份組件import的話會出現css覆蓋問題，因此改由使用頁面import
// import triangleStyle from '@/components/Triangle/triangle.module.scss';
// import '@/components/Triangle/triangle.scss';

interface TrianglePropsType {
  ref?: Ref<HTMLDivElement> | undefined;
  children?: ReactNode;
  renderLabel?: ElementType;
  className?: string;

  label?: string;
  height?: string | number;
  width?: string | number;
  size?: string | number;
  color?: string;
  angleUpperRight?: boolean;
  angleLowerLeft?: boolean;
  angleUpperLeft?: boolean;
  angleLowerRight?: boolean;
}

interface HexagonContainerCssVariableType extends CSSProperties {
  '--triangle_border_width'?: string | number;
  '--triangle_color'?: string;
}

export function Triangle(props: TrianglePropsType): ReactNode {
  const {
    ref,

    children,
    renderLabel,
    className = '',

    label = '',
    height,
    width,
    size,
    color = 'rgb(255, 121, 121)',
    angleUpperRight = false,
    angleLowerLeft = false,
    angleUpperLeft = true,
    angleLowerRight = false
  } = props;

  const cssVariable = useMemo<HexagonContainerCssVariableType>(
    function () {
      const _cssVariable: HexagonContainerCssVariableType = {};
      let safeHeight: string | number | null = null;
      let safeWidth: string | number | null = null;
      let safeColor: string | number | null = null;

      if (
        (typeof size !== 'string' && typeof size !== 'number') ||
        size === ''
      ) {
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
      } else if (typeof size === 'string' && size !== '') {
        safeHeight = size;
        safeWidth = size;
      } else if (typeof size === 'number') {
        safeHeight = `${size}px`;
        safeWidth = `${size}px`;
      }

      if (typeof color === 'string' && color !== '') {
        safeColor = color;
      }

      if (angleLowerLeft === true) {
        _cssVariable['--triangle_border_width'] =
          `0px ${safeHeight} ${safeWidth} 0px`;
        _cssVariable['--triangle_color'] = `${safeColor} transparent`;
      } else if (angleLowerRight === true) {
        _cssVariable['--triangle_border_width'] =
          `${safeHeight} ${safeWidth} 0px 0px`;
        _cssVariable['--triangle_color'] = `transparent ${safeColor}`;
      } else if (angleUpperRight === true) {
        _cssVariable['--triangle_border_width'] =
          `0px ${safeHeight} ${safeWidth} 0px`;
        _cssVariable['--triangle_color'] = `transparent ${safeColor}`;
      } else if (angleUpperLeft === true) {
        _cssVariable['--triangle_border_width'] =
          `0px 0px ${safeHeight} ${safeWidth}`;
        _cssVariable['--triangle_color'] = `transparent ${safeColor}`;
      }

      return _cssVariable;
    },
    [
      size,
      height,
      width,
      color,
      angleLowerLeft,
      angleLowerRight,
      angleUpperRight,
      angleUpperLeft
    ]
  );

  return (
    <div
      ref={ref}
      className={[className, 'triangle'].join(' ')}
      style={cssVariable}
    >
      <LabelElemt Element={renderLabel} label={label}>
        {children || <p>{label}</p>}
      </LabelElemt>
    </div>
  );
}

interface LabelElemtProps {
  children?: ReactNode;
  Element?: ElementType;
  label: string;
}

function LabelElemt(props: LabelElemtProps): ReactNode {
  const { Element, label, children } = props;
  if (typeof Element === 'string' || typeof Element === 'function') {
    return <Element label={label} />;
  }

  return children;
}

export default Triangle;
