'use client';

import type { ReactNode } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Link } from '@/i18n/navigation';

// 讓 LinkIconButtonProps 支援 MUI IconButton 的所有 props，並且 component={Link} 時型別正確
export type LinkIconButtonProps = Omit<
  IconButtonProps<typeof Link>,
  'component'
>;

export function LinkIconButton(props: LinkIconButtonProps): ReactNode {
  return <IconButton component={Link} {...props} />;
}

export default LinkIconButton;
