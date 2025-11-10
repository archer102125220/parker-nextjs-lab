'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

import { Link } from '@/i18n/navigation';

// 讓 LinkButton 支援 MUI Button 的所有 props，並且 component={Link} 時型別正確
export type _LinkButtonProps = Omit<ButtonProps<typeof Link>, 'component'>;
export interface LinkButtonProps extends _LinkButtonProps {
  nonce?: string;
}

export function LinkButton(props: LinkButtonProps): ReactNode {
  const { nonce, ...buttonProps } = props;

  console.log(JSON.stringify({ LinkButtonNonce: nonce }));
  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return <Button {...buttonProps} component={Link} nonce={clientNonce} />;
}

export default LinkButton;
