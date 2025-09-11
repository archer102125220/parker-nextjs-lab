'use client';

import type { ReactNode } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { Link } from '@/i18n/navigation';

// 讓 LinkBox 支援 MUI Box 的所有 props，並且 component={Link} 時型別正確
export type BoxPropsProps = Omit<BoxProps<typeof Link>, 'component'>;

export function LinkBox(props: BoxPropsProps): ReactNode {
  return <Box component={Link} {...props} />;
}

export default LinkBox;
