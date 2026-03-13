'use client';
import  { memo, type ReactNode } from 'react';

import { usePathnameWithLocale } from '@/i18n/navigation';

import useGTMTrack from '@/hooks/useGTMTrack';

interface GTMInitProps {
  children?: ReactNode;
}

export const GTMScnOpen = memo(({ children }: GTMInitProps): ReactNode => {
  const pathname = usePathnameWithLocale(); // Full path with locale for GTM tracking
  useGTMTrack({ event: 'scnOpen', url: pathname });

  return children;
});
GTMScnOpen.displayName = 'GTMScnOpen';

export default GTMScnOpen;
