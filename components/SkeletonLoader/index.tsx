'use client';
import type { ReactNode } from 'react';

import '@/components/SkeletonLoader/skeleton-loader.scss';

export type SkeletonLoaderProps = {
  className?: string;
  loading?: boolean;
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function SkeletonLoader(props: SkeletonLoaderProps): ReactNode {
  const { className, loading, children, ...ortherProps } = props;

  return (
    <div
      {...ortherProps}
      className={['skeleton_loader', className].join(' ')}
      css-fadein={`${loading === false}`}
    >
      {loading === true ? (
        <div className="skeleton_loader-loading" />
      ) : (
        children
      )}
    </div>
  );
}

export default SkeletonLoader;
