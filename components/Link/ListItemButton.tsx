'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import ListItemButton, {
  ListItemButtonProps
} from '@mui/material/ListItemButton';

import { Link } from '@/i18n/navigation';

// 讓 LinkListItemButton 支援 MUI ListItemButton 的所有 props，並且 component={Link} 時型別正確
export type _LinkListItemButtonProps = Omit<
  ListItemButtonProps<typeof Link>,
  'component'
>;
export interface LinkListItemButtonProps extends _LinkListItemButtonProps {
  nonce?: string;
}

export function LinkListItemButton(props: LinkListItemButtonProps): ReactNode {
  const { nonce, ...listItemButtonProps } = props;

  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return (
    <ListItemButton
      {...listItemButtonProps}
      component={Link}
      nonce={clientNonce}
    />
  );
}

export default LinkListItemButton;
