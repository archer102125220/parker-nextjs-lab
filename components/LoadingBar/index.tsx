'use client';

import './index.scss';

export interface LoadingBarProps {
  loading?: boolean;
  position?: 'absolute' | 'fixed' | 'relative' | 'sticky';
  height?: number;
  width?: string;
  color?: string;
  className?: string;
}

export function LoadingBar({
  loading = false,
  position = 'absolute',
  height = 6,
  width = '100%',
  color,
  className = ''
}: LoadingBarProps) {
  if (!loading) return null;

  const style = {
    '--loading_position': position,
    '--loading_width': width,
    '--loading_height': `${height}px`,
    ...(color && { '--loading_color': color })
  } as React.CSSProperties;

  return <div className={`loading_bar ${className}`} style={style} />;
}

export default LoadingBar;
