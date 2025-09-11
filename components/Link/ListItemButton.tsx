'use client';

import type { ReactNode } from 'react';
import ListItemButton, {
  ListItemButtonProps
} from '@mui/material/ListItemButton';
import { Link } from '@/i18n/navigation';

// 讓 LinkListItemButton 支援 MUI ListItemButton 的所有 props，並且 component={Link} 時型別正確
export type LinkListItemButtonProps = Omit<
  ListItemButtonProps<typeof Link>,
  'component'
>;

export function LinkListItemButton(props: LinkListItemButtonProps): ReactNode {
  return <ListItemButton component={Link} {...props} />;
}

export default LinkListItemButton;
