'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Box, { BoxProps } from '@mui/material/Box';

import { Link } from '@/i18n/navigation';

// 讓 LinkBox 支援 MUI Box 的所有 props，並且 component={Link} 時型別正確
export type _LinkBoxProps = Omit<BoxProps<typeof Link>, 'component'>;
export interface LinkBoxProps extends _LinkBoxProps {
  nonce?: string;
}

export function LinkBox(props: LinkBoxProps): ReactNode {
  const { nonce, ...boxProps } = props;

  console.log(JSON.stringify({ LinkBoxNonce: nonce }));
  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return <Box {...boxProps} component={Link} nonce={clientNonce} />;
}

export default LinkBox;
