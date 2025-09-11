'use client';
import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import useGTMTrack from '@/hooks/useGTMTrack';

interface GTMInitProps {
  children?: ReactNode;
}

export function GTMScnOpen({ children }: GTMInitProps): ReactNode {
  const pathname = usePathname();
  useGTMTrack({ event: 'scnOpen', url: pathname });

  return children;
}

export default GTMScnOpen;
