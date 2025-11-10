'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

import { Link } from '@/i18n/navigation';

// 讓 LinkIconButtonProps 支援 MUI IconButton 的所有 props，並且 component={Link} 時型別正確
export type _LinkIconButtonProps = Omit<
  IconButtonProps<typeof Link>,
  'component'
>;
export interface LinkIconButtonProps extends _LinkIconButtonProps {
  nonce?: string;
}

export function LinkIconButton(props: LinkIconButtonProps): ReactNode {
  const { nonce, ...iconButtonProps } = props;
  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return (
    <IconButton {...iconButtonProps} component={Link} nonce={clientNonce} />
  );
}

export default LinkIconButton;
