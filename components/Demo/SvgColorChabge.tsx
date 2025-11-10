'use client';
import type { ReactNode, CSSProperties } from 'react';
import { useState, useMemo } from 'react';
import { MuiColorInput } from 'mui-color-input';

import style from '@/app/[locale]/css-drawing/svg-color-change/page.module.scss';

interface SvgColorChabgeVariableType extends CSSProperties {
  '--change_color'?: string;
}

export function SvgColorChabge(): ReactNode {
  const [color, setColor] = useState<string>('#2c64e3');

  const cssVariable = useMemo<SvgColorChabgeVariableType>(
    function () {
      return { '--change_color': color };
    },
    [color]
  );
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <MuiColorInput format="hex" value={color} onChange={setColor} />
      </form>
      <div
        className={style['svg_color_change_page-pseudo_elements']}
        style={cssVariable}
      >
        <p>偽元素測試：</p>
      </div>
    </>
  );
}

export default SvgColorChabge;
